import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Info } from 'lucide-react';
import { translations, type Language } from '@/lib/translations';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  language: Language;
}

export function MessageInput({ onSendMessage, disabled, language }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = translations[language];

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-effect border-t border-white/30 px-6 py-5 shadow-custom-medium">
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            className="resize-none min-h-[52px] max-h-[120px] border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary rounded-xl bg-white/90 backdrop-blur-sm shadow-custom-light transition-all duration-200"
            maxLength={1000}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="px-6 py-3 gradient-bg text-white hover:shadow-custom-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 rounded-xl font-semibold btn-hover-scale transition-all duration-200"
        >
          <Send className="w-4 h-4" />
          <span>{t.sendButton}</span>
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-gray-600 text-center flex items-center justify-center space-x-2">
        <Info className="w-3.5 h-3.5" />
        <span className="font-medium">{t.disclaimer}</span>
      </div>
    </div>
  );
}
