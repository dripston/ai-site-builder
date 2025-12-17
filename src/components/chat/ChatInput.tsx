import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border/50 bg-gradient-to-t from-background to-background/80 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          animate={{ 
            boxShadow: isFocused 
              ? '0 0 0 2px hsl(var(--primary) / 0.2), 0 4px 20px -4px hsl(var(--primary) / 0.15)' 
              : '0 2px 8px -2px rgb(0 0 0 / 0.08)'
          }}
          className={`relative flex items-end gap-3 bg-card border rounded-2xl px-4 py-3 transition-colors ${
            isFocused ? 'border-primary/40' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe what you want to build..."
            disabled={disabled}
            rows={1}
            data-testid="input-chat"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 resize-none outline-none text-sm leading-relaxed max-h-[200px] scrollbar-thin py-1"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            data-testid="button-send"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shadow-lg shadow-primary/25"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </motion.div>
        <p className="text-[11px] text-muted-foreground/50 text-center mt-3">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
