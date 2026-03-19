'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CardComponents } from '@/components/framework';
import { Badge } from '@/components/framework/data-display';
import { ChevronRight } from 'lucide-react';
import { SimpleLineChart, SimpleAreaChart, type ChartConfig } from '@/components/framework/chart';

type SeriesPoint = { name: string; value: number; value2: number };

// Chart configuration
const chartConfig: ChartConfig = {
  value: {
    label: "Series A",
    color: "var(--chart-1)",
  },
  value2: {
    label: "Series B",
    color: "var(--chart-2)",
  },
};

// 실시간 데이터 생성을 위한 훅
function useRealtimeData(initialData: SeriesPoint[], maxPoints: number = 20) {
  const [data, setData] = useState<SeriesPoint[]>(initialData);

  const generateRandomValue = useCallback(() => Math.floor(Math.random() * 101), []);

  const addNewDataPoint = useCallback(() => {
    setData(prevData => {
      const now = new Date();
      const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const newPoint: SeriesPoint = {
        name: timeLabel,
        value: generateRandomValue(),
        value2: generateRandomValue()
      };

      // 기존 데이터에 새 포인트 추가
      const newData = [...prevData, newPoint];
      
      // 최대 포인트 수를 초과하면 가장 오래된 데이터 제거 (슬라이딩 윈도우)
      if (newData.length > maxPoints) {
        return newData.slice(1);
      }
      
      return newData;
    });
  }, [generateRandomValue, maxPoints]);

  useEffect(() => {
    const interval = setInterval(addNewDataPoint, 2000); // 2초마다 업데이트
    return () => clearInterval(interval);
  }, [addNewDataPoint]);

  return data;
}

function TemperatureCard({ title, data, status = '정상' }: { title: string; data: SeriesPoint[]; status?: string }) {
  // Preset을 사용한 간단한 방법 (주석 처리된 부분은 기존 방법)
  return (
    <CardComponents.Root className="py-2 gap-2 min-w-0">
      <CardComponents.Header title={title} titleSize="lg" align="start" gap={2}>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {status}
        </Badge>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </CardComponents.Header>
      <CardComponents.Content className="px-0 min-w-0">
        <div className="-ml-4 mr-4 h-40 min-w-0">
          {/* 방법 1: Preset 사용 - 가장 간단 */}
          <SimpleLineChart 
            data={data} 
            preset="realtime"
            config={chartConfig}
            height="160px"
            dataKeys={["value", "value2"]}
          />
          
          {/* 방법 2: Compound Component 패턴 사용 - 유연한 제어 */}
          {/* <Chart.Container data={data} config={chartConfig} className="h-full w-full">
            <Chart.LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <Chart.CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <Chart.XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <Chart.YAxis tick={{ fontSize: 10 }} />
              <Chart.Tooltip content={<Chart.TooltipContent />} />
              <Chart.Legend content={<Chart.LegendContent className="text-[10px] ml-8" />} />
              <Chart.Line 
                type="monotone" 
                dataKey="value" 
                name="Series A" 
                stroke="var(--chart-1)" 
                strokeWidth={2} 
                dot={false}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              <Chart.Line 
                type="monotone" 
                dataKey="value2" 
                name="Series B" 
                stroke="var(--chart-2)" 
                strokeWidth={2} 
                dot={false}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </Chart.LineChart>
          </Chart.Container> */}
        </div>
      </CardComponents.Content>
    </CardComponents.Root>
  );
}

function UsageCard({ title, data }: { title: string; data: SeriesPoint[]; color?: string }) {
  // Preset을 사용한 간단한 방법
  return (
    <CardComponents.Root className="py-1 gap-1 min-w-0 h-36">
      <CardComponents.Header title={title} titleClassName="text-sm font-medium text-gray-700" align="start" gap={2}>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </CardComponents.Header>
      <CardComponents.Content className="px-0 min-w-0">
        <div className="-ml-4 mr-4 h-30 min-w-0">
          {/* Preset 사용 - dashboard preset은 범례가 없어서 compact 사용 */}
          <SimpleAreaChart 
            data={data} 
            preset="compact"
            config={chartConfig}
            height="120px"
            dataKeys={["value", "value2"]}
            fillOpacity={0.3}
          />
          
          {/* 기존 방법 (더 세밀한 제어가 필요한 경우) */}
          {/* <ChartContainer data={data} config={chartConfig} className="h-full w-full">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="linear" 
                dataKey="value" 
                name="Series A" 
                stroke="var(--chart-1)" 
                fill="var(--chart-1)" 
                fillOpacity={0.3}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
              <Area 
                type="linear" 
                dataKey="value2" 
                name="Series B" 
                stroke="var(--chart-2)" 
                fill="var(--chart-2)" 
                fillOpacity={0.25}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ChartContainer> */}
        </div>
      </CardComponents.Content>
    </CardComponents.Root>
  );
}

export default function SystemGraphs() {
  // 초기 데이터 생성
  const generateInitialData = (count: number = 10) => {
    const now = new Date();
    return Array.from({ length: count }, (_, i) => {
      const time = new Date(now.getTime() - (count - 1 - i) * 2 * 1000); // 2초 간격
      const timeLabel = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
      return {
        name: timeLabel,
        value: Math.floor(Math.random() * 101),
        value2: Math.floor(Math.random() * 101)
      };
    });
  };

  // 실시간 데이터 훅 사용 (더 많은 포인트로 부드러운 흐름)
  const cpuTemp = useRealtimeData(generateInitialData(15), 15);
  const gpuTemp = useRealtimeData(generateInitialData(15), 15);
  const cpuUsage = useRealtimeData(generateInitialData(15), 15);
  const memoryUsage = useRealtimeData(generateInitialData(15), 15);
  const diskUsage = useRealtimeData(generateInitialData(15), 15);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-1">
      {/* Left column: Temperature (line) */}
      <div className="lg:col-span-8 space-y-2 min-w-0">
        <TemperatureCard title="CPU 온도" data={cpuTemp} status="정상" />
        <TemperatureCard title="GPU 온도" data={gpuTemp} status="정상" />
      </div>

      {/* Right column: Usage (area) */}
      <div className="lg:col-span-4 space-y-2 min-w-0">
        <UsageCard title="CPU 용량" data={cpuUsage} />
        <UsageCard title="메모리 용량" data={memoryUsage} />
        <UsageCard title="디스크 용량" data={diskUsage} />
      </div>
    </div>
  );
}
