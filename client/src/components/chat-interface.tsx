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
    sendMessage,
    clearChat
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
    clearChat();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-6 py-3 sm:py-4 shadow-lg transition-all duration-300">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={refreshPage}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200">
              <Building2 className="text-white text-lg sm:text-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight transition-colors">Edukasi Keuangan Indonesia</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium transition-colors">Chatbot Resmi BI & OJK</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight transition-colors">Edukasi Keuangan</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium transition-colors">BI & OJK</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
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
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full pt-16 sm:pt-20">
        {/* Welcome Section */}
        {showWelcome && (
          <div className="px-4 sm:px-6 py-6 sm:py-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mx-4 mt-4 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <Building2 className="text-white text-2xl sm:text-3xl" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 tracking-tight transition-colors">
                {t.welcomeTitle}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed transition-colors">
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
          <div className="px-4 sm:px-6 py-3">
            <Alert variant="destructive" className="border-red-200 bg-red-50/90 backdrop-blur-sm rounded-xl shadow-lg">
              <AlertDescription className="text-red-700 font-medium text-sm sm:text-base">
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
