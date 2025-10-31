import { useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

interface FileUploadExampleProps {
  bucket?: string;
  userId?: string;
}

export const FileUploadExample = ({
  bucket = 'user-uploads',
  userId = 'demo-user'
}: FileUploadExampleProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const { uploadSingleFile, uploads, clearUploads } = useFileUpload({
    bucket,
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['image/*', 'application/pdf', 'audio/*', 'video/*'],
    useS3Direct: true, // Use direct S3 upload for better performance
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const timestamp = Date.now();
    const path = `${userId}/uploads/${timestamp}-${selectedFile.name}`;

    const result = await uploadSingleFile(selectedFile, path);

    if (result.success && result.url) {
      setUploadedUrl(result.url);
      setSelectedFile(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadedUrl(null);
    clearUploads();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>File Upload to Supabase S3</CardTitle>
        <CardDescription>
          Upload files to your Supabase storage bucket with progress tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={handleFileSelect}
            className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {selectedFile && (
            <Button onClick={handleUpload} disabled={uploads.length > 0}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          )}
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {uploads.map((upload) => (
          <div key={upload.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{upload.fileName}</span>
              {upload.status === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {upload.status === 'error' && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>

            {upload.status === 'uploading' && (
              <Progress value={upload.progress} className="h-2" />
            )}

            {upload.status === 'error' && (
              <p className="text-sm text-red-500">{upload.error}</p>
            )}
          </div>
        ))}

        {/* Success Message */}
        {uploadedUrl && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm font-medium text-green-800 mb-2">
              ✓ File uploaded successfully!
            </p>
            <p className="text-xs text-green-600 break-all">{uploadedUrl}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => window.open(uploadedUrl, '_blank')}
            >
              View File
            </Button>
          </div>
        )}

        {/* Clear Button */}
        {(uploads.length > 0 || uploadedUrl) && (
          <Button variant="outline" onClick={handleClear} className="w-full">
            Clear
          </Button>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Maximum file size: 50MB</p>
          <p>• Allowed types: Images, PDFs, Audio, Video</p>
          <p>• Files are stored in: {bucket}/{userId}/uploads/</p>
        </div>
      </CardContent>
    </Card>
  );
};
