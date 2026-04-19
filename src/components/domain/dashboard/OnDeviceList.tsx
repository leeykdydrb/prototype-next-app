'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/framework/layout';
import { Badge } from '@/components/framework/data-display';
import { ChevronRight } from 'lucide-react';

const deviceData = [
  { id: 'Jetson01', ip: '192.168.2.2' },
  { id: 'Jetson02', ip: '192.168.2.3' },
];

interface OnDeviceListProps {
  selectedDevice: string;
  onDeviceSelect: (deviceId: string) => void;
}

export default function OnDeviceList({ selectedDevice, onDeviceSelect }: OnDeviceListProps) {
  const t = useTranslations('Dashboard.onDeviceList');
  const tDash = useTranslations('Dashboard');
  const statusOk = tDash('status.ok');

  return (
    <Card className="py-2 gap-2 h-full">
      <CardHeader title={t('title')} titleSize="lg" />
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-700">{t('colStatus')}</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">{t('colDeviceId')}</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">{t('colIp')}</th>
              </tr>
            </thead>
            <tbody>
              {deviceData.map((device) => (
                <tr 
                  key={device.id} 
                  className={`border-b hover:bg-gray-50 cursor-pointer ${
                    selectedDevice === device.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onDeviceSelect(device.id)}
                >
                  <td className="py-2 px-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {statusOk}
                    </Badge>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`hover:underline ${
                        selectedDevice === device.id ? 'text-blue-800 font-semibold' : 'text-blue-600'
                      }`}>
                        {device.id}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </td>
                  <td className="py-2 px-4 text-gray-600">{device.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
