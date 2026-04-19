'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/framework/layout';
import { Button, FormField, FormGroup, Label, Select, SelectItem } from '@/components/framework/form';
import { Check, X } from 'lucide-react';

interface LightingSettings {
  channel1: number;
  channel2: number;
  channel3: number;
  channel4: number;
}

interface LightingControlProps {
  settings: LightingSettings;
  onApply: (settings: LightingSettings) => void;
  onCancel: () => void;
}

export default function LightingControl({ settings, onApply, onCancel }: LightingControlProps) {
  const t = useTranslations('DeviceControl.lighting');
  const tActions = useTranslations('DeviceControl.actions');
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>(settings);

  // 외부에서 설정값이 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setLightingSettings(settings);
  }, [settings]);

  const handleSettingChange = (channel: string, value: string) => {
    setLightingSettings(prev => ({
      ...prev,
      [channel]: parseInt(value)
    }));
  };

  const handleApply = () => {
    onApply(lightingSettings);
  };

  const handleCancel = () => {
    setLightingSettings(settings);
    onCancel();
  };

  return (
    <Card className="py-2 gap-2 h-full flex flex-col">
      <CardHeader title={t('title')} titleSize="lg" />
      <CardContent className="flex-1 flex flex-col">
        <Tabs defaultValue="light" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="light" className="data-[state=active]:bg-gray-400 data-[state=active]:text-white">
              {t('tabLight')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="light" className="flex-1 flex flex-col space-y-4">
            <FormGroup columns={2}>
              <FormField>
                <Label htmlFor="channel1">{t('channel1')}</Label>
                <Select 
                  value={lightingSettings.channel1.toString()} 
                  onValueChange={(value) => handleSettingChange('channel1', value)}
                >
                  {Array.from({ length: 256 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                  ))}
                </Select>
              </FormField>
              <FormField>
                <Label htmlFor="channel2">{t('channel2')}</Label>
                <Select 
                  value={lightingSettings.channel2.toString()} 
                  onValueChange={(value) => handleSettingChange('channel2', value)}
                >
                  {Array.from({ length: 256 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                  ))}
                </Select>
              </FormField>
              <FormField>
                <Label htmlFor="channel3">{t('channel3')}</Label>
                <Select 
                  value={lightingSettings.channel3.toString()} 
                  onValueChange={(value) => handleSettingChange('channel3', value)}
                >
                  {Array.from({ length: 256 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                  ))}
                </Select>
              </FormField>
              <FormField>
                <Label htmlFor="channel4">{t('channel4')}</Label>
                <Select 
                  value={lightingSettings.channel4.toString()} 
                  onValueChange={(value) => handleSettingChange('channel4', value)}
                >
                  {Array.from({ length: 256 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                  ))}
                </Select>
              </FormField>
            </FormGroup>
            <div className="flex gap-2 justify-end mt-auto">
              <Button 
                onClick={handleApply}
                className="bg-gray-600 hover:bg-gray-700 cursor-pointer"
              >
                <Check className="h-4 w-4 mr-2" />
                {tActions('apply')}
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                {tActions('cancel')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
