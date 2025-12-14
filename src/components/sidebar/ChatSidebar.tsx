import { motion } from 'framer-motion';
import { Plus, MessageSquare, ChevronLeft } from 'lucide-react';
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
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="h-full bg-sidebar border-r border-sidebar-border flex-shrink-0 overflow-hidden"
      >
        <div className="flex flex-col h-full w-[260px]">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground text-[11px] font-semibold">W</span>
              </div>
              <span className="font-medium text-foreground text-[15px]">WebBuilder</span>
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-3 mb-3">
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 px-3 py-2 text-[14px] font-medium text-sidebar-foreground border border-sidebar-border hover:bg-sidebar-accent rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              New chat
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-3 scrollbar-thin">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
              Recent
            </p>
            <div className="space-y-0.5">
              {history.map((chat) => (
                <motion.button
                  key={chat.id}
                  whileHover={{ scale: 1.005 }}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeId === chat.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{chat.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {formatDistanceToNow(chat.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Collapsed Toggle */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onToggle}
          className="fixed top-4 left-4 z-40 p-2 bg-surface-elevated border border-border rounded-lg shadow-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>
      )}
    </>
  );
}
