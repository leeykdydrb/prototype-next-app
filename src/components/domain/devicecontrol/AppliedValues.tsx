'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/framework/layout';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AppliedValuesData {
  camLeft: { exposure: number; gain: number };
  camRight: { exposure: number; gain: number };
  light: { channel1: number; channel2: number; channel3: number; channel4: number };
}

interface AppliedValuesProps {
  appliedValues: AppliedValuesData;
}

export default function AppliedValues({ appliedValues }: AppliedValuesProps) {
  const t = useTranslations('DeviceControl.appliedValues');
  const tCam = useTranslations('DeviceControl.camera');
  const tLight = useTranslations('DeviceControl.lighting');

  const [expandedSections, setExpandedSections] = useState({
    camLeft: true,
    camRight: false,
    light: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card className="py-2 gap-2 h-full flex flex-col">
      <CardHeader title={t('title')} titleSize="lg" />
      <CardContent className="space-y-2">
        <div 
          className="flex items-center gap-2 w-full hover:bg-gray-50 rounded cursor-pointer"
          onClick={() => toggleSection('camLeft')}
        >
          {expandedSections.camLeft ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">{tCam('tabLeft')}</span>
        </div>
        {expandedSections.camLeft && (
          <div className="pl-10 space-y-1">
            <div className="text-sm text-gray-600">
              {t('exposureLine', { value: appliedValues.camLeft.exposure })}
            </div>
            <div className="text-sm text-gray-600">
              {t('gainLine', { value: appliedValues.camLeft.gain })}
            </div>
          </div>
        )}

        <div 
          className="flex items-center gap-2 w-full hover:bg-gray-50 rounded cursor-pointer"
          onClick={() => toggleSection('camRight')}
        >
          {expandedSections.camRight ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">{tCam('tabRight')}</span>
        </div>
        {expandedSections.camRight && (
          <div className="pl-10 space-y-1">
            <div className="text-sm text-gray-600">
              {t('exposureLine', { value: appliedValues.camRight.exposure })}
            </div>
            <div className="text-sm text-gray-600">
              {t('gainLine', { value: appliedValues.camRight.gain })}
            </div>
          </div>
        )}

        <div 
          className="flex items-center gap-2 w-full hover:bg-gray-50 rounded cursor-pointer"
          onClick={() => toggleSection('light')}
        >
          {expandedSections.light ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">{tLight('tabLight')}</span>
        </div>
        {expandedSections.light && (
          <div className="pl-10 space-y-1">
            <div className="text-sm text-gray-600">
              {t('channelBrightnessLine', { channel: 1, value: appliedValues.light.channel1 })}
            </div>
            <div className="text-sm text-gray-600">
              {t('channelBrightnessLine', { channel: 2, value: appliedValues.light.channel2 })}
            </div>
            <div className="text-sm text-gray-600">
              {t('channelBrightnessLine', { channel: 3, value: appliedValues.light.channel3 })}
            </div>
            <div className="text-sm text-gray-600">
              {t('channelBrightnessLine', { channel: 4, value: appliedValues.light.channel4 })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
