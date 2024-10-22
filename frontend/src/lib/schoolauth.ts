import { jwtDecode } from "jwt-decode";
import { SchoolUser } from "./types";

// Get the user by decoding the token from local storage
export const getAuthenticatedSchoolUser = (): SchoolUser => {
  const token = localStorage.getItem("schoolToken") as string;
  const decodedToken = jwtDecode<SchoolUser>(token);
  return decodedToken;
};

// Get the token from local storage
export const getAuthenticatedSchoolUserToken = (): string | null => {
  return localStorage.getItem("schoolToken");
};

export const getAuthenticatedSchoolRefreshToken = (): string | null => {
  return localStorage.getItem("schoolRefreshToken");
};

export const storeAuthenticatedSchoolUserToken = (token: string): void => {
  localStorage.setItem("schoolToken", token);
};

export const storeAuthenticatedSchoolRefreshToken = (token: string): void => {
  localStorage.setItem("schoolRefreshToken", token);
};


export const removeAuthenticatedSchoolUserToken = (): void => {
  localStorage.removeItem("schoolToken");
  localStorage.removeItem("schoolRefreshToken");

};

export const isSchoolTokenExpired = (token: string): boolean => {
  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTimestamp = Date.now() / 1000; // current time in seconds
    return decodedToken.exp < currentTimestamp;
  } catch (error) {
    // If there's an error in decoding, assume the token is invalid/expired
    return true;
  }
};