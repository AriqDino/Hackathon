import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '@shared/schema';
import { translations, type Language } from '@/lib/translations';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  language: Language;
}

export function ChatMessages({ messages, isTyping, language }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 chat-messages scrollbar-thin">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-bg rounded-xl flex items-center justify-center mr-2 sm:mr-4 mt-1 flex-shrink-0 shadow-lg">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          )}
          <div
            className={`max-w-[85%] sm:max-w-xs lg:max-w-lg px-3 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-lg transition-all duration-200 ${
              message.role === 'user'
                ? 'gradient-bg text-white ml-auto hover:shadow-xl'
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 mr-auto border border-gray-100/50 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-xl'
            }`}
          >
            {message.role === 'assistant' ? (
              <div className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 mt-1" {...props} />,
                    h2: (props) => <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-2 mt-2" {...props} />,
                    h3: (props) => <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 mt-2" {...props} />,
                    strong: (props) => <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />,
                    p: (props) => <p className="mb-2 last:mb-0 text-gray-800 dark:text-gray-200 leading-relaxed" {...props} />,
                    ul: (props) => <ul className="list-disc ml-4 mb-3 space-y-1 text-gray-800 dark:text-gray-200" {...props} />,
                    ol: (props) => <ol className="list-decimal ml-4 mb-3 space-y-1 text-gray-800 dark:text-gray-200" {...props} />,
                    li: (props) => <li className="text-gray-800 dark:text-gray-200 leading-relaxed" {...props} />,
                    em: (props) => <em className="italic text-gray-800 dark:text-gray-200" {...props} />,
                    code: (props) => <code className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words leading-relaxed text-white text-sm sm:text-base">
                {message.content}
              </div>
            )}
          </div>
          {message.role === 'user' && (
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center ml-2 sm:ml-4 mt-1 flex-shrink-0 shadow-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          )}
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start animate-fade-in">
          <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-bg rounded-xl flex items-center justify-center mr-2 sm:mr-4 mt-1 flex-shrink-0 shadow-lg">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 mr-auto border border-gray-100/50 dark:border-gray-700/50 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">{t.typing}</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
