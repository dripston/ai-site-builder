import { useState, useCallback, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { ChatSidebar } from '@/components/sidebar/ChatSidebar';
import { chatHistoryMock, getRandomMockResponse } from '@/lib/mockData';
import { getOrCreateUserId } from '@/lib/utils';

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [userId, setUserId] = useState<string>('');
  const initialized = useRef(false);

  // Initialize user ID on component mount
  useEffect(() => {
    if (!initialized.current) {
      const id = getOrCreateUserId();
      setUserId(id);
      initialized.current = true;
    }
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Get mock response
    const mockResponse = getRandomMockResponse();
    const aiMessage: Message = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: mockResponse.message,
      htmlCode: mockResponse.html,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  }, []);

  const handleShowPreview = useCallback((htmlCode: string) => {
    setPreviewHtml(htmlCode);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewHtml(null);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setPreviewHtml(null);
    setActiveChatId(undefined);
  }, []);

  const handleSelectChat = useCallback((id: string) => {
    setActiveChatId(id);
    // In real app, load chat history here
    setMessages([]);
    setPreviewHtml(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          history={chatHistoryMock}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          activeId={activeChatId}
        />

        {/* Main Chat Area */}
        <main
          className="flex-1 flex flex-col min-w-0 transition-all duration-300"
          style={{ marginRight: previewHtml ? '55%' : 0 }}
        >
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSend={handleSendMessage}
            onShowPreview={handleShowPreview}
          />
        </main>

        {/* Preview Panel */}
        <PreviewPanel htmlCode={previewHtml} onClose={handleClosePreview} />
      </div>

      {/* User ID Footer */}
      <div className="bg-muted py-2 px-4 text-xs text-muted-foreground flex justify-between items-center">
        <div>User Session ID: {userId}</div>
        <div>Debug Mode</div>
      </div>
    </div>
  );
}