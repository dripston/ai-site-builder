import { useState } from 'react';
import { CheckCircle, Copy, Eye, Github, ExternalLink, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hostHtmlOnNgrok, pushHtmlToGithub } from '@/lib/utils';
import { Message } from '@/types/chat';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  onShowPreview?: () => void;
}

export function MessageBubble({ message, onShowPreview }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [hosting, setHosting] = useState(false);
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);
  const [hostError, setHostError] = useState<string | null>(null);
  
  const [pushingToGithub, setPushingToGithub] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState<string | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [repoName, setRepoName] = useState('');

  const isUser = message.role === 'user';

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
      onShowPreview?.();
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
      setHostError('Failed to host. Make sure the server is running.');
      console.error('Error hosting:', error);
    } finally {
      setHosting(false);
    }
  };

  const handlePushToGithub = async () => {
    if (!message.htmlCode) return;
    
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
      setGithubError('Failed to push to GitHub.');
      console.error('Error pushing to GitHub:', error);
    } finally {
      setPushingToGithub(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      data-testid={`message-${message.id}`}
    >
      <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
        {isUser ? (
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-r from-primary to-purple-500 text-white rounded-tr-md'
              : 'bg-muted text-foreground rounded-tl-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        
        {message.htmlCode && (
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
                className="text-xs"
                data-testid="button-copy-html"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewPreview}
                className="text-xs"
                data-testid="button-view-preview"
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Preview
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleHostOnNgrok}
                disabled={hosting}
                className="text-xs"
                data-testid="button-host"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                {hosting ? 'Deploying...' : 'Deploy'}
              </Button>
              
              {!showGithubInput && !githubRepoUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowGithubInput(true)}
                  className="text-xs"
                  data-testid="button-github"
                >
                  <Github className="w-3.5 h-3.5 mr-1.5" />
                  GitHub
                </Button>
              )}
            </div>
            
            {showGithubInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col gap-2 p-3 bg-muted rounded-lg"
              >
                <input
                  type="text"
                  placeholder="Repository name"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  data-testid="input-repo-name"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handlePushToGithub}
                    disabled={pushingToGithub || !repoName.trim()}
                    className="text-xs"
                    data-testid="button-push-github"
                  >
                    {pushingToGithub ? 'Pushing...' : 'Push'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowGithubInput(false)}
                    className="text-xs"
                    data-testid="button-cancel-github"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
            
            {hostedUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <a 
                  href={hostedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  data-testid="link-hosted-url"
                >
                  {hostedUrl}
                </a>
              </motion.div>
            )}
            
            {githubRepoUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <a 
                  href={githubRepoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  data-testid="link-github-url"
                >
                  View on GitHub
                </a>
              </motion.div>
            )}
            
            {(hostError || githubError) && (
              <p className="text-xs text-destructive" data-testid="text-error">
                {hostError || githubError}
              </p>
            )}
          </div>
        )}
        
        {previewHtml && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full mt-2 border border-border rounded-xl overflow-hidden shadow-md"
          >
            <iframe 
              srcDoc={previewHtml} 
              className="w-full h-72 bg-white"
              title="HTML Preview"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
