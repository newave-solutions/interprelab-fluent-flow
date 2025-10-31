import { supabase } from './client';

/**
 * Storage utility for handling file uploads and downloads with Supabase Storage
 * Configured with S3 credentials for backend operations
 *
 * For large file uploads with progress tracking, use the s3-client module instead
 */

// Re-export S3 client utilities for convenience
export * from './s3-client';

export interface UploadOptions {
  bucket: string;
  path: string;
  file: File | Blob;
  contentType?: string;
}

export interface DownloadOptions {
  bucket: string;
  path: string;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async ({ bucket, path, file, contentType }: UploadOptions) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || file.type,
        upsert: false,
      });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { data: null, error };
  }
};

/**
 * Download a file from Supabase Storage
 */
export const downloadFile = async ({ bucket, path }: DownloadOptions) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { data: null, error };
  }
};

/**
 * Get public URL for a file
 */
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

/**
 * Delete a file from storage
 */
export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { data: null, error };
  }
};

/**
 * List files in a bucket path
 */
export const listFiles = async (bucket: string, path: string = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error listing files:', error);
    return { data: null, error };
  }
};

/**
 * Create a signed URL for temporary access
 */
export const createSignedUrl = async (bucket: string, path: string, expiresIn: number = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return { data: null, error };
  }
};
