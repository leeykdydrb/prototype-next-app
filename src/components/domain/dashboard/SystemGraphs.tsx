'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CardComponents } from '@/components/framework';
import { Badge } from '@/components/framework/data-display';
import { ChevronRight } from 'lucide-react';
import { SimpleLineChart, SimpleAreaChart, type ChartConfig } from '@/components/framework/chart';

type SeriesPoint = { name: string; value: number; value2: number };

/** collector 게이트웨이가 보내는 스냅샷 형태 (프로젝트 간 타입 중복 허용) */
type DashboardSnapshotPayload = {
  collectedAt: string;
  metrics: {
    cpuTemp: { value: number; value2: number };
    gpuTemp: { value: number; value2: number };
    cpuUsage: { value: number; value2: number };
    memoryUsage: { value: number; value2: number };
    diskActivity: { value: number; value2: number };
  };
};

type DashboardSeriesState = {
  cpuTemp: SeriesPoint[];
  gpuTemp: SeriesPoint[];
  cpuUsage: SeriesPoint[];
  memoryUsage: SeriesPoint[];
  diskActivity: SeriesPoint[];
};

const EMPTY_SERIES: DashboardSeriesState = {
  cpuTemp: [],
  gpuTemp: [],
  cpuUsage: [],
  memoryUsage: [],
  diskActivity: [],
};

function appendSeries(prev: SeriesPoint[], point: SeriesPoint, maxPoints: number): SeriesPoint[] {
  const next = [...prev, point];
  if (next.length > maxPoints) return next.slice(1);
  return next;
}

function timeLabelFromIso(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

/**
 * SSE: collector 내부 SSE 게이트웨이로부터 데이터를 받아옵니다.
 */
function useDashboardSse(maxPoints: { temp: number; usage: number }): DashboardSeriesState {
  const [series, setSeries] = useState<DashboardSeriesState>(EMPTY_SERIES);

  useEffect(() => {
    const es = new EventSource('/api/stream');

    es.onmessage = (event) => {
      const raw = JSON.parse(event.data) as
        | { type?: string; snapshot?: DashboardSnapshotPayload; point?: SeriesPoint };

      if (raw.type === 'dashboardSnapshot' && raw.snapshot?.metrics) {
        const name = timeLabelFromIso(raw.snapshot.collectedAt);
        const m = raw.snapshot.metrics;
        setSeries((prev) => ({
          cpuTemp: appendSeries(prev.cpuTemp, { name, value: m.cpuTemp.value, value2: m.cpuTemp.value2 }, maxPoints.temp),
          gpuTemp: appendSeries(prev.gpuTemp, { name, value: m.gpuTemp.value, value2: m.gpuTemp.value2 }, maxPoints.temp),
          cpuUsage: appendSeries(prev.cpuUsage, { name, value: m.cpuUsage.value, value2: m.cpuUsage.value2 }, maxPoints.usage),
          memoryUsage: appendSeries(prev.memoryUsage, { name, value: m.memoryUsage.value, value2: m.memoryUsage.value2 }, maxPoints.usage),
          diskActivity: appendSeries(prev.diskActivity, { name, value: m.diskActivity.value, value2: m.diskActivity.value2 }, maxPoints.usage),
        }));
        return;
      }
    };

    return () => {
      es.close();
    };
  }, [maxPoints.temp, maxPoints.usage]);

  return series;
}

function TemperatureCard({
  title,
  data,
  status,
  chartConfig,
}: {
  title: string;
  data: SeriesPoint[];
  status: string;
  chartConfig: ChartConfig;
}) {
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

function UsageCard({
  title,
  data,
  chartConfig,
}: {
  title: string;
  data: SeriesPoint[];
  chartConfig: ChartConfig;
}) {
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
  const tGraphs = useTranslations('Dashboard.graphs');
  const tDash = useTranslations('Dashboard');
  const statusOk = tDash('status.ok');

  const chartConfig: ChartConfig = useMemo(
    () => ({
      value: {
        label: tGraphs('seriesA'),
        color: 'var(--chart-1)',
      },
      value2: {
        label: tGraphs('seriesB'),
        color: 'var(--chart-2)',
      },
    }),
    [tGraphs],
  );

  const sse = useDashboardSse({ temp: 15, usage: 8 });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-1">
      {/* Left column: Temperature (line) */}
      <div className="lg:col-span-8 space-y-2 min-w-0">
        <TemperatureCard
          title={tGraphs('cpuTemp')}
          data={sse.cpuTemp}
          status={statusOk}
          chartConfig={chartConfig}
        />
        <TemperatureCard
          title={tGraphs('gpuTemp')}
          data={sse.gpuTemp}
          status={statusOk}
          chartConfig={chartConfig}
        />
      </div>

      {/* Right column: Usage (area) */}
      <div className="lg:col-span-4 space-y-2 min-w-0">
        <UsageCard title={tGraphs('cpuUsage')} data={sse.cpuUsage} chartConfig={chartConfig} />
        <UsageCard title={tGraphs('memoryUsage')} data={sse.memoryUsage} chartConfig={chartConfig} />
        <UsageCard title={tGraphs('diskUsage')} data={sse.diskActivity} chartConfig={chartConfig} />
      </div>
    </div>
  );
}
