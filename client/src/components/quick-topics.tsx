import { Button } from '@/components/ui/button';
import { QrCode, Zap, Smartphone, Shield, TrendingUp, Heart, CreditCard, PiggyBank } from 'lucide-react';
import { translations, type Language } from '@/lib/translations';

interface QuickTopicsProps {
  language: Language;
  onTopicClick: (question: string) => void;
}

export function QuickTopics({ language, onTopicClick }: QuickTopicsProps) {
  const t = translations[language];

  const topics = [
    {
      key: 'qris',
      icon: QrCode,
      label: t.topics.qris,
      question: t.questions.qris,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      key: 'bifast',
      icon: Zap,
      label: t.topics.bifast,
      question: t.questions.bifast,
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      key: 'fintech',
      icon: Smartphone,
      label: t.topics.fintech,
      question: t.questions.fintech,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      key: 'protection',
      icon: Shield,
      label: t.topics.protection,
      question: t.questions.protection,
      gradient: 'from-green-500 to-green-600'
    },
    {
      key: 'investment',
      icon: TrendingUp,
      label: t.topics.investment,
      question: t.questions.investment,
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      key: 'insurance',
      icon: Heart,
      label: t.topics.insurance,
      question: t.questions.insurance,
      gradient: 'from-red-500 to-pink-500'
    },
    {
      key: 'credit',
      icon: CreditCard,
      label: t.topics.credit,
      question: t.questions.credit,
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      key: 'savings',
      icon: PiggyBank,
      label: t.topics.savings,
      question: t.questions.savings,
      gradient: 'from-emerald-500 to-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
      {topics.map(({ key, icon: Icon, label, question, gradient }) => (
        <Button
          key={key}
          variant="outline"
          className="group p-4 h-auto flex flex-col items-center space-y-3 bg-white/90 hover:bg-white hover:shadow-xl border-white/50 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-md hover:border-white/70"
          onClick={() => onTopicClick(question)}
        >
          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
            {label}
          </span>
        </Button>
      ))}
    </div>
  );
}
