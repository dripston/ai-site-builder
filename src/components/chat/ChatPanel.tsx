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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                What would you like to build?
              </h2>
              <p className="text-muted-foreground max-w-md">
                Describe your website idea and I'll generate a beautiful, production-ready design for you.
              </p>
              
              <div className="mt-8 grid gap-3 w-full max-w-md">
                {[
                  'Build a restaurant landing page with menu',
                  'Create a portfolio for a designer',
                  'Design a SaaS product landing page',
                ].map((suggestion, i) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onClick={() => onSend(suggestion)}
                    className="px-4 py-3 text-left text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-xl border border-border hover:border-primary/20 transition-all"
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
