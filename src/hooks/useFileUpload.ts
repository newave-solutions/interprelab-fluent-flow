import { useState, useCallback } from 'react';
import { uploadFile, uploadToS3 } from '@/integrations/supabase/storage';
import { useToast } from '@/hooks/use-toast';

export interface UseFileUploadOptions {
  bucket: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  useS3Direct?: boolean; // Use direct S3 upload for better performance
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const { bucket, maxSize = 50 * 1024 * 1024, allowedTypes, useS3Direct = false } = options;
  const { toast } = useToast();
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file size
      if (file.size > maxSize) {
        return {
          valid: false,
          error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`,
        };
      }

      // Check file type
      if (allowedTypes && allowedTypes.length > 0) {
        const fileType = file.type;
        const isAllowed = allowedTypes.some((type) => {
          if (type.endsWith('/*')) {
            const baseType = type.split('/')[0];
            return fileType.startsWith(baseType + '/');
          }
          return fileType === type;
        });

        if (!isAllowed) {
          return {
            valid: false,
            error: `File type ${fileType} is not allowed`,
          };
        }
      }

      return { valid: true };
    },
    [maxSize, allowedTypes]
  );

  const uploadSingleFile = useCallback(
    async (file: File, path: string): Promise<{ success: boolean; url?: string; error?: string }> => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        toast({
          title: 'Upload failed',
          description: validation.error,
          variant: 'destructive',
        });
        return { success: false, error: validation.error };
      }

      // Initialize upload progress
      const uploadId = `${path}-${Date.now()}`;
      setUploads((prev) => {
        const next = new Map(prev);
        next.set(uploadId, {
          fileName: file.name,
          progress: 0,
          status: 'uploading',
        });
        return next;
      });

      try {
        let result;

        if (useS3Direct) {
          // Use direct S3 upload with progress tracking
          result = await uploadToS3({
            bucket,
            key: path,
            file,
            contentType: file.type,
            onProgress: (progress) => {
              setUploads((prev) => {
                const next = new Map(prev);
                const current = next.get(uploadId);
                if (current) {
                  next.set(uploadId, { ...current, progress });
                }
                return next;
              });
            },
          });

          if (!result.success) {
            throw new Error(result.error || 'Upload failed');
          }
        } else {
          // Use standard Supabase client
          const { data, error } = await uploadFile({
            bucket,
            path,
            file,
            contentType: file.type,
          });

          if (error) {
            throw error;
          }

          result = { success: true };
        }

        // Update upload status to success
        setUploads((prev) => {
          const next = new Map(prev);
          next.set(uploadId, {
            fileName: file.name,
            progress: 100,
            status: 'success',
          });
          return next;
        });

        toast({
          title: 'Upload successful',
          description: `${file.name} has been uploaded`,
        });

        // Get public URL
        const url = `https://iokgkrnbawhizmuejluz.storage.supabase.co/storage/v1/object/public/${bucket}/${path}`;

        return { success: true, url };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';

        // Update upload status to error
        setUploads((prev) => {
          const next = new Map(prev);
          next.set(uploadId, {
            fileName: file.name,
            progress: 0,
            status: 'error',
            error: errorMessage,
          });
          return next;
        });

        toast({
          title: 'Upload failed',
          description: errorMessage,
          variant: 'destructive',
        });

        return { success: false, error: errorMessage };
      }
    },
    [bucket, validateFile, useS3Direct, toast]
  );

  const uploadMultipleFiles = useCallback(
    async (files: File[], pathPrefix: string): Promise<Array<{ success: boolean; file: File; url?: string; error?: string }>> => {
      const results = await Promise.all(
        files.map(async (file) => {
          const path = `${pathPrefix}/${file.name}`;
          const result = await uploadSingleFile(file, path);
          return { ...result, file };
        })
      );

      return results;
    },
    [uploadSingleFile]
  );

  const clearUploads = useCallback(() => {
    setUploads(new Map());
  }, []);

  const removeUpload = useCallback((uploadId: string) => {
    setUploads((prev) => {
      const next = new Map(prev);
      next.delete(uploadId);
      return next;
    });
  }, []);

  return {
    uploadSingleFile,
    uploadMultipleFiles,
    uploads: Array.from(uploads.entries()).map(([id, progress]) => ({ id, ...progress })),
    clearUploads,
    removeUpload,
  };
};
