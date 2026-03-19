'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/framework/layout';
import { Badge } from '@/components/framework/data-display';
import { CheckCircle, ChevronRight } from 'lucide-react';

interface DetectionModelStatusProps {
  data: Array<{
    id: string;
    name: string;
    status: string;
    fps: string;
    inferenceTime: string;
    confidenceScore: string;
  }>;
}

export default function DetectionModelStatus({ data }: DetectionModelStatusProps) {
  return (
    <Card className="py-2 gap-2">
      <CardHeader title="검출 모델 상태" titleSize="lg" />
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">모델 이름</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">FPS</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">추론 시간(ms)</th>
                <th className="text-left py-2 px-4 font-medium text-gray-700">신뢰도 점수(%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((model) => (
                <tr key={model.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {model.status}
                    </Badge>
                  </td>
                  <td className="py-2 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {model.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{model.fps}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{model.inferenceTime}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{model.confidenceScore}</span>
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
