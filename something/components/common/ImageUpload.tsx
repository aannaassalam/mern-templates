'use client';

import { ImageIcon, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
// import { uploadToAWS } from '@/services/apis/upload.api';
import {
  generatePreviewUrl,
  revokePreviewUrl,
  validateImageFile,
} from '@/utils/fileValidation';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URL
      const preview = generatePreviewUrl(file);
      setPreviewUrl(preview);

      // Upload to AWS
      // const response = await uploadToAWS(file);
      const response = await { status: 200, data: { url: '' } };

      if (response.status === 200 && response.data?.url) {
        // Revoke the preview URL and use the uploaded URL
        revokePreviewUrl(preview);
        setPreviewUrl(response.data.url);
        onChange(response.data.url);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setPreviewUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onChange('');
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload area */}
      <div
        className={`
          relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-200
          ${
            previewUrl
              ? 'border-blue-200 bg-blue-50/20'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/10'
          }
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() =>
          !disabled && !isUploading && fileInputRef.current?.click()
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled && !isUploading && fileInputRef.current) {
              fileInputRef.current.click();
            }
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Click to upload image"
      >
        {previewUrl ? (
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Profile preview"
              width={200}
              height={128}
              className="h-32 w-full object-cover"
            />
            {/* Remove button */}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2 size-8 rounded-full p-0 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled || isUploading}
            >
              <X className="size-4" />
            </Button>

            {/* Upload overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="size-8 animate-spin text-blue-500" />
                <p className="text-sm text-gray-600">Uploading image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-8 text-gray-400" />
                  <Upload className="size-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Upload Profile Photo
                </p>
                <p className="text-xs text-gray-500">
                  Click or drag image here
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload button for mobile */}
      <div className="mt-2 flex justify-center sm:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 size-4" />
              Choose Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
