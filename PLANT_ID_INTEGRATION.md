# Plant.id API Integration Guide

## Overview

This document describes the Plant.id API integration for plant identification and health diagnosis features in the application.

## Changes Made

### 1. New API Service Layer (`src/services/plantIdApi.ts`)

Created a centralized service for all Plant.id API calls with the following features:

- **Automatic Retry Logic**: Retries failed requests up to 2 times with 1-second delays
- **Better Error Handling**: Comprehensive error handling for network issues, timeouts, and API errors
- **Increased Timeout**: Timeout increased from 12s to 30s for better reliability
- **Type Safety**: Full TypeScript type definitions for all API responses
- **Modular Design**: Easy to maintain and test

#### Available Functions:

```typescript
// Identify a plant from an image
identifyPlant(base64Image: string, apiKey: string): Promise<ApiResponse<PlantIdentifyResult[]>>

// Diagnose plant health issues
diagnosePlant(base64Image: string, apiKey: string): Promise<ApiResponse<PlantDiagnoseResult[]>>

// Get status of an identification request (async operations)
getIdentificationStatus(accessToken: string, apiKey: string): Promise<any>
```

### 2. Image Optimization Service (`src/services/imageOptimizer.ts`)

Handles image preparation before API upload:

- **Image Validation**: Checks image size (max 10MB by default)
- **Base64 Conversion**: Efficient conversion from file URI to base64
- **Size Checking**: Reports image size for monitoring
- **Batch Processing**: Can prepare multiple images at once
- **Extensible**: Ready for future compression libraries integration

#### Available Functions:

```typescript
// Convert image URI to base64
convertImageToBase64(uri: string): Promise<string>

// Validate image size
validateImageSize(uri: string, maxSizeMB: number): Promise<boolean>

// Prepare image for upload with validation
prepareImageForUpload(uri: string, options?: ImageOptimizationOptions): Promise<{base64: string, sizeInBytes: number, isValid: boolean}>

// Batch prepare multiple images
prepareImagesForUpload(uris: string[], options?: ImageOptimizationOptions): Promise<Array<...>>
```

### 3. API Response Caching (`src/services/apiCache.ts`)

Implements intelligent caching to reduce API calls and improve performance:

- **In-Memory Cache**: Fast access for recent requests
- **Persistent Cache**: Stores results in AsyncStorage for app restarts
- **Automatic Expiration**: Configurable TTL (Time To Live), default 1 hour
- **Cache Invalidation**: Manual and automatic cache clearing
- **Smart Cache Keys**: Generates unique keys based on endpoint and parameters

#### Available Functions:

```typescript
// Set cache entry
setCache<T>(key: string, data: T, ttl?: number, persistent?: boolean): Promise<void>

// Get cache entry
getCache<T>(key: string, checkPersistent?: boolean): Promise<T | null>

// Clear specific cache
clearCache(key: string): Promise<void>

// Clear all cache
clearAllCache(): Promise<void>

// Wrapper for API calls with caching
cacheApiCall<T>(endpoint: string, params: any, apiCall: () => Promise<T>, options?: {...}): Promise<T>
```

### 4. Updated ScanScreen

Refactored to use the new service layer:

- Cleaner code with better separation of concerns
- Improved error handling and user feedback
- Image validation before upload
- Better loading states and timeout handling

## API Configuration

### Environment Variables (`.env.development`)

```bash
# Plant.id API endpoints
API_IDENTIFY="https://plant.id/api/v3/identification"
API_DIAGNOSE="https://plant.id/api/v3/health_assessment?details=local_name,description,url,treatment,classification,common_names,cause"

# API Key - Updated to new key
API_KEY_PLANTID=6vreK7HvtHySVCblnr0vnWUyjXNj3oLgDwEqFa58CQcgKFYQIn

# Google Gemini AI (for enhanced results)
API_KEY_GENAI=AIzaSyB7z4Jc1iA6sXZ3mVcMdkD882YS0s1nGTI
AI_MODEL="gemini-1.5-flash"
```

## Performance Improvements

1. **Retry Logic**: Automatically retries failed requests, reducing user frustration
2. **Better Timeout**: 30-second timeout instead of 12 seconds for more reliable results
3. **Image Validation**: Warns users about large images that may cause issues
4. **Error Recovery**: Graceful handling of network issues and server errors
5. **Code Organization**: Cleaner, more maintainable code structure

## API Response Structure

### Identification Response

