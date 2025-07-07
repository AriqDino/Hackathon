import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { ChatMessage, ChatRequest } from '@shared/schema';
import type { Language } from '@/lib/translations';

function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useChat() {
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [currentLanguage, setCurrentLanguage] = useState<Language>('id');
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();

  // Create or get session
  const { mutate: createSession } = useMutation({
    mutationFn: async (language: Language) => {
      const response = await apiRequest('POST', '/api/chat/session', {
        sessionId,
        language
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat', sessionId, 'messages'] });
    }
  });

  // Get chat messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/chat', sessionId, 'messages'],
    queryFn: async () => {
      const response = await fetch(`/api/chat/${sessionId}/messages`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Send message mutation
  const { mutate: sendMessage, isPending: isSending, error } = useMutation({
    mutationFn: async (message: string) => {
      setIsTyping(true);
      const chatRequest: ChatRequest = {
        message,
        sessionId,
        language: currentLanguage
      };
      
      const response = await apiRequest('POST', '/api/chat/message', chatRequest);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat', sessionId, 'messages'] });
    },
    onSettled: () => {
      setIsTyping(false);
    }
  });

  // Initialize session when language changes
  useEffect(() => {
    createSession(currentLanguage);
  }, [currentLanguage, createSession]);

  const switchLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const sendChatMessage = (message: string) => {
    if (!message.trim() || isSending) return;
    sendMessage(message);
  };

  const clearChat = () => {
    // Create a new session ID to effectively clear the chat
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    // Clear the query cache for the old session
    queryClient.removeQueries({ queryKey: ['/api/chat', sessionId, 'messages'] });
    
    // Initialize the new session
    createSession(currentLanguage);
  };

  return {
    messages: messages as ChatMessage[],
    isLoading,
    isSending,
    isTyping,
    error: error?.message,
    currentLanguage,
    switchLanguage,
    sendMessage: sendChatMessage,
    clearChat,
    sessionId
  };
}
