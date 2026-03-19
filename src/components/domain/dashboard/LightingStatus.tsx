'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/framework/layout';
import { Badge } from '@/components/framework/data-display';
import { CheckCircle, ChevronRight } from 'lucide-react';

interface LightingStatusProps {
  data: Array<{
    id: string;
    name: string;
    status: string;
    ping: string;
    brightness: string;
  }>;
}

export default function LightingStatus({ data }: LightingStatusProps) {
  return (
    <Card className="py-2 gap-2 h-full">
      <CardHeader title="조명" titleSize="lg" />
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">조명ID</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">Ping</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">밝기</th>
              </tr>
            </thead>
            <tbody>
              {data.map((light) => (
                <tr key={light.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {light.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {light.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{light.ping}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">{light.brightness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
