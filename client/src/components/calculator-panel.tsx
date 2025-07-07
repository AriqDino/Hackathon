import { Calculator, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { translations, type Language } from '@/lib/translations';

interface CalculatorPanelProps {
  language: Language;
}

export function CalculatorPanel({ language }: CalculatorPanelProps) {
  const t = translations[language];
  const [interestData, setInterestData] = useState({
    amount: '',
    rate: '',
    period: ''
  });
  const [installmentData, setInstallmentData] = useState({
    amount: '',
    rate: '',
    period: ''
  });
  const [results, setResults] = useState({
    interest: 0,
    installment: 0
  });

  const calculateInterest = () => {
    const principal = parseFloat(interestData.amount);
    const rate = parseFloat(interestData.rate) / 100;
    const time = parseFloat(interestData.period);
    
    if (principal && rate && time) {
      const simpleInterest = principal * rate * time;
      const totalAmount = principal + simpleInterest;
      setResults(prev => ({ ...prev, interest: totalAmount }));
    }
  };

  const calculateInstallment = () => {
    const principal = parseFloat(installmentData.amount);
    const rate = parseFloat(installmentData.rate) / 100 / 12; // Monthly rate
    const periods = parseFloat(installmentData.period);
    
    if (principal && rate && periods) {
      const installment = principal * (rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
      setResults(prev => ({ ...prev, installment }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="glass-effect border-0 bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-700/30 backdrop-blur-sm transition-all duration-200"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Kalkulator
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            {t.calculator?.title || 'Kalkulator Keuangan'}
          </SheetTitle>
          <SheetDescription>
            Hitung bunga dan cicilan dengan mudah
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="interest" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interest">Bunga</TabsTrigger>
            <TabsTrigger value="installment">Cicilan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="interest" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Kalkulator Bunga Sederhana</CardTitle>
                <CardDescription className="text-xs">
                  Hitung total bunga dan jumlah akhir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="interest-amount" className="text-xs">
                    Jumlah Pokok (Rp)
                  </Label>
                  <Input
                    id="interest-amount"
                    type="number"
                    value={interestData.amount}
                    onChange={(e) => setInterestData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="10000000"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interest-rate" className="text-xs">
                    Tingkat Bunga (% per tahun)
                  </Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    value={interestData.rate}
                    onChange={(e) => setInterestData(prev => ({ ...prev, rate: e.target.value }))}
                    placeholder="5"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interest-period" className="text-xs">
                    Jangka Waktu (tahun)
                  </Label>
                  <Input
                    id="interest-period"
                    type="number"
                    value={interestData.period}
                    onChange={(e) => setInterestData(prev => ({ ...prev, period: e.target.value }))}
                    placeholder="1"
                    className="text-sm"
                  />
                </div>
                
                <Button onClick={calculateInterest} className="w-full" size="sm">
                  Hitung Bunga
                </Button>
                
                {results.interest > 0 && (
                  <div className="p-3 glass-effect rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Hasil:</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(results.interest)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="installment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Kalkulator Cicilan</CardTitle>
                <CardDescription className="text-xs">
                  Hitung cicilan bulanan pinjaman
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="installment-amount" className="text-xs">
                    Jumlah Pinjaman (Rp)
                  </Label>
                  <Input
                    id="installment-amount"
                    type="number"
                    value={installmentData.amount}
                    onChange={(e) => setInstallmentData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="100000000"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="installment-rate" className="text-xs">
                    Tingkat Bunga (% per tahun)
                  </Label>
                  <Input
                    id="installment-rate"
                    type="number"
                    value={installmentData.rate}
                    onChange={(e) => setInstallmentData(prev => ({ ...prev, rate: e.target.value }))}
                    placeholder="12"
                    className="text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="installment-period" className="text-xs">
                    Jangka Waktu (bulan)
                  </Label>
                  <Input
                    id="installment-period"
                    type="number"
                    value={installmentData.period}
                    onChange={(e) => setInstallmentData(prev => ({ ...prev, period: e.target.value }))}
                    placeholder="12"
                    className="text-sm"
                  />
                </div>
                
                <Button onClick={calculateInstallment} className="w-full" size="sm">
                  Hitung Cicilan
                </Button>
                
                {results.installment > 0 && (
                  <div className="p-3 glass-effect rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Cicilan Bulanan:</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(results.installment)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}