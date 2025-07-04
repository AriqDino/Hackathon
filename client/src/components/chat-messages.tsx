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
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} chat-message-enter`}
        >
          {message.role === 'assistant' && (
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-custom-light">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
          <div
            className={`max-w-xs lg:max-w-lg px-5 py-4 rounded-2xl shadow-custom-light ${
              message.role === 'user'
                ? 'gradient-bg text-white ml-auto'
                : 'bg-white text-gray-800 mr-auto border border-gray-100/50'
            }`}
          >
            {message.role === 'assistant' ? (
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <h1 className="text-lg font-bold text-gray-900 mb-3 mt-1" {...props} />,
                    h2: (props) => <h2 className="text-base font-bold text-gray-900 mb-2 mt-2" {...props} />,
                    h3: (props) => <h3 className="text-sm font-bold text-gray-900 mb-2 mt-2" {...props} />,
                    strong: (props) => <strong className="font-semibold text-gray-900" {...props} />,
                    p: (props) => <p className="mb-2 last:mb-0 text-gray-800 leading-relaxed" {...props} />,
                    ul: (props) => <ul className="list-disc ml-4 mb-3 space-y-1 text-gray-800" {...props} />,
                    ol: (props) => <ol className="list-decimal ml-4 mb-3 space-y-1 text-gray-800" {...props} />,
                    li: (props) => <li className="text-gray-800 leading-relaxed" {...props} />,
                    em: (props) => <em className="italic text-gray-800" {...props} />,
                    code: (props) => <code className="bg-gray-100 text-gray-900 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words leading-relaxed text-white">
                {message.content}
              </div>
            )}
          </div>
          {message.role === 'user' && (
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center ml-4 mt-1 flex-shrink-0 shadow-custom-light">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start chat-message-enter">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-custom-light">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="bg-white text-gray-800 mr-auto border border-gray-100/50 px-5 py-4 rounded-2xl shadow-custom-light">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{t.typing}</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
