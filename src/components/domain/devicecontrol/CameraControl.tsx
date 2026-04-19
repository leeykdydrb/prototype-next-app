'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/framework/layout';
import { Button, FormField, FormGroup, Label, Select, SelectItem } from '@/components/framework/form';
import { Check, X } from 'lucide-react';

interface CameraSettings {
  left: { exposure: number; gain: number };
  right: { exposure: number; gain: number };
}

interface CameraControlProps {
  settings: CameraSettings;
  onApply: (settings: CameraSettings) => void;
  onCancel: () => void;
}

export default function CameraControl({ settings, onApply, onCancel }: CameraControlProps) {
  const t = useTranslations('DeviceControl.camera');
  const tActions = useTranslations('DeviceControl.actions');
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(settings);

  // 외부에서 설정값이 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setCameraSettings(settings);
  }, [settings]);

  const handleSettingChange = (camera: 'left' | 'right', field: 'exposure' | 'gain', value: string) => {
    setCameraSettings(prev => ({
      ...prev,
      [camera]: {
        ...prev[camera],
        [field]: parseFloat(value)
      }
    }));
  };

  const handleApply = () => {
    onApply(cameraSettings);
  };

  const handleCancel = () => {
    setCameraSettings(settings);
    onCancel();
  };

  return (
    <Card className="py-2 gap-2 h-full flex flex-col">
      <CardHeader title={t('title')} titleSize="lg" />
      <CardContent className="flex-1 flex flex-col">
        <Tabs defaultValue="left" className="w-full flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="left" className="data-[state=active]:bg-gray-400 data-[state=active]:text-white">
              {t('tabLeft')}
            </TabsTrigger>
            <TabsTrigger value="right" className="data-[state=active]:bg-gray-400 data-[state=active]:text-white">
              {t('tabRight')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="left" className="flex-1 flex flex-col space-y-4">
            <FormGroup columns={2}>
              <FormField>
                <Label htmlFor="exposure-left">{t('exposure')}</Label>
                <Select 
                  value={cameraSettings.left.exposure.toFixed(1)} 
                  onValueChange={(value) => handleSettingChange('left', 'exposure', value)}
                >
                  <SelectItem value="0.1">0.1</SelectItem>
                  <SelectItem value="0.5">0.5</SelectItem>
                  <SelectItem value="1.0">1.0</SelectItem>
                  <SelectItem value="2.0">2.0</SelectItem>
                </Select>
              </FormField>
              <FormField>
                <Label htmlFor="gain-left">{t('gain')}</Label>
                <Select 
                  value={cameraSettings.left.gain.toString()} 
                  onValueChange={(value) => handleSettingChange('left', 'gain', value)}
                >
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="24">24</SelectItem>
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
          
          <TabsContent value="right" className="flex-1 flex flex-col space-y-4">
            <FormGroup columns={2}>
              <FormField>
                <Label htmlFor="exposure-right">{t('exposure')}</Label>
                <Select 
                  value={cameraSettings.right.exposure.toFixed(1)} 
                  onValueChange={(value) => handleSettingChange('right', 'exposure', value)}
                >
                  <SelectItem value="0.1">0.1</SelectItem>
                  <SelectItem value="0.5">0.5</SelectItem>
                  <SelectItem value="1.0">1.0</SelectItem>
                  <SelectItem value="2.0">2.0</SelectItem>
                </Select>
              </FormField>
              <FormField>
                <Label htmlFor="gain-right">{t('gain')}</Label>
                <Select 
                  value={cameraSettings.right.gain.toString()} 
                  onValueChange={(value) => handleSettingChange('right', 'gain', value)}
                >
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="24">24</SelectItem>
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
