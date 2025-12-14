import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-border bg-surface-elevated p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-3 bg-background border border-border rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the website you want to build..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-[15px] leading-relaxed max-h-[200px] scrollbar-thin"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!message.trim() || disabled}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-glow"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
