import { useState, useCallback, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { ChatSidebar } from '@/components/sidebar/ChatSidebar';
import { chatHistoryMock, getRandomMockResponse } from '@/lib/mockData';
import { getOrCreateUserId } from '@/lib/utils';

// Define the structure of the API response
interface ApiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  htmlCode?: string;
  timestamp: string; // ISO string from API
}

interface UserData {
  messages?: ApiMessage[];
  // Add other properties if they exist in the API response
}

// Predefined responses for greetings
const greetingResponses = [
  "Hello there! I'm here to help you create amazing websites. Tell me what kind of website you'd like to build!",
  "Hi! I'm your AI website builder assistant. What website project can I help you with today?",
  "Hey! Ready to build something great? Just describe the website you have in mind and I'll create it for you.",
  "Greetings! I can help you generate HTML websites based on your descriptions. What would you like to create?"
];

// Simple greeting detection
const isGreeting = (message: string): boolean => {
  const lowerMessage = message.toLowerCase().trim();
  const greetings = [
    'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'
  ];
  
  // Check for exact matches or messages that start with a greeting
  return greetings.some(greeting => 
    lowerMessage === greeting || 
    lowerMessage.startsWith(greeting + ' ') ||
    lowerMessage.startsWith(greeting + ',')
  );
};

// Get a random greeting response
const getRandomGreetingResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * greetingResponses.length);
  return greetingResponses[randomIndex];
};

// Type for AI service response
type AIServiceResponse = string | object | unknown;

// Extract HTML from AI response
const extractHtmlFromResponse = (response: AIServiceResponse): string | null => {
  try {
    console.log('[HTML EXTRACTION] Raw response:', response);
    
    // If response is already a string, try to parse it as JSON
    let data = response;
    if (typeof response === 'string') {
      try {
        data = JSON.parse(response);
        console.log('[HTML EXTRACTION] Parsed as JSON:', data);
      } catch (e) {
        // If it's not JSON, treat as plain text
        console.log('[HTML EXTRACTION] Not valid JSON, treating as plain text');
        data = response;
      }
    }
    
    // If it's an object, look for HTML in common keys
    if (typeof data === 'object' && data !== null) {
      const commonKeys = ['html', 'code', 'result', 'content', 'output', 'response'];
      for (const key of commonKeys) {
        if (data[key] && typeof data[key] === 'string') {
          console.log(`[HTML EXTRACTION] Found HTML in key '${key}'`);
          return extractHtmlFromString(data[key]);
        }
      }
      // If no common keys found, convert to string and try to extract
      console.log('[HTML EXTRACTION] No common keys found, converting to string');
      return extractHtmlFromString(JSON.stringify(data));
    }
    
    // If it's a string, try to extract HTML directly
    if (typeof data === 'string') {
      console.log('[HTML EXTRACTION] Processing as string');
      return extractHtmlFromString(data);
    }
    
    console.log('[HTML EXTRACTION] Unable to process response type:', typeof data);
    return null;
  } catch (error) {
    console.error('[HTML EXTRACTION ERROR] Error extracting HTML from response:', error);
    return null;
  }
};

// Type for streaming response lines
interface StreamingResponseLine {
  status?: string;
  message?: string;
  progress?: number;
  result?: {
    code?: string;
    html?: string;
    [key: string]: string | object | number | boolean | null | undefined;
  };
  [key: string]: string | object | number | boolean | null | undefined;
}

