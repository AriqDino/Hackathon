import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { translations, type Language } from '@/lib/translations';

interface FaqPanelProps {
  language: Language;
  onQuestionClick: (question: string) => void;
}

export function FaqPanel({ language, onQuestionClick }: FaqPanelProps) {
  const t = translations[language];
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setOpenItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const faqData = {
    general: [
      {
        question: "Apa itu edukasi keuangan?",
        answer: "Edukasi keuangan adalah proses pembelajaran untuk memahami konsep, produk, dan layanan keuangan guna membuat keputusan finansial yang tepat."
      },
      {
        question: "Mengapa edukasi keuangan penting?",
        answer: "Edukasi keuangan membantu seseorang mengelola keuangan dengan baik, terhindar dari penipuan, dan membuat keputusan investasi yang bijak."
      }
    ],
    qris: [
      {
        question: "Apa itu QRIS?",
        answer: "QRIS adalah standar pembayaran digital yang memungkinkan transaksi menggunakan QR Code di seluruh Indonesia."
      },
      {
        question: "Bagaimana cara menggunakan QRIS?",
        answer: "Buka aplikasi pembayaran digital, pilih scan QR, arahkan kamera ke QR Code QRIS, masukkan nominal, dan konfirmasi pembayaran."
      }
    ],
    banking: [
      {
        question: "Apa itu BI-FAST?",
        answer: "BI-FAST adalah sistem pembayaran cepat Bank Indonesia yang memungkinkan transfer dana 24/7 secara real-time."
      },
      {
        question: "Berapa biaya transaksi BI-FAST?",
        answer: "Biaya transaksi BI-FAST bervariasi tergantung bank, umumnya lebih murah dibanding transfer konvensional."
      }
    ],
    investment: [
      {
        question: "Apa itu investasi yang aman?",
        answer: "Investasi yang aman adalah produk investasi yang terdaftar dan diawasi oleh OJK, seperti deposito, reksadana, dan obligasi negara."
      },
      {
        question: "Bagaimana cara memilih investasi?",
        answer: "Pilih investasi sesuai profil risiko, tujuan keuangan, dan jangka waktu. Pastikan produk terdaftar di OJK."
      }
    ]
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="glass-effect border-0 bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm transition-all duration-200"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          FAQ
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            {t.faq?.title || 'Pertanyaan yang Sering Ditanyakan'}
          </SheetTitle>
          <SheetDescription>
            Temukan jawaban untuk pertanyaan umum tentang layanan keuangan Indonesia
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 mt-6">
          {Object.entries(faqData).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <Badge variant="outline" className="mb-2">
                {t.faq?.categories?.[category as keyof typeof t.faq.categories] || category}
              </Badge>
              
              {items.map((item, index) => (
                <Collapsible
                  key={`${category}-${index}`}
                  open={openItems.includes(`${category}-${index}`)}
                  onOpenChange={() => toggleItem(`${category}-${index}`)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 glass-effect rounded-lg hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200">
                      <span className="text-sm font-medium text-left">{item.question}</span>
                      {openItems.includes(`${category}-${index}`) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 py-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.answer}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onQuestionClick(item.question)}
                      className="text-xs"
                    >
                      Tanya lebih detail
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}