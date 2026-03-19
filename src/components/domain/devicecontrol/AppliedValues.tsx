'use client';

import React, { useState } from 'react';
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
      <CardHeader title="현재 적용된 제어값" titleSize="lg" />
      <CardContent className="space-y-2">
        <div 
          className="flex items-center gap-2 w-full hover:bg-gray-50 rounded cursor-pointer"
          onClick={() => toggleSection('camLeft')}
        >
          {expandedSections.camLeft ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">Cam_Left</span>
        </div>
        {expandedSections.camLeft && (
          <div className="pl-10 space-y-1">
            <div className="text-sm text-gray-600">노출값: {appliedValues.camLeft.exposure}</div>
            <div className="text-sm text-gray-600">게인값: {appliedValues.camLeft.gain}</div>
          </div>
        )}

        <div 
          className="flex items-center gap-2 w-full hover:bg-gray-50 rounded cursor-pointer"
          onClick={() => toggleSection('camRight')}
        >
          {expandedSections.camRight ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">Cam_Right</span>
        </div>
        {expandedSections.camRight && (
          <div className="pl-10 space-y-1">
            <div className="text-sm text-gray-600">노출값: {appliedValues.camRight.exposure}</div>
            <div className="text-sm text-gray-600">게인값: {appliedValues.camRight.gain}</div>
          </div>
        )}

        <div 
          className="flex items-center gap-2 w-full hover:bg-gray-50 rounded cursor-pointer"
          onClick={() => toggleSection('light')}
        >
          {expandedSections.light ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">Light</span>
        </div>
        {expandedSections.light && (
          <div className="pl-10 space-y-1">
            <div className="text-sm text-gray-600">채널 1밝기: {appliedValues.light.channel1}</div>
            <div className="text-sm text-gray-600">채널 2밝기: {appliedValues.light.channel2}</div>
            <div className="text-sm text-gray-600">채널 3밝기: {appliedValues.light.channel3}</div>
            <div className="text-sm text-gray-600">채널 4밝기: {appliedValues.light.channel4}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
