"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ChartContainer as BaseChartContainer,
  ChartTooltip as BaseChartTooltip,
  ChartTooltipContent as BaseChartTooltipContent,
  ChartLegend as BaseChartLegend,
  ChartLegendContent as BaseChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";

// Re-export recharts primitives for convenience
export {
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Helper function to auto-generate chart config from data
function autoGenerateConfig(data: Record<string, unknown>[]): ChartConfig {
  if (!data || data.length === 0) {
    return {};
  }

  const config: ChartConfig = {};
  const firstItem = data[0];
  const keys = Object.keys(firstItem).filter(key => key !== 'name');

  keys.forEach((key, index) => {
    const colorIndex = index % 5; // 5가지 기본 색상 순환
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: `hsl(var(--chart-${colorIndex + 1}))`,
    };
  });

  return config;
}

// Chart Container Props
interface ChartContainerProps extends React.ComponentProps<"div"> {
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
  config?: ChartConfig;
  data?: Record<string, unknown>[]; // data를 제공하면 자동으로 config 생성
  className?: string;
}

// Chart Container Component - Enhanced wrapper for charts with auto-config
export function ChartContainer({
  children,
  config,
  data,
  className,
  ...props
}: ChartContainerProps) {
  const chartConfig = useMemo(() => {
    if (config) return config;
    if (data) return autoGenerateConfig(data);
    return {};
  }, [config, data]);

  return (
    <BaseChartContainer 
      config={chartConfig} 
      className={cn("!aspect-none !flex-none h-full w-full", className)} 
      {...props}
    >
      {children}
    </BaseChartContainer>
  );
}

// Chart Tooltip Component - Re-export from ui/chart (it's already a recharts Tooltip wrapper)
export const ChartTooltip = BaseChartTooltip;

// Chart Tooltip Content Props
interface ChartTooltipContentProps
  extends React.ComponentProps<typeof BaseChartTooltipContent> {
  children?: React.ReactNode;
}

// Chart Tooltip Content Component
export function ChartTooltipContent({
  children,
  className,
  ...props
}: ChartTooltipContentProps) {
  return (
    <BaseChartTooltipContent className={className} {...props}>
      {children}
    </BaseChartTooltipContent>
  );
}

// Chart Legend Component - Re-export from ui/chart (it's already a recharts Legend wrapper)
export const ChartLegend = BaseChartLegend;

// Chart Legend Content Props
interface ChartLegendContentProps
  extends React.ComponentProps<typeof BaseChartLegendContent> {
  children?: React.ReactNode;
}

// Chart Legend Content Component
export function ChartLegendContent({
  children,
  className,
  ...props
}: ChartLegendContentProps) {
  return (
    <BaseChartLegendContent className={className} {...props}>
      {children}
    </BaseChartLegendContent>
  );
}

// Re-export ChartConfig type
export type { ChartConfig };

// ============================================================================
// Chart Presets - 자주 사용하는 차트 패턴을 Preset으로 제공
// ============================================================================

export type ChartPresetType = "dashboard" | "realtime" | "full" | "compact";

export interface ChartPresetOptions {
  height?: string;
  showTooltip?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  tickFontSize?: number;
}

// Preset 설정 정의
const presetConfigs: Record<ChartPresetType, ChartPresetOptions> = {
  dashboard: {
    height: "150px",
    showTooltip: true,
    showLegend: false,
    showGrid: true,
    margin: { top: 8, right: 8, left: 0, bottom: 0 },
    tickFontSize: 10,
  },
  realtime: {
    height: "200px",
    showTooltip: true,
    showLegend: true,
    showGrid: true,
    margin: { top: 8, right: 8, left: 0, bottom: 0 },
    tickFontSize: 10,
  },
  full: {
    height: "400px",
    showTooltip: true,
    showLegend: true,
    showGrid: true,
    margin: { top: 16, right: 16, left: 16, bottom: 16 },
    tickFontSize: 12,
  },
  compact: {
    height: "120px",
    showTooltip: true,
    showLegend: false,
    showGrid: false,
    margin: { top: 4, right: 4, left: 0, bottom: 0 },
    tickFontSize: 9,
  },
};

