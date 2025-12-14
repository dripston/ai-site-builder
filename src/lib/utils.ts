import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get existing user ID from localStorage or create a new one
 * @returns The user ID
 */
export function getOrCreateUserId(): string {
  const USER_ID_KEY = 'user_id';
  
  // Check if user_id exists in localStorage
  let userId = localStorage.getItem(USER_ID_KEY);
  
  // If it doesn't exist, generate a new UUID
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  // Log the user_id in the console
  console.log(`[USER SESSION] user_id: ${userId}`);
  
  return userId;
}
