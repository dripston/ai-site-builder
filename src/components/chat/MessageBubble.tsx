import { motion } from 'framer-motion';
import { Message } from '@/types/chat';
import { Code, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  onShowPreview?: () => void;
}

export function MessageBubble({ message, onShowPreview }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyHtml = async () => {
    if (message.htmlCode) {
      await navigator.clipboard.writeText(message.htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-foreground/10'
            : 'bg-gradient-to-br from-primary to-primary/80'
        }`}
      >
        {isUser ? (
          <span className="text-[11px] font-medium text-foreground/70">You</span>
        ) : (
          <span className="text-[11px] font-medium text-primary-foreground">AI</span>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-2 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 ${
            isUser
              ? 'bg-chat-user text-chat-user-foreground rounded-[1.25rem] rounded-tr-lg'
              : 'bg-transparent text-chat-ai-foreground'
          }`}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* HTML Actions */}
        {message.htmlCode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={onShowPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/15 transition-colors"
            >
              <Code className="w-4 h-4" />
              View Preview
            </button>
            <button
              onClick={handleCopyHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy HTML
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
