/**
 * Token management utilities
 */

export interface TokenPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  is_admin: boolean;
  is_active: boolean;
  iat: number;
  exp: number;
}

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

/**
 * Extract user data from JWT token payload
 */
export const getUserFromToken = (token: string): Partial<TokenPayload> | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      is_admin: payload.is_admin,
      is_active: payload.is_active,
      iat: payload.iat,
      exp: payload.exp
    };
  } catch {
    return null;
  }
};

/**
 * Get token expiration time in milliseconds
 */
export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

/**
 * Get time remaining until token expires (in milliseconds)
 */
export const getTokenTimeRemaining = (token: string): number => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return 0;
  
  const timeRemaining = expirationTime - Date.now();
  return Math.max(0, timeRemaining);
};

/**
 * Check if token will expire within specified minutes
 */
export const willTokenExpireSoon = (token: string, minutesThreshold: number = 5): boolean => {
  const timeRemaining = getTokenTimeRemaining(token);
  const thresholdMs = minutesThreshold * 60 * 1000;
  return timeRemaining > 0 && timeRemaining <= thresholdMs;
};

/**
 * Validate session storage flags consistency
 */
export const validateSessionFlags = (isAdmin: boolean): boolean => {
  const adminFlag = sessionStorage.getItem('adminAuthenticated') === 'true';
  const institutionFlag = sessionStorage.getItem('userLoggedIn') === 'true';
  
  // Check for invalid states
  if (adminFlag && institutionFlag) return false; // Both flags shouldn't be true
  if (isAdmin && !adminFlag) return false; // Admin user should have admin flag
  if (!isAdmin && !institutionFlag) return false; // Institution user should have institution flag
  
  return true;
};

/**
 * Clear all authentication-related session storage
 */
export const clearAuthSession = (): void => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('adminAuthenticated');
  sessionStorage.removeItem('userLoggedIn');
};

/**
 * Get current token from session storage
 */
export const getCurrentToken = (): string | null => {
  return sessionStorage.getItem('token');
};

/**
 * Check if user is currently authenticated based on token and session flags
 */
export const isAuthenticated = (): boolean => {
  const token = getCurrentToken();
  if (!token || isTokenExpired(token)) return false;
  
  const tokenData = getUserFromToken(token);
  if (!tokenData) return false;
  
  return validateSessionFlags(tokenData.is_admin || false);
};

/**
 * Get current user role from token
 */
export const getCurrentUserRole = (): string | null => {
  const token = getCurrentToken();
  if (!token) return null;
  
  const tokenData = getUserFromToken(token);
  return tokenData?.role || null;
};

/**
 * Check if current user is admin
 */
export const isCurrentUserAdmin = (): boolean => {
  const token = getCurrentToken();
  if (!token) return false;
  
  const tokenData = getUserFromToken(token);
  return tokenData?.is_admin || false;
}; 