import { useState } from 'react';
import { CheckCircle, Copy, Eye, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hostHtmlOnNgrok, pushHtmlToGithub } from '@/lib/utils';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isLatest: boolean;
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [hosting, setHosting] = useState(false);
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);
  const [hostError, setHostError] = useState<string | null>(null);
  
  // GitHub states
  const [pushingToGithub, setPushingToGithub] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState<string | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [repoName, setRepoName] = useState('');

  const handleCopy = () => {
    if (message.htmlCode) {
      navigator.clipboard.writeText(message.htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewPreview = () => {
    if (message.htmlCode) {
      setPreviewHtml(message.htmlCode);
    }
  };

  const handleHostOnNgrok = async () => {
    if (!message.htmlCode) return;
    
    setHosting(true);
    setHostError(null);
    
    try {
      const url = await hostHtmlOnNgrok(message.htmlCode);
      setHostedUrl(url);
    } catch (error) {
      setHostError('Failed to host on ngrok. Make sure the server is running.');
      console.error('Error hosting on ngrok:', error);
    } finally {
      setHosting(false);
    }
  };

  const handlePushToGithub = async () => {
    if (!message.htmlCode) return;
    
    // Get the GitHub token from environment variable
    const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
    
    if (!githubToken) {
      setGithubError('GitHub token not found. Please add VITE_GITHUB_TOKEN to your .env file.');
      return;
    }
    
    setPushingToGithub(true);
    setGithubError(null);
    
    try {
      const url = await pushHtmlToGithub(message.htmlCode, repoName, githubToken);
      setGithubRepoUrl(url);
      setShowGithubInput(false);
    } catch (error) {
      setGithubError('Failed to push to GitHub. Please check the console for details.');
      console.error('Error pushing to GitHub:', error);
    } finally {
      setPushingToGithub(false);
    }
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {message.htmlCode && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className={message.role === 'user' ? 'text-blue-500 border-blue-500 hover:bg-blue-50' : ''}
            >
              {copied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy HTML'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewPreview}
              className={message.role === 'user' ? 'text-blue-500 border-blue-500 hover:bg-blue-50' : ''}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Preview
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleHostOnNgrok}
              disabled={hosting}
              className={message.role === 'user' ? 'text-blue-500 border-blue-500 hover:bg-blue-50' : ''}
            >
              {hosting ? 'Hosting...' : 'Host on Ngrok'}
            </Button>
            
            {!showGithubInput && !githubRepoUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowGithubInput(true)}
                className={message.role === 'user' ? 'text-blue-500 border-blue-500 hover:bg-blue-50' : ''}
              >
                <Github className="w-4 h-4 mr-1" />
                Push to GitHub
              </Button>
            )}
            
            {showGithubInput && (
              <div className="flex flex-col gap-2 w-full mt-2">
                <input
                  type="text"
                  placeholder="Enter repository name"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="px-2 py-1 border rounded text-black"
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePushToGithub}
                    disabled={pushingToGithub || !repoName.trim()}
                    className={message.role === 'user' ? 'text-blue-500 border-blue-500 hover:bg-blue-50' : ''}
                  >
                    {pushingToGithub ? 'Pushing...' : 'Push to GitHub'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowGithubInput(false)}
                    className={message.role === 'user' ? 'text-blue-500 border-blue-500 hover:bg-blue-50' : ''}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {hostedUrl && (
              <div className="mt-2 text-sm">
                <p>Successfully hosted!</p>
                <a 
                  href={hostedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`underline ${message.role === 'user' ? 'text-blue-200' : 'text-blue-600'}`}
                >
                  {hostedUrl}
                </a>
              </div>
            )}
            
            {githubRepoUrl && (
              <div className="mt-2 text-sm">
                <p>Successfully pushed to GitHub!</p>
                <a 
                  href={githubRepoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`underline ${message.role === 'user' ? 'text-blue-200' : 'text-blue-600'}`}
                >
                  {githubRepoUrl}
                </a>
              </div>
            )}
            
            {hostError && (
              <div className="mt-2 text-sm text-red-500">
                {hostError}
              </div>
            )}
            
            {githubError && (
              <div className="mt-2 text-sm text-red-500">
                {githubError}
              </div>
            )}
          </div>
        )}
        
        {previewHtml && (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <iframe 
              srcDoc={previewHtml} 
              className="w-full h-64"
              title="HTML Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}