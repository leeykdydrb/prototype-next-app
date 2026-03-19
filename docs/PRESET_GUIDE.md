# Preset 기반 컴포넌트 가이드

## 📋 개요

Preset 기반 컴포넌트는 **최소한의 코드로 일관된 UI를 빠르게 구축**할 수 있도록 설계되었습니다. 
프로젝트의 핵심 철학인 "최소의 값만으로 쉽게 붙이고 없애고 하게 하기"를 실현합니다.

## 🎯 Preset의 장점

1. **빠른 개발**: 복잡한 설정 없이 바로 사용 가능
2. **일관된 디자인**: 프로젝트 전반에 걸쳐 동일한 스타일 유지
3. **유지보수 용이**: Preset 수정 시 모든 사용처에 자동 반영
4. **타입 안전성**: TypeScript로 완전한 타입 지원
5. **확장 가능**: 필요시 개별 설정으로 오버라이드 가능

## 📦 사용 가능한 Preset

### 1. Chart Presets

차트 컴포넌트에 사용되는 Preset입니다.

#### 사용 예시

```tsx
import { SimpleLineChart, SimpleAreaChart } from '@/components/framework/chart';

// 대시보드용 작은 차트
<SimpleLineChart 
  data={data} 
  preset="dashboard"
  config={chartConfig}
/>

// 실시간 모니터링용 차트
<SimpleLineChart 
  data={data} 
  preset="realtime"
  config={chartConfig}
  height="200px"
/>

// 전체 화면용 큰 차트
<SimpleLineChart 
  data={data} 
  preset="full"
  config={chartConfig}
/>

// 컴팩트한 차트
<SimpleAreaChart 
  data={data} 
  preset="compact"
  config={chartConfig}
/>
```

#### Preset 종류

- **`dashboard`**: 대시보드용 작은 차트 (150px 높이, 범례 없음)
- **`realtime`**: 실시간 모니터링용 (200px 높이, 범례 포함)
- **`full`**: 전체 화면용 큰 차트 (400px 높이, 모든 기능 포함)
- **`compact`**: 컴팩트한 차트 (120px 높이, 최소한의 기능)

### 2. Card Presets

카드 컴포넌트에 사용되는 Preset입니다.

#### 사용 예시

```tsx
import { CardPresets } from '@/components/framework/layout';

// 대시보드용 카드
<CardPresets.dashboard 
  title="제목"
  description="설명"
  headerActions={<Button>액션</Button>}
>
  내용
</CardPresets.dashboard>

// 리스트용 카드 (padding 없음)
<CardPresets.list 
  title="목록"
  headerActions={<Button>추가</Button>}
>
  <Table>...</Table>
</CardPresets.list>

// 폼용 카드 (큰 padding, 푸터 포함)
<CardPresets.form 
  title="폼 제목"
  footer={<Button>제출</Button>}
>
  <Form>...</Form>
</CardPresets.form>

// 상세보기용 카드 (그림자 효과)
<CardPresets.detail 
  title="상세 정보"
>
  상세 내용
</CardPresets.detail>

// 컴팩트한 카드
<CardPresets.compact>
  간단한 내용
</CardPresets.compact>
```

#### Preset 종류

- **`dashboard`**: 대시보드용 (기본 variant, 중간 padding, 헤더 포함)
- **`list`**: 리스트용 (기본 variant, padding 없음, 헤더 포함)
- **`form`**: 폼용 (기본 variant, 큰 padding, 헤더+푸터 포함)
- **`detail`**: 상세보기용 (elevated variant, 큰 padding, 헤더 포함)
- **`compact`**: 컴팩트한 카드 (outlined variant, 작은 padding, 헤더 없음)

### 3. Dialog Presets

다이얼로그 컴포넌트에 사용되는 Preset입니다.

#### 사용 예시

```tsx
import { DialogPresets } from '@/components/framework/layout';

// 폼 다이얼로그
<DialogPresets.form
  open={open}
  onClose={handleClose}
  title="사용자 추가"
  description="사용자 정보를 입력하세요"
  onSubmit={handleSubmit}
  submitLabel="추가"
  cancelLabel="취소"
>
  <Form.Input label="이름" />
  <Form.Input label="이메일" />
</DialogPresets.form>

// 확인 다이얼로그
<DialogPresets.confirm
  open={open}
  onClose={handleClose}
  onConfirm={handleDelete}
  title="삭제 확인"
  message="정말 삭제하시겠습니까?"
  confirmLabel="삭제"
  variant="destructive"
/>

// 정보 다이얼로그
<DialogPresets.info
  open={open}
  onClose={handleClose}
  title="알림"
  message="작업이 완료되었습니다."
/>
```

#### Preset 종류

- **`form`**: 폼 다이얼로그 (큰 크기, 헤더+바디+푸터, 제출/취소 버튼)
- **`confirm`**: 확인 다이얼로그 (중간 크기, 확인/취소 버튼)
- **`info`**: 정보 다이얼로그 (작은 크기, 확인 버튼만)

### 4. Form Presets

폼 컴포넌트에 사용되는 Preset입니다.

#### 사용 예시

