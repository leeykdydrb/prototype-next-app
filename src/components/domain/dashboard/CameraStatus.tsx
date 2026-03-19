'use client';

import React from 'react';
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
  return (
    <Card className="py-2 gap-2">
      <CardHeader title="카메라" titleSize="lg" />
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">카메라ID</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Ping</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">프레임 수신율</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">데이터 처리량(Mbps)</th>
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
