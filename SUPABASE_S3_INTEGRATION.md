# Supabase S3 Storage Integration

## Overview
This project is now integrated with Supabase S3 storage for handling file uploads, downloads, and media management across the InterpreLab platform.

## Configuration

### Environment Variables
The following S3 credentials have been added to `.env`:

```env
SUPABASE_S3_ACCESS_KEY_ID=s3kry496ed223828ce69bfb00ffd588637601
SUPABASE_S3_SECRET_ACCESS_KEY=4859a1db4c48ba7ba1e2222a2b714deb1cb62079d80d4d87e5e7f3fea1a8342d
SUPABASE_S3_REGION=us-east-1
SUPABASE_S3_ENDPOINT=https://iokgkrnbawhizmuejluz.storage.supabase.co/storage/v1/s3
SUPABASE_STORAGE_URL=https://iokgkrnbawhizmuejluz.storage.supabase.co
```

### Endpoints
- **Storage API**: `https://iokgkrnbawhizmuejluz.storage.supabase.co`
- **S3 Compatible API**: `https://iokgkrnbawhizmuejluz.storage.supabase.co/storage/v1/s3`
- **Region**: `us-east-1`

### Storage Buckets
Four storage buckets have been configured:

1. **user-uploads** (Private)
   - User-specific file uploads
   - Max size: 50MB
   - Allowed types: images, PDFs, audio, video

2. **study-materials** (Public)
   - Educational content and study resources
   - Max size: 50MB
   - Allowed types: images, PDFs, text files

3. **flashcard-media** (Public)
   - Media for flashcards (images, audio)
   - Max size: 10MB
   - Allowed types: images, audio

4. **call-recordings** (Private)
   - Medical interpretation call recordings
   - Max size: 100MB
   - Allowed types: audio, video

## Usage

### Option 1: Using the React Hook (Recommended)
```typescript
import { useFileUpload } from '@/hooks/useFileUpload';

function MyComponent() {
  const { uploadSingleFile, uploads } = useFileUpload({
    bucket: 'user-uploads',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/*', 'application/pdf'],
    useS3Direct: true, // Enable direct S3 upload with progress
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await uploadSingleFile(file, `user-id/documents/${file.name}`);
      if (result.success) {
        console.log('File uploaded:', result.url);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      {uploads.map((upload) => (
        <div key={upload.id}>
          {upload.fileName}: {upload.progress}%
        </div>
      ))}
    </div>
  );
}
```

### Option 2: Using Storage Utilities Directly
```typescript
import {
  uploadFile,
  downloadFile,
  getPublicUrl,
  deleteFile,
  listFiles,
  createSignedUrl,
  uploadToS3, // Direct S3 upload with progress
} from '@/integrations/supabase/storage';
```

### Upload a file
```typescript
const file = event.target.files[0];
const { data, error } = await uploadFile({
  bucket: 'user-uploads',
  path: `${userId}/documents/${file.name}`,
  file: file,
  contentType: file.type
});
```

### Get public URL
```typescript
const publicUrl = getPublicUrl('study-materials', 'path/to/file.pdf');
```

### Create signed URL (temporary access)
```typescript
const { data, error } = await createSignedUrl(
  'call-recordings',
  'user-id/recording.mp3',
  3600 // expires in 1 hour
);
```

### List files in a directory
```typescript
const { data, error } = await listFiles('user-uploads', 'user-id/documents');
```

### Delete a file
```typescript
const { data, error } = await deleteFile('user-uploads', 'path/to/file.pdf');
```

## Security

### Row Level Security (RLS)
All storage buckets have RLS policies configured:

- **Private buckets**: Users can only access their own files (organized by user ID)
- **Public buckets**: Anyone can read, authenticated users can upload

### Best Practices
1. Always organize private files by user ID: `{userId}/folder/file.ext`
2. Use signed URLs for temporary access to private files
3. Validate file types and sizes on the client before uploading
4. Never expose the S3 secret access key in client-side code

## Setup Instructions

### 1. Run migrations
```bash
npx supabase db push
```

### 2. Verify storage configuration
```bash
npx supabase storage ls
```

### 3. Test upload functionality
Use the storage utilities in your components to test file operations.

## Integration Points

### InterpreStudy
- Upload study materials and flashcard media
- Store user-generated content

### InterpreCoach
- Store call recordings (HIPAA compliant)
- Upload reference materials

### InterpreLink
- Store consultation documents
- Upload medical terminology resources

### CallTracker
- Store call recordings and notes
- Upload supporting documentation

## Troubleshooting

### Upload fails with 403 error
- Check that the user is authenticated
- Verify the file path follows the correct pattern for private buckets
- Ensure RLS policies are properly configured

### File not found
- Verify the bucket name and file path are correct
- Check if the file was successfully uploaded
- Ensure you have permission to access the file

### Large file uploads timeout
- Consider implementing chunked uploads for files > 50MB
- Use signed URLs for direct S3 uploads
- Increase timeout settings if needed

## Next Steps

1. Implement file upload UI components
2. Add progress indicators for large uploads
3. Set up automatic cleanup for old files
4. Configure CDN for public assets
5. Implement file compression for images