```tsx
import { FormPresets } from '@/components/framework/form';

// 2열 폼
<FormPresets.twoColumn title="사용자 정보">
  <Form.Field>
    <Form.Label required>이름</Form.Label>
    <Form.Input />
  </Form.Field>
  <Form.Field>
    <Form.Label required>이메일</Form.Label>
    <Form.Input type="email" />
  </Form.Field>
</FormPresets.twoColumn>

// 1열 폼
<FormPresets.singleColumn title="설명">
  <Form.Field>
    <Form.Label>설명</Form.Label>
    <Form.Textarea />
  </Form.Field>
</FormPresets.singleColumn>

// 인라인 폼 (검색 필터 등)
<FormPresets.inline>
  <Form.Field>
    <Form.Label>검색</Form.Label>
    <Form.Input />
  </Form.Field>
  <Form.Button>검색</Form.Button>
</FormPresets.inline>

// 컴팩트한 폼
<FormPresets.compact title="설정">
  <Form.Field>
    <Form.Label>옵션</Form.Label>
    <Form.Switch />
  </Form.Field>
</FormPresets.compact>
```

#### Preset 종류

- **`twoColumn`**: 2열 폼 (반응형, 모바일에서는 1열)
- **`singleColumn`**: 1열 폼
- **`inline`**: 인라인 폼 (가로 배치, 검색 필터 등에 적합)
- **`compact`**: 컴팩트한 폼 (작은 간격, 모달 등에 적합)

## 🔄 Preset vs Compound Component vs 개별 컴포넌트

### Preset (가장 추천)
```tsx
// ✅ 가장 간단 - 최소한의 코드
<CardPresets.dashboard title="제목">
  내용
</CardPresets.dashboard>
```

### Compound Component
```tsx
// ✅ 유연한 제어가 필요할 때
<CardComponents.Root>
  <CardComponents.Header title="제목">
    <Badge>상태</Badge>
  </CardComponents.Header>
  <CardComponents.Content>
    내용
  </CardComponents.Content>
</CardComponents.Root>
```

### 개별 컴포넌트
```tsx
// ✅ 완전한 커스터마이징이 필요할 때
<Card className="custom-class">
  <CardHeader title="제목" className="custom-header" />
  <CardContent className="custom-content">
    내용
  </CardContent>
</Card>
```

## 📝 실제 사용 예시

### 예시 1: 사용자 추가 다이얼로그

```tsx
import { DialogPresets, FormPresets } from '@/components/framework';

function UserDialog({ open, onClose, onSubmit }) {
  return (
    <DialogPresets.form
      open={open}
      onClose={onClose}
      title="사용자 추가"
      description="새 사용자 정보를 입력하세요"
      onSubmit={onSubmit}
      submitLabel="추가"
    >
      <FormPresets.twoColumn>
        <Form.Field>
          <Form.Label required>이름</Form.Label>
          <Form.Input />
        </Form.Field>
        <Form.Field>
          <Form.Label required>이메일</Form.Label>
          <Form.Input type="email" />
        </Form.Field>
      </FormPresets.twoColumn>
    </DialogPresets.form>
  );
}
```

### 예시 2: 대시보드 카드

```tsx
import { CardPresets, SimpleLineChart } from '@/components/framework';

function DashboardCard({ title, data }) {
  return (
    <CardPresets.dashboard 
      title={title}
      headerActions={<Badge>정상</Badge>}
    >
      <SimpleLineChart 
        data={data} 
        preset="realtime"
        config={chartConfig}
      />
    </CardPresets.dashboard>
  );
}
```

### 예시 3: 리스트 페이지

```tsx
import { CardPresets, TableComponents } from '@/components/framework';

function UserList() {
  return (
    <CardPresets.list 
      title="사용자 목록"
      headerActions={<Button>추가</Button>}
    >
      <TableComponents.Root>
        <TableComponents.Header>
          {/* ... */}
        </TableComponents.Header>
        <TableComponents.Body>
          {/* ... */}
        </TableComponents.Body>
      </TableComponents.Root>
    </CardPresets.list>
  );
}
```

## 🎨 Preset 커스터마이징

Preset은 기본값을 제공하지만, 필요시 개별 속성으로 오버라이드할 수 있습니다.

```tsx
// Preset 사용하되 일부만 커스터마이징
<CardPresets.dashboard 
  title="제목"
  className="custom-class" // 추가 클래스 적용
>
  내용
</CardPresets.dashboard>

// 또는 Compound Component로 전환하여 더 세밀한 제어
<CardComponents.Root className="custom-class">
  <CardComponents.Header title="제목" titleSize="lg">
    {/* 커스텀 헤더 내용 */}
  </CardComponents.Header>
  <CardComponents.Content>
    내용
  </CardComponents.Content>
</CardComponents.Root>
```

## 🚀 마이그레이션 가이드

기존 코드를 Preset으로 마이그레이션하는 방법:

### Before
```tsx
<Card className="py-4">
  <CardHeader title="사용자 목록">
    <Button>추가</Button>
  </CardHeader>
  <CardContent>
    <Table>...</Table>
  </CardContent>
</Card>
```

### After
```tsx
<CardPresets.list 
  title="사용자 목록"
  headerActions={<Button>추가</Button>}
>
  <Table>...</Table>
</CardPresets.list>
```

## 📚 참고 문서

- [COMPONENT_PATTERN_UPDATE.md](./COMPONENT_PATTERN_UPDATE.md) - Compound Component 패턴
- [FRAMEWORK_ANALYSIS.md](./FRAMEWORK_ANALYSIS.md) - 프레임워크 분석
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - 마이그레이션 가이드






