/**
 * Direct S3 client for Supabase Storage
 * Uses the S3-compatible API endpoint for better performance
 */

const S3_ENDPOINT = import.meta.env.VITE_SUPABASE_STORAGE_URL || 'https://iokgkrnbawhizmuejluz.storage.supabase.co';
const S3_REGION = 'us-east-1';

export interface S3UploadOptions {
  bucket: string;
  key: string;
  file: File | Blob;
  contentType?: string;
  metadata?: Record<string, string>;
  onProgress?: (progress: number) => void;
}

/**
 * Generate a presigned URL for direct S3 upload
 * This bypasses the Supabase client for better performance with large files
 */
export const getPresignedUploadUrl = async (
  bucket: string,
  key: string,
  contentType: string
): Promise<{ url: string; fields: Record<string, string> }> => {
  // This would typically call your backend to generate a presigned URL
  // For now, we'll use the standard Supabase storage endpoint
  const url = `${S3_ENDPOINT}/storage/v1/object/${bucket}/${key}`;

  return {
    url,
    fields: {
      'Content-Type': contentType,
    },
  };
};

/**
 * Upload file directly to S3 with progress tracking
 */
export const uploadToS3 = async ({
  bucket,
  key,
  file,
  contentType,
  metadata = {},
  onProgress,
}: S3UploadOptions): Promise<{ success: boolean; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Add metadata
    Object.entries(metadata).forEach(([k, v]) => {
      formData.append(k, v);
    });

    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          onProgress(progress);
        }
      });
    }

    return new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: xhr.statusText });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({ success: false, error: 'Network error' });
      });

      const url = `${S3_ENDPOINT}/storage/v1/object/${bucket}/${key}`;
      xhr.open('POST', url);

      // Add authorization header (you'll need to get this from Supabase auth)
      const token = localStorage.getItem('supabase.auth.token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  } catch (error) {
    console.error('S3 upload error:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Get optimized public URL for a file
 */
export const getS3PublicUrl = (bucket: string, key: string): string => {
  return `${S3_ENDPOINT}/storage/v1/object/public/${bucket}/${key}`;
};

/**
 * Get authenticated URL for private files
 */
export const getS3AuthenticatedUrl = (bucket: string, key: string): string => {
  return `${S3_ENDPOINT}/storage/v1/object/authenticated/${bucket}/${key}`;
};

/**
 * Generate a download URL with custom filename
 */
export const getS3DownloadUrl = (
  bucket: string,
  key: string,
  filename?: string
): string => {
  const baseUrl = `${S3_ENDPOINT}/storage/v1/object/public/${bucket}/${key}`;
  if (filename) {
    return `${baseUrl}?download=${encodeURIComponent(filename)}`;
  }
  return baseUrl;
};

/**
 * Batch upload multiple files
 */
export const batchUploadToS3 = async (
  uploads: S3UploadOptions[]
): Promise<Array<{ success: boolean; key: string; error?: string }>> => {
  const results = await Promise.all(
    uploads.map(async (upload) => {
      const result = await uploadToS3(upload);
      return {
        ...result,
        key: upload.key,
      };
    })
  );

  return results;
};

/**
 * Get storage usage statistics
 */
export const getStorageStats = async (bucket: string): Promise<{
  totalSize: number;
  fileCount: number;
  error?: string;
}> => {
  try {
    // This would call your backend to get storage stats
    // For now, return placeholder data
    return {
      totalSize: 0,
      fileCount: 0,
    };
  } catch (error) {
    return {
      totalSize: 0,
      fileCount: 0,
      error: String(error),
    };
  }
};