// Chart Presets 객체 - Preset 함수들을 제공
export const ChartPresets = {
  /**
   * 대시보드용 작은 차트 Preset
   * - 작은 높이 (150px)
   * - 범례 없음
   * - 간단한 툴팁
   */
  dashboard: (data: Record<string, unknown>[], config?: ChartConfig) => ({
    data,
    config: config || autoGenerateConfig(data),
    ...presetConfigs.dashboard,
  }),

  /**
   * 실시간 모니터링용 차트 Preset
   * - 중간 높이 (200px)
   * - 범례 포함
   * - 그리드 표시
   */
  realtime: (data: Record<string, unknown>[], config?: ChartConfig) => ({
    data,
    config: config || autoGenerateConfig(data),
    ...presetConfigs.realtime,
  }),

  /**
   * 전체 화면용 큰 차트 Preset
   * - 큰 높이 (400px)
   * - 모든 기능 포함
   */
  full: (data: Record<string, unknown>[], config?: ChartConfig) => ({
    data,
    config: config || autoGenerateConfig(data),
    ...presetConfigs.full,
  }),

  /**
   * 컴팩트한 차트 Preset
   * - 매우 작은 높이 (120px)
   * - 최소한의 기능만
   */
  compact: (data: Record<string, unknown>[], config?: ChartConfig) => ({
    data,
    config: config || autoGenerateConfig(data),
    ...presetConfigs.compact,
  }),
};

// ============================================================================
// Simple Chart Components - Preset을 사용하는 고수준 컴포넌트
// ============================================================================

interface SimpleLineChartProps {
  data: Record<string, unknown>[];
  preset?: ChartPresetType;
  config?: ChartConfig;
  height?: string;
  className?: string;
  dataKeys?: string[]; // 표시할 데이터 키 (없으면 자동 감지)
}

/**
 * 간단한 라인 차트 컴포넌트
 * Preset을 사용하여 최소한의 설정으로 차트 생성
 */
export function SimpleLineChart({
  data,
  preset = "dashboard",
  config,
  height,
  className,
  dataKeys,
}: SimpleLineChartProps) {
  const presetOptions = useMemo(() => {
    if (preset) {
      const presetData = ChartPresets[preset](data, config);
      return {
        ...presetData,
        height: height || presetData.height,
      };
    }
    return {
      data,
      config: config || autoGenerateConfig(data),
      height: height || "300px",
      showTooltip: true,
      showLegend: true,
      showGrid: true,
      margin: { top: 8, right: 8, left: 0, bottom: 0 },
      tickFontSize: 10,
    };
  }, [data, preset, config, height]);

  const keys = useMemo(() => {
    if (dataKeys) return dataKeys;
    if (!data || data.length === 0) return [];
    const firstItem = data[0];
    return Object.keys(firstItem).filter(key => key !== 'name');
  }, [data, dataKeys]);

  return (
    <ChartContainer
      data={presetOptions.data}
      config={presetOptions.config}
      className={cn(className)}
      style={{ height: presetOptions.height }}
    >
      <RechartsPrimitive.LineChart
        data={presetOptions.data}
        margin={presetOptions.margin}
      >
        {presetOptions.showGrid && (
          <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        )}
        <RechartsPrimitive.XAxis
          dataKey="name"
          tick={{ fontSize: presetOptions.tickFontSize }}
        />
        <RechartsPrimitive.YAxis tick={{ fontSize: presetOptions.tickFontSize }} />
        {presetOptions.showTooltip && (
          <ChartTooltip content={<ChartTooltipContent />} />
        )}
        {presetOptions.showLegend && (
          <ChartLegend
            content={
              <ChartLegendContent 
                className={cn(`text-[${presetOptions.tickFontSize}px]`)} 
              />
            }
          />
        )}
        {keys.map((key, index) => {
          const itemConfig = presetOptions.config[key];
          const label = typeof itemConfig?.label === 'string' 
            ? itemConfig.label 
            : key;
          return (
            <RechartsPrimitive.Line
              key={key}
              type="monotone"
              dataKey={key}
              name={label}
              stroke={itemConfig?.color || `hsl(var(--chart-${(index % 5) + 1}))`}
              strokeWidth={2}
              dot={false}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          );
        })}
      </RechartsPrimitive.LineChart>
    </ChartContainer>
  );
}

interface SimpleAreaChartProps {
  data: Record<string, unknown>[];
  preset?: ChartPresetType;
  config?: ChartConfig;
  height?: string;
  className?: string;
  dataKeys?: string[];
  fillOpacity?: number;
}

/**
 * 간단한 영역 차트 컴포넌트
 * Preset을 사용하여 최소한의 설정으로 차트 생성
 */
