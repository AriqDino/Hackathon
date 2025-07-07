import { ExternalLink, Book, Shield, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { translations, type Language } from '@/lib/translations';

interface ResourcesPanelProps {
  language: Language;
}

export function ResourcesPanel({ language }: ResourcesPanelProps) {
  const t = translations[language];

  const resources = [
    {
      title: 'Bank Indonesia',
      description: 'Situs resmi Bank Indonesia untuk kebijakan moneter dan sistem pembayaran',
      icon: <Building className="w-5 h-5 text-blue-600" />,
      url: 'https://www.bi.go.id',
      category: 'Otoritas'
    },
    {
      title: 'Otoritas Jasa Keuangan (OJK)',
      description: 'Regulator dan pengawas sektor jasa keuangan Indonesia',
      icon: <Shield className="w-5 h-5 text-green-600" />,
      url: 'https://www.ojk.go.id',
      category: 'Otoritas'
    },
    {
      title: 'Lembaga Penjamin Simpanan (LPS)',
      description: 'Informasi penjaminan simpanan nasabah bank',
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      url: 'https://www.lps.go.id',
      category: 'Penjaminan'
    },
    {
      title: 'Sikapi - OJK',
      description: 'Platform edukasi dan literasi keuangan dari OJK',
      icon: <Book className="w-5 h-5 text-orange-600" />,
      url: 'https://sikapiuangmu.ojk.go.id',
      category: 'Edukasi'
    },
    {
      title: 'BI-FAST',
      description: 'Informasi sistem pembayaran cepat Bank Indonesia',
      icon: <Building className="w-5 h-5 text-red-600" />,
      url: 'https://www.bi.go.id/id/sistem-pembayaran/bi-fast/default.aspx',
      category: 'Pembayaran'
    },
    {
      title: 'QRIS',
      description: 'Panduan dan informasi tentang QRIS',
      icon: <Building className="w-5 h-5 text-indigo-600" />,
      url: 'https://www.bi.go.id/qris',
      category: 'Pembayaran'
    }
  ];

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="glass-effect border-0 bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm transition-all duration-200"
        >
          <Book className="w-4 h-4 mr-2" />
          Sumber Daya
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            {t.resources?.title || 'Sumber Daya Resmi'}
          </SheetTitle>
          <SheetDescription>
            Kumpulan tautan resmi untuk informasi keuangan Indonesia
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 mt-6">
          {resources.map((resource, index) => (
            <Card key={index} className="glass-effect border-0 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  {resource.icon}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium">
                      {resource.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                      {resource.category}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {resource.description}
                </p>
                <Button
                  onClick={() => handleOpenLink(resource.url)}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Buka Situs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 glass-effect rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Peringatan</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Selalu pastikan Anda mengakses situs resmi yang terverifikasi. 
            Hindari situs palsu yang dapat membahayakan keamanan data Anda.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}