import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 max-w-3xl">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
        <span className="text-primary-foreground text-xs font-medium">AI</span>
      </div>
      <div className="bg-chat-ai rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-muted-foreground/50 rounded-full"
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