export function SimpleAreaChart({
  data,
  preset = "dashboard",
  config,
  height,
  className,
  dataKeys,
  fillOpacity = 0.3,
}: SimpleAreaChartProps) {
  const presetOptions = useMemo(() => {
    if (preset) {
      const presetData = ChartPresets[preset](data, config);
      return {
        ...presetData,
        height: height || presetData.height,
      };
    }
    return {
      data,
      config: config || autoGenerateConfig(data),
      height: height || "300px",
      showTooltip: true,
      showLegend: true,
      showGrid: true,
      margin: { top: 8, right: 8, left: 0, bottom: 0 },
      tickFontSize: 10,
    };
  }, [data, preset, config, height]);

  const keys = useMemo(() => {
    if (dataKeys) return dataKeys;
    if (!data || data.length === 0) return [];
    const firstItem = data[0];
    return Object.keys(firstItem).filter(key => key !== 'name');
  }, [data, dataKeys]);

  return (
    <ChartContainer
      data={presetOptions.data}
      config={presetOptions.config}
      className={cn(className)}
      style={{ height: presetOptions.height }}
    >
      <RechartsPrimitive.AreaChart
        data={presetOptions.data}
        margin={presetOptions.margin}
      >
        {presetOptions.showGrid && (
          <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        )}
        <RechartsPrimitive.XAxis
          dataKey="name"
          tick={{ fontSize: presetOptions.tickFontSize }}
        />
        <RechartsPrimitive.YAxis tick={{ fontSize: presetOptions.tickFontSize }} />
        {presetOptions.showTooltip && (
          <ChartTooltip content={<ChartTooltipContent />} />
        )}
        {presetOptions.showLegend && (
          <ChartLegend
            content={
              <ChartLegendContent 
                className={cn(`text-[${presetOptions.tickFontSize}px]`)} 
              />
            }
          />
        )}
        {keys.map((key, index) => {
          const itemConfig = presetOptions.config[key];
          const label = typeof itemConfig?.label === 'string' 
            ? itemConfig.label 
            : key;
          return (
            <RechartsPrimitive.Area
              key={key}
              type="linear"
              dataKey={key}
              name={label}
              stroke={itemConfig?.color || `hsl(var(--chart-${(index % 5) + 1}))`}
              fill={itemConfig?.color || `hsl(var(--chart-${(index % 5) + 1}))`}
              fillOpacity={fillOpacity}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          );
        })}
      </RechartsPrimitive.AreaChart>
    </ChartContainer>
  );
}

// ============================================================================
// Compound Component Pattern - Chart 네임스페이스로 관련 컴포넌트 그룹화
// ============================================================================

/**
 * Chart Compound Component
 * 
 * 관련 컴포넌트들을 네임스페이스로 그룹화하여 사용성을 향상시킵니다.
 * 
 * @example
 * ```tsx
 * import { Chart } from '@/components/framework/chart';
 * 
 * <Chart.Container data={data} config={config}>
 *   <Chart.LineChart data={data}>
 *     <Chart.XAxis dataKey="name" />
 *     <Chart.YAxis />
 *     <Chart.Tooltip />
 *     <Chart.Legend />
 *     <Chart.Line dataKey="value" />
 *   </Chart.LineChart>
 * </Chart.Container>
 * ```
 */
export const Chart = {
  // Container
  Container: ChartContainer,
  
  // Chart Types
  LineChart: RechartsPrimitive.LineChart,
  BarChart: RechartsPrimitive.BarChart,
  AreaChart: RechartsPrimitive.AreaChart,
  PieChart: RechartsPrimitive.PieChart,
  
  // Chart Elements
  Line: RechartsPrimitive.Line,
  Bar: RechartsPrimitive.Bar,
  Area: RechartsPrimitive.Area,
  Pie: RechartsPrimitive.Pie,
  Cell: RechartsPrimitive.Cell,
  
  // Axes
  XAxis: RechartsPrimitive.XAxis,
  YAxis: RechartsPrimitive.YAxis,
  CartesianGrid: RechartsPrimitive.CartesianGrid,
  
  // Tooltip & Legend
  Tooltip: ChartTooltip,
  TooltipContent: ChartTooltipContent,
  Legend: ChartLegend,
  LegendContent: ChartLegendContent,
  
  // Simple Components (Preset 기반)
  SimpleLine: SimpleLineChart,
  SimpleArea: SimpleAreaChart,
  
  // Presets
  Presets: ChartPresets,
} as const;

