# 프레임워크 구조 분석 및 개선 방안

## 📋 현재 구조 분석

### 현재 컴포넌트 계층 구조
```
components/
├── ui/              # 기본 컴포넌트 (shadcn/ui 기반)
├── framework/       # 템플릿화된 컴포넌트 (ui를 래핑)
├── domain/          # 비즈니스 로직 컴포넌트
└── common/          # 공통 컴포넌트
```

### 현재 구조의 장점 ✅
1. **명확한 계층 분리**: ui → framework → domain으로 책임이 분리됨
2. **재사용성**: framework 컴포넌트가 여러 domain에서 재사용 가능
3. **일관성**: framework을 통해 일관된 스타일과 동작 보장
4. **확장성**: ui 컴포넌트를 기반으로 커스터마이징 가능

### 현재 구조의 문제점 ⚠️

#### 1. **중복 래핑 문제**
- `framework` 컴포넌트가 단순히 `ui` 컴포넌트를 래핑만 하고 있어 중복이 많음
- 예: `ChartContainer`가 단순히 `BaseChartContainer`를 감싸기만 함

#### 2. **API 일관성 부족**
- 각 컴포넌트마다 props 인터페이스가 다름
- 일부는 단순 래핑, 일부는 추가 기능 제공
- 예: `Card`는 variant 제공, `ChartContainer`는 단순 래핑

#### 3. **최소한의 props로 사용하기 어려움**
- 차트 사용 시 `config`, `className` 등 여러 props 필요
- 기본값이 적절하지 않아 매번 설정 필요
- 예: `ChartContainer`에 `!aspect-none !flex-none` 같은 오버라이드 필요

#### 4. **Export 구조 불일치**
- `framework/layout/index.tsx`는 있지만 `framework/index.tsx`는 없음
- 일관된 import 경로가 없어 사용자가 혼란스러울 수 있음

#### 5. **컴포지션 패턴 미흡**
- Compound Component 패턴이 제대로 활용되지 않음
- 관련 컴포넌트들이 분리되어 있어 조합이 어려움

---

## 🎯 최신 실무 관점의 개선 방안

### 1. **컴포넌트 API 설계 원칙**

#### ✅ 권장: 최소한의 Props로 동작
```typescript
// ❌ 현재: 너무 많은 설정 필요
<ChartContainer config={chartConfig} className="!aspect-none !flex-none h-full w-full">
  <LineChart data={data}>
    <ChartTooltip content={<ChartTooltipContent />} />
    ...
  </LineChart>
</ChartContainer>

// ✅ 개선: 최소한의 props로 동작
<Chart data={data} type="line" />
```

#### ✅ 권장: 합리적인 기본값 제공
```typescript
// framework/chart.tsx 개선안
export function Chart({
  data,
  type = "line",
  height = "auto",
  config,
  className,
  ...props
}: ChartProps) {
  // 기본 config 자동 생성
  const defaultConfig = useMemo(() => {
    if (config) return config;
    return generateDefaultConfig(data);
  }, [data, config]);

  return (
    <ChartContainer 
      config={defaultConfig} 
      className={cn("h-full w-full", className)}
      {...props}
    >
      {type === "line" && <LineChart data={data} />}
      {type === "bar" && <BarChart data={data} />}
      {/* ... */}
    </ChartContainer>
  );
}
```

### 2. **계층 구조 재정의**

#### 현재 구조의 문제
- `ui/`와 `framework/`의 역할이 모호함
- 단순 래핑만 하는 컴포넌트가 많음

#### 개선안: 역할 명확화
```
components/
├── ui/                    # 원시 컴포넌트 (shadcn/ui)
│   └── [기본 컴포넌트들]
│
├── framework/             # 고수준 템플릿 컴포넌트
│   ├── chart/            # 차트 템플릿
│   │   ├── LineChart.tsx  # 완전한 라인 차트 컴포넌트
│   │   ├── BarChart.tsx   # 완전한 바 차트 컴포넌트
│   │   └── index.tsx      # 통합 export
│   ├── form/             # 폼 템플릿
│   ├── table/            # 테이블 템플릿
│   └── index.tsx         # 통합 export
│
└── domain/               # 비즈니스 로직
```

### 3. **Compound Component 패턴 활용**

#### 현재 문제
- 관련 컴포넌트들이 분리되어 있어 조합이 어려움
- 예: ChartTooltip, ChartLegend를 각각 import해야 함

#### 개선안
```typescript
// framework/chart/index.tsx
export const Chart = {
  Container: ChartContainer,
  Line: LineChart,
  Bar: BarChart,
  Area: AreaChart,
  Tooltip: ChartTooltip,
  Legend: ChartLegend,
  // ...
};

// 사용 예시
import { Chart } from '@/components/framework/chart';

<Chart.Container config={config}>
  <Chart.Line data={data} />
  <Chart.Tooltip />
  <Chart.Legend />
</Chart.Container>
```

### 4. **Preset 기반 컴포넌트 제공**

#### 목적: 최소한의 코드로 빠른 개발
```typescript
// framework/chart/presets.tsx
export const ChartPresets = {
  // 기본 라인 차트
  line: (data: any[]) => ({
    type: "line",
    config: generateDefaultConfig(data),
    height: "300px",
  }),
  
  // 대시보드용 작은 차트
  dashboard: (data: any[]) => ({
    type: "line",
    config: generateDefaultConfig(data),
    height: "150px",
    showLegend: false,
  }),
  
  // 실시간 모니터링용
  realtime: (data: any[]) => ({
    type: "area",
    config: generateDefaultConfig(data),
    height: "200px",
    animation: true,
  }),
};

// 사용 예시
<Chart {...ChartPresets.dashboard(data)} />
```