// Extract HTML from string using regex patterns
const extractHtmlFromString = (content: string): string | null => {
  console.log('[HTML EXTRACTION] Attempting to extract HTML from string (length: ' + content.length + ')');
  
  // Handle streaming responses with multiple "data:" lines
  if (content.includes('data:')) {
    console.log('[HTML EXTRACTION] Detected streaming response format with multiple lines');
    try {
      // Split by newlines to get individual data lines
      const lines = content.split('\n').filter(line => line.trim() !== '');
      console.log(`[HTML EXTRACTION] Found ${lines.length} lines`);
      
      // Process each line
      let lastResult: StreamingResponseLine | null = null;
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            // Remove "data:" prefix and parse as JSON
            const jsonData = line.substring(5).trim();
            const parsed: StreamingResponseLine = JSON.parse(jsonData);
            console.log('[HTML EXTRACTION] Parsed streaming line:', parsed);
            
            // Store the last parsed object (likely the completed one)
            lastResult = parsed;
            
            // If this is a completed status with result, extract HTML immediately
            if (parsed.status === 'completed' && parsed.result) {
              console.log('[HTML EXTRACTION] Found completed status with result:', parsed.result);
              
              // FIX: Look for result.code instead of result.html
              if (parsed.result.code && typeof parsed.result.code === 'string') {
                console.log('[HTML EXTRACTION] Found HTML in result.code');
                
                // The result.code contains both the <think> section and the HTML
                // We need to extract just the HTML part after the closing </think> tag
                const codeContent = parsed.result.code;
                
                // Check if there's a <think> section and extract what comes after it
                const thinkEndIndex = codeContent.indexOf('</think>');
                if (thinkEndIndex !== -1) {
                  // Extract everything after the closing </think> tag
                  const htmlContent = codeContent.substring(thinkEndIndex + 8).trim();
                  console.log('[HTML EXTRACTION] Extracted HTML after </think>');
                  
                  // Try to extract HTML from markdown code blocks
                  const extractedHtml = extractHtmlFromMarkdownCodeBlock(htmlContent);
                  if (extractedHtml) {
                    return extractedHtml;
                  }
                  // If no markdown found, try to extract HTML directly
                  const directHtml = extractDirectHtml(htmlContent);
                  if (directHtml) {
                    return directHtml;
                  }
                  // If still not found, return the HTML as is
                  return htmlContent;
                } else {
                  // No <think> tag found, try to extract HTML directly
                  const extractedHtml = extractHtmlFromMarkdownCodeBlock(codeContent);
                  if (extractedHtml) {
                    return extractedHtml;
                  }
                  // Try to extract HTML directly
                  const directHtml = extractDirectHtml(codeContent);
                  if (directHtml) {
                    return directHtml;
                  }
                  // If still not found, return the code as is
                  return codeContent;
                }
              }
              
              // Also check for other possible keys
              const commonKeys = ['html', 'content', 'output', 'response'];
              for (const key of commonKeys) {
                if (parsed.result[key] && typeof parsed.result[key] === 'string') {
                  console.log(`[HTML EXTRACTION] Found HTML in result.${key}`);
                  const extractedHtml = extractHtmlFromMarkdownCodeBlock(parsed.result[key]);
                  if (extractedHtml) {
                    return extractedHtml;
                  }
                }
              }
            }
          } catch (e) {
            console.log('[HTML EXTRACTION] Could not parse line:', line);
          }
        }
      }
      
      // If we didn't find HTML in a completed status, check the last result
      if (lastResult && lastResult.result) {
        console.log('[HTML EXTRACTION] Checking last result for HTML');
        
        // FIX: Look for result.code
        if (lastResult.result.code && typeof lastResult.result.code === 'string') {
          console.log('[HTML EXTRACTION] Found HTML in last result.code');
          
          const codeContent = lastResult.result.code;
          // Extract HTML after </think> tag
          const thinkEndIndex = codeContent.indexOf('</think>');
          if (thinkEndIndex !== -1) {
            const htmlContent = codeContent.substring(thinkEndIndex + 8).trim();
            const extractedHtml = extractHtmlFromMarkdownCodeBlock(htmlContent);
            if (extractedHtml) {
              return extractedHtml;
            }
            const directHtml = extractDirectHtml(htmlContent);
            if (directHtml) {
              return directHtml;
            }
            return htmlContent;
          } else {
            const extractedHtml = extractHtmlFromMarkdownCodeBlock(codeContent);
            if (extractedHtml) {
              return extractedHtml;
            }
            const directHtml = extractDirectHtml(codeContent);
            if (directHtml) {
              return directHtml;
            }
            return codeContent;
          }
        }
        
        // Check other keys
        const commonKeys = ['html', 'content', 'output', 'response'];
        for (const key of commonKeys) {
          if (lastResult.result[key] && typeof lastResult.result[key] === 'string') {
            console.log(`[HTML EXTRACTION] Found HTML in last result.${key}`);
            const extractedHtml = extractHtmlFromMarkdownCodeBlock(lastResult.result[key]);
            if (extractedHtml) {
              return extractedHtml;
            }
          }
        }
      }
      
      console.log('[HTML EXTRACTION] No HTML found in streaming data');
      return null;
    } catch (e) {
      console.log('[HTML EXTRACTION] Error processing streaming data:', e);
    }
  }
  
  // Handle single "data:" prefix
  if (content.startsWith('data:')) {
    console.log('[HTML EXTRACTION] Detected single streaming response format');
    try {
      // Remove "data:" prefix and parse as JSON
      const jsonData = content.substring(5).trim();
      const parsed: StreamingResponseLine = JSON.parse(jsonData);
      console.log('[HTML EXTRACTION] Parsed streaming data:', parsed);
      
      // Look for HTML in the parsed data
      if (parsed.result && parsed.result.html && typeof parsed.result.html === 'string') {
        console.log('[HTML EXTRACTION] Found HTML in streaming data result');
        return extractHtmlFromMarkdownCodeBlock(parsed.result.html);
      }
      
      // Check other common keys in result
      if (parsed.result) {
        const commonKeys = ['html', 'code', 'content', 'output', 'response'];
        for (const key of commonKeys) {
          if (parsed.result[key] && typeof parsed.result[key] === 'string') {
            console.log(`[HTML EXTRACTION] Found HTML in result.${key}`);
            return extractHtmlFromMarkdownCodeBlock(parsed.result[key]);
          }
        }
      }
      
      const commonKeys = ['html', 'code', 'result', 'content', 'output', 'response'];
      for (const key of commonKeys) {
        if (parsed[key] && typeof parsed[key] === 'string') {
          console.log(`[HTML EXTRACTION] Found HTML in streaming data key '${key}'`);
          return extractHtmlFromMarkdownCodeBlock(parsed[key]);
        }
      }
      
      // If HTML found directly in the parsed data
      if (typeof parsed === 'string') {
        content = parsed;
      } else {
        content = JSON.stringify(parsed);
      }
    } catch (e) {
      console.log('[HTML EXTRACTION] Could not parse streaming data, processing as plain text');
    }
  }
  
  // Handle markdown code blocks first
  const markdownExtracted = extractHtmlFromMarkdownCodeBlock(content);
  if (markdownExtracted) {
    return markdownExtracted;
  }
  
  // Try to extract HTML directly
  const directHtml = extractDirectHtml(content);
  if (directHtml) {
    return directHtml;
  }
  
  console.log('[HTML EXTRACTION] No HTML patterns found');
  return null;
};

