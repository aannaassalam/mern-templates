// Test file for AWS upload functionality
// This is for development/testing purposes only

// import { uploadToAWS } from '@/services/apis/upload.api';

/**
 * Test function to verify AWS upload functionality
 * @param file - File to test upload with
 */
export const testAWSUpload = async (file: File) => {
  try {
    console.log('Testing AWS upload with file:', file.name);

    const response = { data: { url: '' } };
    // const response = await uploadToAWS(file);

    console.log('Upload successful!');
    console.log('Response:', response);
    console.log('Uploaded URL:', response.data.url);

    return response;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Interface for AWS upload response
interface UploadResponse {
  status: number;
  message: string;
  data?: {
    url?: string;
    key?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Validate the response structure matches expected format
 * @param response - Response from AWS upload
 */
export const validateUploadResponse = (
  response: unknown
): response is UploadResponse => {
  if (typeof response !== 'object' || response === null) {
    return false;
  }

  const resp = response as Record<string, unknown>;
  const isValid =
    typeof resp.status === 'number' &&
    typeof resp.message === 'string' &&
    (!resp.data ||
      (typeof resp.data === 'object' &&
        resp.data !== null &&
        typeof (resp.data as Record<string, unknown>).url === 'string' &&
        typeof (resp.data as Record<string, unknown>).url === 'string' &&
        ((resp.data as Record<string, unknown>).url as string).startsWith(
          'https://'
        )));

  if (!isValid) {
    console.error('Invalid response structure:', response);
  }

  return isValid;
};

// Example usage:
// const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
// testAWSUpload(file).then(response => {
//   if (validateUploadResponse(response)) {
//     console.log('Upload and validation successful!');
//   }
// });
