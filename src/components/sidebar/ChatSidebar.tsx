import { motion } from 'framer-motion';
import { Plus, MessageSquare, ChevronLeft, Sparkles } from 'lucide-react';
import { ChatHistory } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ChatSidebarProps {
  history: ChatHistory[];
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  activeId?: string;
}

export function ChatSidebar({
  history,
  isOpen,
  onToggle,
  onNewChat,
  onSelectChat,
  activeId,
}: ChatSidebarProps) {
  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="h-full bg-sidebar border-r border-sidebar-border flex-shrink-0 overflow-hidden"
      >
        <div className="flex flex-col h-full w-[280px]">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-foreground text-sm">BuilderAI</span>
                <p className="text-[10px] text-muted-foreground">Powered by AI</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              data-testid="button-toggle-sidebar"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="px-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={onNewChat}
              data-testid="button-new-chat"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-purple-500 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
            >
              <Plus className="w-4 h-4" />
              New Project
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 scrollbar-thin">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Recent Projects
            </p>
            <div className="space-y-1">
              {history.map((chat) => (
                <motion.button
                  key={chat.id}
                  whileHover={{ x: 2 }}
                  onClick={() => onSelectChat(chat.id)}
                  data-testid={`button-chat-${chat.id}`}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    activeId === chat.id
                      ? 'bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20'
                      : 'hover:bg-sidebar-accent/70'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeId === chat.id 
                      ? 'bg-gradient-to-br from-primary to-purple-500' 
                      : 'bg-muted'
                  }`}>
                    <MessageSquare className={`w-3.5 h-3.5 ${
                      activeId === chat.id ? 'text-white' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      activeId === chat.id ? 'text-foreground' : 'text-sidebar-foreground'
                    }`}>
                      {chat.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {formatDistanceToNow(chat.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-sidebar-border">
            <div className="px-3 py-2 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl border border-primary/10">
              <p className="text-[11px] font-medium text-foreground">Pro Tip</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Be specific about colors, layout, and features for better results.
              </p>
            </div>
          </div>
        </div>
      </motion.aside>

      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onToggle}
          data-testid="button-open-sidebar"
          className="fixed top-4 left-4 z-40 p-2.5 bg-card border border-border rounded-xl shadow-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>
      )}
    </>
  );
}