// Helper function to extract HTML directly from content
const extractDirectHtml = (content: string): string | null => {
  // Search for the full HTML document from <!DOCTYPE to </html>
  const doctypePattern = /<!DOCTYPE html.*?<\/html>/is;
  const doctypeMatch = content.match(doctypePattern);
  if (doctypeMatch) {
    console.log('[HTML EXTRACTION] Found complete HTML document with DOCTYPE');
    return doctypeMatch[0];
  }
  
  // Search for HTML document from <html to </html>
  const htmlPattern = /<html.*?<\/html>/is;
  const htmlMatch = content.match(htmlPattern);
  if (htmlMatch) {
    console.log('[HTML EXTRACTION] Found HTML document with html tag');
    return htmlMatch[0];
  }
  
  // Check if content contains HTML-like structure
  if (content.toLowerCase().includes('<html') || content.toLowerCase().includes('<!doctype')) {
    console.log('[HTML EXTRACTION] Detected HTML-like structure');
    // Try to find start and end positions
    const lowerContent = content.toLowerCase();
    let start = lowerContent.indexOf('<!doctype');
    if (start === -1) {
      start = lowerContent.indexOf('<html');
    }
    
    let end = lowerContent.lastIndexOf('</html>');
    if (end !== -1) {
      end += 7; // Length of '</html>'
    }
    
    if (start !== -1 && end > start) {
      console.log('[HTML EXTRACTION] Extracting HTML by position markers');
      return content.substring(start, end);
    }
  }
  
  return null;
};

