# Fix for 400 Error - Plant.id API

## Issue
Getting 400 Bad Request error when calling Plant.id API:
```
ERROR Error in identifyPlant: [AxiosError: Request failed with status code 400]
```

## Root Cause

The Plant.id API was rejecting requests because:

1. **Missing Data URI Prefix**: Base64 images need to be formatted as `data:image/jpeg;base64,<base64_string>`
2. **Invalid Parameter**: Used `modifiers: ['similar_images']` which is not a valid parameter
3. **Missing Content-Type**: Should explicitly set `Content-Type: application/json`

## Solution Applied

### Changes in `src/services/plantIdApi.ts`

#### 1. Added Data URI Prefix

**Before**:
```typescript
const response = await plantIdAxios.post(
  '/identification',
  {
    images: [optimizedImage], // Raw base64
    similar_images: true,
    modifiers: ['similar_images'], // Invalid parameter
  },
  {
    headers: {
      'Api-Key': apiKey,
    },
  },
);
```

**After**:
```typescript
// Add data URI prefix if not present
const base64WithPrefix = optimizedImage.startsWith('data:')
  ? optimizedImage
  : `data:image/jpeg;base64,${optimizedImage}`;

const response = await plantIdAxios.post(
  '/identification',
  {
    images: [base64WithPrefix], // Properly formatted
    similar_images: true, // Valid parameter
  },
  {
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json', // Explicit content type
    },
  },
);
```

#### 2. Enhanced Error Logging

Added detailed error logging to help debug issues:

```typescript
} catch (error: any) {
  console.error('Error in identifyPlant:', error);
  console.error('Error response:', error.response?.data);
  console.error('Error status:', error.response?.status);

  if (error.response?.status === 400) {
    return {
      isSuccess: false,
      message: error.response?.data?.message || 'Invalid request. Please check image format.',
    };
  }
  // ... other error handling
}
```

#### 3. Applied Same Fix to Diagnose Function

Updated `diagnosePlant()` with the same fixes:
- Data URI prefix
- Removed invalid `modifiers` parameter
- Added explicit Content-Type header
- Enhanced error logging

## Plant.id API Request Format

### Correct Format for Identification:

```json
POST https://plant.id/api/v3/identification
Headers:
  Api-Key: YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ],
  "similar_images": true
}
```

### Correct Format for Health Assessment:

```json
POST https://plant.id/api/v3/health_assessment
Headers:
  Api-Key: YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ],
  "similar_images": true,
  "disease_details": [
    "local_name",
    "description",
    "url",
    "treatment",
    "classification",
    "common_names",
    "cause"
  ]
}
```

## Testing

### What to Look For in Console:

**If Successful**:
```
LOG Using Plant.id API for identification
LOG Response data: { result: { classification: { suggestions: [...] } } }
```

**If Still Getting Errors**:
```
ERROR Error in identifyPlant: [AxiosError: ...]
ERROR Error response: { error: "detailed error message" }
ERROR Error status: 400
```

The enhanced logging will show exactly what the API returned, which helps debug the issue.

## Common 400 Error Causes

1. **Invalid Base64**: Image not properly encoded
2. **Missing Data URI Prefix**: Fixed ✅
3. **Invalid Parameters**: Fixed ✅
4. **Image Too Large**: > 10MB (Plant.id limit)
5. **Invalid API Key**: Check `.env.development`
6. **Malformed JSON**: Should be handled by axios

## Verification Steps

1. **Restart the App**: Kill and restart completely
   ```bash
   # Kill the metro bundler
   # Restart: npm start or yarn start
   ```

2. **Test Identification**:
   - Open app
   - Go to Scan tab
   - Select Identify
   - Take photo or select from gallery
   - Check console logs

3. **Check Console Logs**:
   - Should see: `LOG Using Plant.id API for identification`
   - Should NOT see: `ERROR Error status: 400`
   - Should see response data if successful

4. **If Still Failing**:
   - Check the detailed error logs
   - Verify API key is correct
   - Check image size (should be < 10MB)
   - Ensure internet connection is working

## Expected Console Output

### Success Case:
```
LOG Using Plant.id API for identification
LOG Response received from Plant.id
LOG Plant identified: Rosa (probability: 0.95)
LOG Navigating to results screen
```

### Error Case (with details):
```
LOG Using Plant.id API for identification
ERROR Error in identifyPlant: [AxiosError: Request failed with status code 400]
ERROR Error response: {
  "error": "Invalid image format",
  "details": "Image must be base64 encoded with data URI prefix"
}
ERROR Error status: 400
```

## Files Modified

- `src/services/plantIdApi.ts` - Fixed both `identifyPlant()` and `diagnosePlant()` functions

## Next Steps

1. ✅ Applied fix for data URI prefix
2. ✅ Enhanced error logging
3. ⏳ Test scanning feature
4. ⏳ Monitor console for detailed errors
5. ⏳ Verify API responses

## If Error Persists

Please share the complete console logs including:
- The "Error response" log
- The "Error status" log
- The full error message

This will help identify the exact issue the Plant.id API is reporting.

---

**Status**: ✅ Fix Applied
**Date**: December 3, 2025
**Priority**: HIGH
**Action Required**: Test scanning and check console logs