### 5. **통합 Export 구조**

```typescript
// framework/index.tsx
export * from './chart';
export * from './form';
export * from './layout';
export * from './data-display';
export * from './feedback';

// 사용 예시
import { Chart, Card, Button, Dialog } from '@/components/framework';
```

### 6. **타입 안전성 강화**

```typescript
// framework/chart/types.ts
export type ChartType = "line" | "bar" | "area" | "pie";
export type ChartSize = "sm" | "md" | "lg" | "xl" | "auto";

export interface ChartProps {
  data: any[];
  type?: ChartType;
  size?: ChartSize;
  config?: ChartConfig;
  // ...
}

// 자동 완성과 타입 체크 지원
```

---

## 🚀 구체적인 개선 제안

### 1. **차트 컴포넌트 개선**

#### 현재 문제
- `ChartContainer` 사용 시 스타일 오버라이드 필요
- `config`를 매번 정의해야 함
- 복잡한 구조

#### 개선안
```typescript
// framework/chart/LineChart.tsx
export function LineChart({
  data,
  height = "300px",
  config,
  showTooltip = true,
  showLegend = true,
  className,
  ...props
}: LineChartProps) {
  // 자동 config 생성
  const chartConfig = useMemo(() => {
    if (config) return config;
    return autoGenerateConfig(data);
  }, [data, config]);

  return (
    <ChartContainer 
      config={chartConfig}
      className={cn("h-full w-full", className)}
      style={{ height }}
    >
      <RechartsLineChart data={data} {...props}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        {showTooltip && (
          <ChartTooltip content={<ChartTooltipContent />} />
        )}
        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {/* 데이터 키 자동 감지하여 Line 생성 */}
        {generateLines(data, chartConfig)}
      </RechartsLineChart>
    </ChartContainer>
  );
}
```

### 2. **간단한 사용 예시 제공**

```typescript
// ✅ 최소한의 코드로 사용 가능
<LineChart data={chartData} />

// ✅ 필요시 커스터마이징
<LineChart 
  data={chartData}
  height="400px"
  showLegend={false}
  config={customConfig}
/>
```

### 3. **Card 컴포넌트 개선 (일관성 유지)**

```typescript
// framework/layout/card.tsx 개선안
export function Card({
  children,
  variant = "default",
  padding = "md",
  className,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <BaseCard className={cn(paddingClasses[padding], className)} {...props}>
      {children}
    </BaseCard>
  );
}

// 사용 예시
<Card padding="lg">
  <CardHeader title="제목" />
  <CardContent>내용</CardContent>
</Card>
```

---

## 📊 비교: 현재 vs 개선안

### 차트 사용 비교

#### 현재 방식
```typescript
// 복잡하고 설정이 많음
const chartConfig: ChartConfig = {
  value: { label: "Series A", color: "hsl(var(--chart-1))" },
  value2: { label: "Series B", color: "hsl(var(--chart-2))" },
};

<ChartContainer config={chartConfig} className="!aspect-none !flex-none h-full w-full">
  <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
    <YAxis tick={{ fontSize: 10 }} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent className="text-[10px] ml-8" />} />
    <Line dataKey="value" name="Series A" stroke="var(--chart-1)" />
    <Line dataKey="value2" name="Series B" stroke="var(--chart-2)" />
  </LineChart>
</ChartContainer>
```

#### 개선안
```typescript
// 간단하고 직관적
<LineChart 
  data={data}
  height="160px"
  showLegend={true}
/>

// 또는 더 세밀한 제어가 필요한 경우
<LineChart 
  data={data}
  config={customConfig}
  className="custom-chart"
/>
```

---

## 🎨 실무 베스트 프랙티스 적용

### 1. **Composition over Configuration**
- 설정보다는 컴포지션을 우선
- 작은 컴포넌트를 조합하여 사용

### 2. **Progressive Enhancement**
- 기본값으로 간단하게 사용 가능
- 필요시 점진적으로 커스터마이징 가능

### 3. **Type Safety**
- TypeScript로 완전한 타입 안전성 제공
- 자동 완성과 에러 방지

### 4. **Documentation**
- 각 컴포넌트의 사용 예시 제공
- Storybook 같은 문서화 도구 활용

---

## 📝 구현 우선순위

### Phase 1: 핵심 개선 (즉시)
1. ✅ `framework/index.tsx` 생성하여 통합 export
2. ✅ 차트 컴포넌트의 기본값 개선
3. ✅ ChartContainer 스타일 문제 해결

### Phase 2: 구조 개선 (단기)
1. Preset 기반 컴포넌트 추가
2. Compound Component 패턴 적용
3. 타입 정의 강화

### Phase 3: 고도화 (중기)
1. 자동 config 생성 로직
2. 테마 시스템 통합
3. 문서화 (Storybook)

---

## 💡 결론 및 권장사항

### 현재 구조 평가
- ✅ **전반적으로 좋은 구조**: 계층 분리가 명확함
- ⚠️ **개선 필요**: API 일관성과 사용 편의성 향상 필요

### 핵심 권장사항
1. **최소한의 Props로 동작**: 합리적인 기본값 제공
2. **일관된 API**: 모든 컴포넌트가 동일한 패턴 따르기
3. **통합 Export**: `framework/index.tsx`로 일관된 import
4. **Preset 제공**: 자주 사용하는 패턴을 Preset으로 제공
5. **점진적 개선**: 기존 코드를 깨뜨리지 않고 점진적으로 개선

### 다음 단계
1. `framework/index.tsx` 생성
2. 차트 컴포넌트 개선 (기본값, 자동 config 생성)
3. 다른 컴포넌트들도 동일한 패턴 적용
4. 문서화 및 예제 추가

