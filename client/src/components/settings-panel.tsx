import { Settings, Download, Trash2, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { translations, type Language } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';

interface SettingsPanelProps {
  language: Language;
  onClearChat: () => void;
  onExportChat: () => void;
  messages: any[];
}

export function SettingsPanel({ language, onClearChat, onExportChat, messages }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const t = translations[language];

  const handleClearChat = () => {
    onClearChat();
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  const handleExportChat = () => {
    if (messages.length === 0) {
      toast({
        title: "No Messages",
        description: "There are no messages to export.",
        variant: "destructive"
      });
      return;
    }
    
    onExportChat();
    toast({
      title: "Chat Exported",
      description: "Your chat has been downloaded as a text file.",
    });
  };

  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t.settings}
          </SheetTitle>
          <SheetDescription>
            Customize your chat experience and manage your conversation.
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Theme</h3>
            <Button
              variant="outline"
              onClick={toggleDarkMode}
              className="w-full justify-start gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? t.lightMode : t.darkMode}
            </Button>
          </div>

          <Separator />

          {/* Chat Management */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Chat Management</h3>
            
            <Button
              variant="outline"
              onClick={handleExportChat}
              className="w-full justify-start gap-2"
              disabled={messages.length === 0}
            >
              <Download className="w-4 h-4" />
              {t.exportChat}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClearChat}
              className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              disabled={messages.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              {t.clearChat}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}