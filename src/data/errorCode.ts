export type Error = {
  SUCCESS: string;
  NO_INTERNET_CONNECTION: string;
  NO_CAMERA_PERMISSION: string;
  NO_GARLLERY_PERMISSION: string;
  NO_CAMERA_DEVICE_FOUND: string;
  SOME_THING_WENT_WRONG: string;
  AI_SERVER_DOWN: string;
  AI_IMAGE_CANNOT_TRANSLATE: string;
  IMAGE_CONVERT_FAILER: string;
  PLANT_EXISTED: string;
  BAD_IMAGE: string;
  HEALTHY_PLANT: string;
  NO_IMAGE_FOUND: string;
};

export const ERROR_MSG: Error = {
  SUCCESS: 'Success',
  NO_INTERNET_CONNECTION:
    'No internet connection. Please check your connection and try again.',
  NO_CAMERA_PERMISSION:
    'Camera permission denied. Please go to settings and enable camera permission.',
  NO_GARLLERY_PERMISSION:
    'Gallery permission denied. Please go to settings and enable gallery permission.',
  NO_CAMERA_DEVICE_FOUND:
    'No camera device found. Please check your camera and try again.',
  SOME_THING_WENT_WRONG: 'Something went wrong. Please try again later!',
  AI_SERVER_DOWN: 'AI server is down. Please try again later!',
  AI_IMAGE_CANNOT_TRANSLATE:
    'Image cannot be translated. Please try another image!',
  IMAGE_CONVERT_FAILER: 'Image convert failed. Please try again later!',
  PLANT_EXISTED: 'This plant already exists in garden.',
  BAD_IMAGE: 'Bad image. Please try another image.',
  HEALTHY_PLANT: 'Your plant is healthy!',
  NO_IMAGE_FOUND: 'No image found',
};