// Extract HTML from markdown code blocks
const extractHtmlFromMarkdownCodeBlock = (content: string): string | null => {
  console.log('[MARKDOWN EXTRACTION] Processing content for markdown code blocks');
  
  // First, check if there's a <think> section and remove it
  const thinkEndIndex = content.indexOf('</think>');
  if (thinkEndIndex !== -1) {
    content = content.substring(thinkEndIndex + 8).trim();
    console.log('[MARKDOWN EXTRACTION] Removed <think> section');
  }
  
  // Pattern to match HTML within markdown code blocks - more flexible version
  const markdownHtmlPattern = /```(?:html)?\s*([\s\S]*?)```/i;
  const markdownMatch = content.match(markdownHtmlPattern);
  if (markdownMatch) {
    console.log('[MARKDOWN EXTRACTION] Found markdown code block');
    const codeBlock = markdownMatch[1].trim();
    
    // Check if the code block contains HTML
    if (codeBlock.includes('<!DOCTYPE') || codeBlock.includes('<html')) {
      console.log('[MARKDOWN EXTRACTION] Found HTML in markdown code block');
      return codeBlock;
    }
    
    // Also check if it starts with HTML tags
    if (codeBlock.startsWith('<!DOCTYPE') || codeBlock.startsWith('<html') || codeBlock.startsWith('<')) {
      console.log('[MARKDOWN EXTRACTION] Code block appears to be HTML');
      return codeBlock;
    }
  }
  
  // Alternative: Look for any code block and check if it contains HTML
  const anyCodeBlockPattern = /```([\s\S]*?)```/g;
  let match;
  while ((match = anyCodeBlockPattern.exec(content)) !== null) {
    const codeBlock = match[1].trim();
    if (codeBlock.includes('<!DOCTYPE') || codeBlock.includes('<html') || 
        codeBlock.startsWith('<!DOCTYPE') || codeBlock.startsWith('<html') ||
        (codeBlock.includes('<') && codeBlock.includes('>'))) {
      console.log('[MARKDOWN EXTRACTION] Found HTML in generic code block');
      return codeBlock;
    }
  }
  
  // If no markdown code blocks found, try to find HTML directly
  console.log('[MARKDOWN EXTRACTION] No markdown code blocks found, searching for HTML directly');
  
  // Search for the full HTML document from <!DOCTYPE to </html>
  const doctypePattern = /<!DOCTYPE html.*?<\/html>/is;
  const doctypeMatch = content.match(doctypePattern);
  if (doctypeMatch) {
    console.log('[MARKDOWN EXTRACTION] Found complete HTML document with DOCTYPE');
    return doctypeMatch[0];
  }
  
  // Search for HTML document from <html to </html>
  const htmlPattern = /<html.*?<\/html>/is;
  const htmlMatch = content.match(htmlPattern);
  if (htmlMatch) {
    console.log('[MARKDOWN EXTRACTION] Found HTML document with html tag');
    return htmlMatch[0];
  }
  
  // Check if the entire content is HTML
  if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
    console.log('[MARKDOWN EXTRACTION] Content appears to be HTML');
    return content;
  }
  
  console.log('[MARKDOWN EXTRACTION] No HTML found in content');
  return null;
};

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [userId, setUserId] = useState<string>('');
  const initialized = useRef(false);

  // Initialize user ID on component mount
  useEffect(() => {
    if (!initialized.current) {
      const id = getOrCreateUserId();
      setUserId(id);
      initialized.current = true;
      
      // Call API to restore chat messages
      restoreChatMessages(id);
    }
  }, []);

  // Function to restore chat messages from API
  const restoreChatMessages = async (userId: string) => {
    try {
      console.log(`[USER SESSION] user_id: ${userId}`);
      
      const response = await fetch(`https://create-folder.onrender.com/create-user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send an empty body or minimal data as required by the API
        body: JSON.stringify({}),
      });
      
      console.log('[API REQUEST] Method:', 'POST');
      console.log('[API REQUEST] URL:', `https://create-folder.onrender.com/create-user/${userId}`);
      
      if (response.ok) {
        const userData: UserData = await response.json();
        console.log('[API RESPONSE] User data:', userData);
        
        // If messages are returned, restore the chat UI with previous messages
        if (userData.messages && Array.isArray(userData.messages) && userData.messages.length > 0) {
          // Convert timestamp strings to Date objects
          const restoredMessages: Message[] = userData.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(restoredMessages);
        }
        // If messages are empty or null, the chat interface will remain empty as it is by default
      } else {
        console.error('[API ERROR] Failed to fetch user data:', response.status, response.statusText);
        console.log('[API ERROR] Response headers:', [...response.headers.entries()]);
      }
    } catch (error) {
      console.error('[API ERROR] Error restoring chat messages:', error);
    }
  };

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Check if the message is a greeting
    if (isGreeting(content)) {
      // For greetings, respond with a predefined message
      const greetingResponse: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: getRandomGreetingResponse(),
        timestamp: new Date(),
      };
      
      // Add slight delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setMessages((prev) => [...prev, greetingResponse]);
      setIsLoading(false);
      return;
    }

    // For non-greetings, send to AI service
    try {
      console.log('[AI SERVICE] Sending request to:', 'http://localhost:8000/generate');
      console.log('[AI SERVICE] Request payload:', {
        requirements: content,
        max_iterations: 10
      });
      
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirements: content,
          max_iterations: 10 // Using max iterations of 10 as requested
        }),
      });

      console.log('[AI SERVICE] Response status:', response.status);
      console.log('[AI SERVICE] Response headers:', [...response.headers.entries()]);

      if (response.ok) {
        const responseText = await response.text();
        console.log('[AI SERVICE] Raw response text:', responseText);
        
        // Try to parse as JSON
        let aiResponse;
        try {
          aiResponse = JSON.parse(responseText);
          console.log('[AI SERVICE] Parsed JSON response:', aiResponse);
        } catch (parseError) {
          console.log('[AI SERVICE] Response is not valid JSON, using raw text');
          aiResponse = responseText;
        }
        
        // Extract HTML from the response
        const extractedHtml = extractHtmlFromResponse(aiResponse);
        console.log('[AI SERVICE] Extracted HTML:', extractedHtml ? 'SUCCESS' : 'FAILED');
        
        // Create AI message with extracted HTML
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: extractedHtml 
            ? "I've created a website based on your request. You can view the preview or copy the HTML code." 
            : "I've processed your request but couldn't generate a website preview.",
          htmlCode: extractedHtml || undefined,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Handle error response
        const errorText = await response.text();
        console.error('[AI SERVICE ERROR] Status:', response.status, response.statusText);
        console.error('[AI SERVICE ERROR] Response body:', errorText);
        
        const errorMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: "Sorry, I encountered an error while processing your request. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      // Handle network errors
      console.error('[AI SERVICE NETWORK ERROR]', error);
      const errorMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I couldn't connect to the AI service. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  }, []);

  const handleShowPreview = useCallback((htmlCode: string) => {
    // Set the actual HTML code from the message instead of opening automatically
    setPreviewHtml(htmlCode);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewHtml(null);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setPreviewHtml(null);
    setActiveChatId(undefined);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
    // In real app, load chat history here
    setMessages([]);
    setPreviewHtml(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          history={chatHistoryMock}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          activeId={activeChatId}
        />

        {/* Main Chat Area */}
        <main
          className="flex-1 flex flex-col min-w-0 transition-all duration-300"
          style={{ marginRight: previewHtml ? '55%' : 0 }}
        >
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSend={handleSendMessage}
            onShowPreview={handleShowPreview}
          />
        </main>

        {/* Preview Panel - only shown when previewHtml is set */}
        {previewHtml && (
          <PreviewPanel htmlCode={previewHtml} onClose={handleClosePreview} />
        )}
      </div>

      {/* User ID Footer */}
      <div className="bg-muted py-2 px-4 text-xs text-muted-foreground flex justify-between items-center">
        <div>User Session ID: {userId}</div>
        <div>Debug Mode</div>
      </div>
    </div>
  );
}