import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { QuickTopics } from './quick-topics';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';
import { SettingsPanel } from './settings-panel';
import { useChat } from '@/hooks/use-chat';
import { translations } from '@/lib/translations';

export function ChatInterface() {
  const {
    messages,
    isLoading,
    isSending,
    isTyping,
    error,
    currentLanguage,
    switchLanguage,
    sendMessage
  } = useChat();
  
  const [showWelcome, setShowWelcome] = useState(true);
  const t = translations[currentLanguage];

  const handleSendMessage = (message: string) => {
    if (showWelcome) {
      setShowWelcome(false);
    }
    sendMessage(message);
  };

  const handleTopicClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleClearChat = () => {
    setShowWelcome(true);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const handleExportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-education-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4 shadow-sm transition-colors">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={refreshPage}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight transition-colors">Edukasi Keuangan Indonesia</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium transition-colors">Chatbot Resmi BI & OJK</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <SettingsPanel 
              language={currentLanguage}
              onClearChat={handleClearChat}
              onExportChat={handleExportChat}
              messages={messages}
            />
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={switchLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full pt-20">
        {/* Welcome Section */}
        {showWelcome && (
          <div className="px-6 py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mx-4 mt-4 rounded-lg shadow-sm transition-colors">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Building2 className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight transition-colors">
                {t.welcomeTitle}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed transition-colors">
                {t.welcomeDesc}
              </p>
              <QuickTopics
                language={currentLanguage}
                onTopicClick={handleTopicClick}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="px-6 py-3">
            <Alert variant="destructive" className="border-red-200 bg-red-50/80 backdrop-blur-sm rounded-xl shadow-custom-light">
              <AlertDescription className="text-red-700 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Chat Messages */}
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
          language={currentLanguage}
        />

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isSending || isLoading}
          language={currentLanguage}
        />
      </main>
    </div>
  );
}
