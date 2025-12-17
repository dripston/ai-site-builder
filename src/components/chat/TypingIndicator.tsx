import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const stages = [
  { label: 'Understanding your request', progress: 15 },
  { label: 'Analyzing requirements', progress: 35 },
  { label: 'Generating design', progress: 55 },
  { label: 'Building components', progress: 75 },
  { label: 'Finalizing output', progress: 90 },
];

export function TypingIndicator() {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(stageInterval);
  }, []);

  useEffect(() => {
    const targetProgress = stages[currentStage].progress;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) {
          return prev + 1;
        }
        return prev;
      });
    }, 30);

    return () => clearInterval(progressInterval);
  }, [currentStage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 max-w-xl"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">AI is working</span>
          <span className="text-xs text-muted-foreground">{stages[currentStage].label}...</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {stages.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  index <= currentStage ? 'bg-primary' : 'bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}
