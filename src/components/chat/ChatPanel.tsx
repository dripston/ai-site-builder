import { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Layers, Palette } from 'lucide-react';

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
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-background flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                What would you like to build?
              </h2>
              <p className="text-muted-foreground text-base max-w-md mb-8">
                Describe your vision and watch it come to life in seconds.
              </p>

              <div className="flex gap-3 mb-10 flex-wrap justify-center">
                {[
                  { icon: Zap, label: 'Lightning Fast' },
                  { icon: Layers, label: 'Production Ready' },
                  { icon: Palette, label: 'Fully Customizable' },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground"
                  >
                    <feature.icon className="w-3 h-3" />
                    {feature.label}
                  </motion.div>
                ))}
              </div>
              
              <div className="grid gap-2.5 w-full max-w-md">
                {[
                  'Build a modern SaaS landing page',
                  'Create a minimal portfolio with animations',
                  'Design a startup product showcase',
                ].map((suggestion, i) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    onClick={() => onSend(suggestion)}
                    data-testid={`button-suggestion-${i}`}
                    className="group px-4 py-3.5 text-left text-sm text-foreground bg-card hover:bg-muted/80 rounded-xl border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-md"
                  >
                    <span className="group-hover:text-primary transition-colors">{suggestion}</span>
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

      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}
