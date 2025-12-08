/**
 * Authentication Service
 *
 * Handles user authentication state, token management, and auto-login
 *
 * Features:
 * - Token storage and retrieval from AsyncStorage
 * - Token validation (checks expiration)
 * - Auto-login functionality
 * - Secure token management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// API base URL
const getApiBaseUrl = (): string => {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL as string;
  if (envBaseUrl) return envBaseUrl;
  return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
};

export interface UserData {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserData;
  expiresIn?: number; // Token expiry in seconds
}

/**
 * Save authentication token and user data to AsyncStorage
 */
export const saveAuthData = async (
  token: string,
  user: UserData,
  expiresIn?: number,
): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, token],
      [USER_DATA_KEY, JSON.stringify(user)],
    ]);

    // Calculate expiry timestamp if provided
    if (expiresIn) {
      const expiryTimestamp = Date.now() + expiresIn * 1000;
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
    }

    console.log('Auth data saved successfully');
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

/**
 * Retrieve authentication token from AsyncStorage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Retrieve user data from AsyncStorage
 */
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Check if the current token is still valid (not expired)
 */
export const isTokenValid = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    if (!token) return false;

    // Check expiry timestamp if it exists
    const expiryStr = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
    if (expiryStr) {
      const expiryTimestamp = parseInt(expiryStr, 10);
      const now = Date.now();
      if (now >= expiryTimestamp) {
        console.log('Token has expired');
        await clearAuthData();
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};

/**
 * Validate token with backend API
 */
export const validateTokenWithBackend = async (token: string): Promise<boolean> => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.valid === true;
    }

    return false;
  } catch (error) {
    console.error('Error validating token with backend:', error);
    // If validation fails, assume token is still valid locally
    // This allows offline functionality
    return true;
  }
};

/**
 * Clear all authentication data from AsyncStorage
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      AUTH_TOKEN_KEY,
      USER_DATA_KEY,
      TOKEN_EXPIRY_KEY,
    ]);
    console.log('Auth data cleared successfully');
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Check if user is logged in and token is valid
 * Returns token if valid, null otherwise
 */
export const checkAutoLogin = async (): Promise<{
  token: string;
  user: UserData;
} | null> => {
  try {
    const isValid = await isTokenValid();
    if (!isValid) return null;

    const token = await getAuthToken();
    const user = await getUserData();

    if (token && user) {
      console.log('Auto-login successful for user:', user.email);
      return {token, user};
    }

    return null;
  } catch (error) {
    console.error('Error during auto-login check:', error);
    return null;
  }
};

/**
 * Logout user - clears all auth data
 */
export const logout = async (): Promise<void> => {
  await clearAuthData();
  console.log('User logged out successfully');
};

/**
 * Refresh authentication token (if backend supports it)
 */
export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const currentToken = await getAuthToken();
    if (!currentToken) return null;

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        const user = await getUserData();
        if (user) {
          await saveAuthData(data.token, user, data.expiresIn);
        }
        return data.token;
      }
    }

    return null;
  } catch (error) {
    console.error('Error refreshing auth token:', error);
    return null;
  }
};
