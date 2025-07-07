import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Info, Mic, MicOff } from 'lucide-react';
import { translations, type Language } from '@/lib/translations';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  language: Language;
}

export function MessageInput({ onSendMessage, disabled, language }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
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

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition tidak didukung di browser ini');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language === 'id' ? 'id-ID' : language === 'zh' ? 'zh-CN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsRecording(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-white/20 dark:border-gray-700/20">
      <div className="max-w-4xl mx-auto">
        {/* Main Input Container */}
        <div className="message-input-container relative flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-600 shadow-lg">
          {/* Input Field */}
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              className="resize-none min-h-[44px] max-h-[120px] border-0 bg-transparent focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 p-2 leading-relaxed"
              maxLength={1000}
            />
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-2">
            {/* Mic Button - for voice input */}
            <Button
              onClick={handleVoiceInput}
              variant="ghost"
              size="sm"
              className={`p-2 rounded-xl transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 animate-pulse' 
                  : 'hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-105'
              }`}
              title={isRecording ? 'Stop Recording' : 'Voice Input'}
              disabled={disabled}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-red-600 dark:text-red-400" />
              ) : (
                <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </Button>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              className={`p-2 rounded-xl transition-all duration-200 shadow-sm ${
                message.trim() && !disabled
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:scale-105 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 font-medium">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span>Sedang merekam...</span>
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-3 sm:mt-4 text-xs text-gray-600 dark:text-gray-400 text-center flex items-center justify-center space-x-2">
          <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="font-medium">{t.disclaimer}</span>
        </div>
      </div>
    </div>
  );
}
