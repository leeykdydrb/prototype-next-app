'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/framework/layout';
import { Badge } from '@/components/framework/data-display';
import { CheckCircle, ChevronRight } from 'lucide-react';

interface CameraStatusProps {
  data: Array<{
    id: string;
    name: string;
    status: string;
    ping: string;
    frameRate: string;
    dataThroughput: string;
  }>;
}

export default function CameraStatus({ data }: CameraStatusProps) {
  const t = useTranslations('Dashboard.camera');

  return (
    <Card className="py-2 gap-2">
      <CardHeader title={t('title')} titleSize="lg" />
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-700">{t('colStatus')}</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">{t('colCameraId')}</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">{t('colPing')}</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">{t('colFrameRate')}</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">{t('colThroughput')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((camera) => (
                <tr key={camera.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {camera.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {camera.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{camera.ping}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{camera.frameRate}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{camera.dataThroughput}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
