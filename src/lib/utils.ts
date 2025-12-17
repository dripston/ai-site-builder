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
    // Create a new repository
    const repoResponse = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        name: repoName,
        description: 'Website generated with AI Site Builder',
        auto_init: false, // We'll initialize with our HTML file
        private: false, // Public repository
      }),
    });

    if (!repoResponse.ok) {
      const errorData = await repoResponse.json();
      throw new Error(`Failed to create repository: ${errorData.message || repoResponse.statusText}`);
    }

    const repoData = await repoResponse.json();
    const repoFullName = repoData.full_name;
    const repoUrl = repoData.html_url;

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
        content: btoa(htmlContent), // Encode HTML as base64
        branch: 'main',
      }),
    });

    if (!fileResponse.ok) {
      const errorData = await fileResponse.json();
      throw new Error(`Failed to push file to repository: ${errorData.message || fileResponse.statusText}`);
    }

    return repoUrl;
  } catch (error) {
    console.error('Error pushing HTML to GitHub:', error);
    throw new Error(`Failed to push HTML to GitHub: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
