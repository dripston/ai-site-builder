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

/**
 * Host HTML content on ngrok via local server
 * @param htmlContent The HTML content to host
 * @returns The ngrok URL where the HTML is hosted
 */
export async function hostHtmlOnNgrok(htmlContent: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3003/host-html', { // Updated port to 3003
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ htmlContent }),
    });

    if (!response.ok) {
      throw new Error(`Failed to host HTML: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error hosting HTML on ngrok:', error);
    throw new Error('Failed to host HTML on ngrok');
  }
}

/**
 * Push HTML content to a new GitHub repository
 * @param htmlContent The HTML content to push
 * @param repoName The name of the repository to create
 * @param githubToken GitHub personal access token
 * @returns The URL of the created repository
 */
export async function pushHtmlToGithub(
  htmlContent: string,
  repoName: string,
  githubToken: string
): Promise<string> {
  try {
    // Validate repository name
    if (!repoName || repoName.trim() === '') {
      throw new Error('Repository name is required');
    }

    // Sanitize repository name (only alphanumeric, hyphens, and underscores)
    const sanitizedRepoName = repoName.trim().replace(/[^a-zA-Z0-9-_]/g, '-');
    
    // Create a new repository
    const repoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        name: sanitizedRepoName,
        description: 'Website generated with AI Site Builder',
        auto_init: false, // We'll initialize with our HTML file
        private: false, // Public repository
      }),
    });

    if (!repoResponse.ok) {
      const errorText = await repoResponse.text();
      let errorMessage = `Failed to create repository: ${repoResponse.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = `Failed to create repository: ${errorData.message}`;
        }
      } catch (e) {
        // If we can't parse the error as JSON, use the raw text
        errorMessage = `Failed to create repository: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const repoData = await repoResponse.json();
    const repoFullName = repoData.full_name;
    const repoUrl = repoData.html_url;

    // Encode HTML content to base64 (handling Unicode characters)
    const encoder = new TextEncoder();
    const data = encoder.encode(htmlContent);
    const binary = String.fromCharCode(...data);
    const base64Content = btoa(binary);

    // Create the HTML file in the repository
    const fileResponse = await fetch(`https://api.github.com/repos/${repoFullName}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: 'Initial commit: Add generated website',
        content: base64Content, // Encode HTML as base64
        branch: 'main',
      }),
    });

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      let errorMessage = `Failed to push file to repository: ${fileResponse.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = `Failed to push file to repository: ${errorData.message}`;
        }
      } catch (e) {
        // If we can't parse the error as JSON, use the raw text
        errorMessage = `Failed to push file to repository: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    return repoUrl;
  } catch (error) {
    console.error('Error pushing HTML to GitHub:', error);
    throw new Error(`Failed to push HTML to GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}