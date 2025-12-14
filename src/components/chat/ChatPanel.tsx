import { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onShowPreview: (htmlCode: string) => void;
}

export function ChatPanel({ messages, isLoading, onSend, onShowPreview }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-medium text-foreground mb-2">
                How can I help you today?
              </h2>
              <p className="text-muted-foreground text-[15px] max-w-sm">
                Describe your website idea and I'll create it for you.
              </p>
              
              <div className="mt-10 grid gap-2.5 w-full max-w-md">
                {[
                  'Build a restaurant landing page',
                  'Create a minimal portfolio site',
                  'Design a SaaS product page',
                ].map((suggestion, i) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    onClick={() => onSend(suggestion)}
                    className="px-4 py-3 text-left text-[14px] text-foreground/80 bg-surface-sunken hover:bg-muted rounded-xl border border-transparent hover:border-border transition-all"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onShowPreview={
                message.htmlCode ? () => onShowPreview(message.htmlCode!) : undefined
              }
            />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