```typescript
{
  isSuccess: boolean;
  message: string;
  data?: PlantIdentifyResult[] // Array of top 3 results
}

interface PlantIdentifyResult {
  name: string;
  probability: number;
  image: string;
  scientific_name?: string;
  common_names?: string[];
  similar_images?: Array<{url: string; similarity: number}>;
}
```

### Diagnosis Response

```typescript
{
  isSuccess: boolean;
  message: string;
  data?: PlantDiagnoseResult[] // Array of top 3 results
}

interface PlantDiagnoseResult {
  name: string;
  probability: number;
  similar_images: Array<{url: string; similarity: number}>;
  description?: string;
  treatment?: {
    chemical?: string[];
    biological?: string[];
    prevention?: string[];
  };
}
```

## Usage Examples

### Premium User Flow (Plant.id API)

```typescript
// In ScanScreen.tsx - identifyPlantPremium function
const identifyPlantPremium = async (prompt: string, imageUri: string) => {
  const apiKey = keyScan; // From Redux store

  // 1. Prepare image
  const {base64, isValid} = await prepareImageForUpload(imageUri);

  // 2. Call Plant.id API
  const response = await PlantIdApi.identifyPlant(base64, apiKey);

  // 3. Process results
  if (response.isSuccess) {
    const results = response.data;
    // ... enhance with AI and navigate to results
  }
};
```

### With Caching (Optional)

```typescript
import {cacheApiCall} from '~/services/apiCache';

const result = await cacheApiCall(
  'identify',
  {imageHash: '...'}, // params for cache key
  () => PlantIdApi.identifyPlant(base64, apiKey),
  {
    ttl: 3600000, // 1 hour
    persistent: true, // save to AsyncStorage
    skipCache: false, // set to true to force fresh request
  }
);
```

## Error Handling

The new API service handles various error scenarios:

- **401 Unauthorized**: Invalid API key
- **429 Rate Limit**: Too many requests
- **500+ Server Errors**: Automatically retried
- **Timeout Errors**: Automatically retried
- **Network Errors**: User-friendly error messages
- **Bad Image**: Validation and appropriate warnings

## Future Enhancements

### 1. Image Compression

Install and integrate image compression library:

```bash
npm install react-native-image-resizer
# or
npm install react-native-image-manipulator
```

Then update `imageOptimizer.ts` to use actual compression.

### 2. Advanced Caching

- Implement cache warming for frequently requested plants
- Add cache statistics and monitoring
- Implement smart cache eviction strategies

### 3. Offline Support

- Store recent results for offline viewing
- Queue requests when offline and sync when back online

### 4. Performance Monitoring

- Add request timing metrics
- Track success/failure rates
- Monitor API key usage

## Testing

### Manual Testing Checklist

- [ ] Test plant identification with camera
- [ ] Test plant identification with gallery image
- [ ] Test plant diagnosis with camera
- [ ] Test plant diagnosis with gallery image
- [ ] Test with large images (>5MB)
- [ ] Test with poor network conditions
- [ ] Test error handling (invalid API key)
- [ ] Test timeout scenarios
- [ ] Verify retry logic works
- [ ] Check loading states

### API Testing

You can test the API directly using the service:

```typescript
import * as PlantIdApi from '~/services/plantIdApi';

// Test identification
const testIdentify = async () => {
  const base64 = '...'; // your test image
  const apiKey = '6vreK7HvtHySVCblnr0vnWUyjXNj3oLgDwEqFa58CQcgKFYQIn';

  const result = await PlantIdApi.identifyPlant(base64, apiKey);
  console.log('Result:', result);
};
```

## Troubleshooting

### Issue: Requests Timing Out

- Check network connectivity
- Verify API key is valid
- Reduce image size
- Check Plant.id service status

### Issue: Poor Results

- Ensure image quality is good
- Make sure plant is clearly visible
- Try different angles
- Verify lighting is adequate

### Issue: API Key Errors

- Verify API key in `.env.development`
- Check key permissions on Plant.id dashboard
- Verify key usage limits

## References

- [Plant.id API Documentation](https://documenter.getpostman.com/view/24599534/2s93z5A4v2)
- [Plant.id Health Assessment](https://web.plant.id/plant-health-assessment/)
- [Plant.id Identification API](https://www.kindwise.com/plant-id)

## Support

For issues or questions:
1. Check the Plant.id FAQ: https://web.plant.id/faq/
2. Review API documentation
3. Contact Plant.id support for API-specific issues
