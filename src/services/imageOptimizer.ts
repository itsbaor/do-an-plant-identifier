import RNFS from 'react-native-fs';

/**
 * Image optimization utilities for better performance
 * These utilities help reduce image size before uploading to APIs
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, where 1 is best quality
}

/**
 * Convert image URI to base64
 * @param uri - Image URI (can be file:// or regular path)
 * @returns Base64 string
 */
export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    // Remove file:// prefix if present
    const path = uri.replace('file://', '');
    const base64Data = await RNFS.readFile(path, 'base64');
    return base64Data;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Get image file size in bytes
 * @param uri - Image URI
 * @returns File size in bytes
 */
export const getImageSize = async (uri: string): Promise<number> => {
  try {
    const path = uri.replace('file://', '');
    const stat = await RNFS.stat(path);
    return stat.size;
  } catch (error) {
    console.error('Error getting image size:', error);
    return 0;
  }
};

/**
 * Validate image size
 * @param uri - Image URI
 * @param maxSizeMB - Maximum size in MB (default 10MB)
 * @returns true if valid, false otherwise
 */
export const validateImageSize = async (
  uri: string,
  maxSizeMB: number = 10,
): Promise<boolean> => {
  try {
    const sizeInBytes = await getImageSize(uri);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB <= maxSizeMB;
  } catch (error) {
    console.error('Error validating image size:', error);
    return false;
  }
};

/**
 * Optimize base64 image by reducing string length
 * This is a simple optimization. For better results, install:
 * - react-native-image-resizer
 * - react-native-image-manipulator
 *
 * @param base64 - Base64 image string
 * @param options - Optimization options
 * @returns Optimized base64 string
 */
export const optimizeBase64 = (
  base64: string,
  options: ImageOptimizationOptions = {},
): string => {
  // For now, return as is
  // In production with proper libraries, implement actual compression
  return base64;
};

/**
 * Prepare image for API upload
 * Handles validation and optimization
 *
 * @param uri - Image URI
 * @param options - Optimization options
 * @returns Object with base64 and metadata
 */
export const prepareImageForUpload = async (
  uri: string,
  options: ImageOptimizationOptions = {},
): Promise<{
  base64: string;
  sizeInBytes: number;
  isValid: boolean;
}> => {
  try {
    // Validate size
    const isValid = await validateImageSize(uri);

    if (!isValid) {
      console.warn('Image size exceeds maximum allowed size');
    }

    // Get size
    const sizeInBytes = await getImageSize(uri);

    // Convert to base64
    const base64 = await convertImageToBase64(uri);

    // Optimize if needed
    const optimizedBase64 = optimizeBase64(base64, options);

    return {
      base64: optimizedBase64,
      sizeInBytes,
      isValid,
    };
  } catch (error) {
    console.error('Error preparing image for upload:', error);
    throw error;
  }
};

/**
 * Batch prepare multiple images
 * @param uris - Array of image URIs
 * @param options - Optimization options
 */
export const prepareImagesForUpload = async (
  uris: string[],
  options: ImageOptimizationOptions = {},
): Promise<Array<{base64: string; sizeInBytes: number; isValid: boolean}>> => {
  try {
    const promises = uris.map(uri => prepareImageForUpload(uri, options));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error preparing images for upload:', error);
    throw error;
  }
};

export default {
  convertImageToBase64,
  getImageSize,
  validateImageSize,
  optimizeBase64,
  prepareImageForUpload,
  prepareImagesForUpload,
};
