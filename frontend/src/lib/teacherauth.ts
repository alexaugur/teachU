import { jwtDecode } from "jwt-decode";
import { TeacherUser } from "./types";

// Get the user by decoding the token from local storage
export const getAuthenticatedTeacherUser = (): TeacherUser => {
  const token = localStorage.getItem("teacherToken") as string;
  const decodedToken = jwtDecode<TeacherUser>(token);
  return decodedToken;
};

// Get the token from local storage
export const getAuthenticatedTeacherUserToken = (): string | null => {
  return localStorage.getItem("teacherToken");
};

export const storeAuthenticatedTeacherUserToken = (token: string): void => {
  localStorage.setItem("teacherToken", token);
};

export const removeAuthenticatedTeacherUserToken = (): void => {
  localStorage.removeItem("teacherToken");
};

export const isTeacherTokenExpired = (token: string): boolean => {
  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTimestamp = Date.now() / 1000; // current time in seconds
    return decodedToken.exp < currentTimestamp;
  } catch (error) {
    // If there's an error in decoding, assume the token is invalid/expired
    return true;
  }
};
