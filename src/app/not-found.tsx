'use client';

import React from 'react';
import { Button } from '@/components/framework/form';
import { Card, CardContent } from '@/components/framework/layout';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-8">
      {/* 404 숫자 */}
      <div className="mb-8">
        <h1 className="text-8xl md:text-10rem font-bold leading-none mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
          404
        </h1>
      </div>

      {/* 제목 */}
      <h2 className="text-2xl sm:text-3xl font-medium text-foreground mb-4">
        페이지를 찾을 수 없습니다
      </h2>

      {/* 설명 */}
      <p className="text-muted-foreground mb-8 max-w-lg">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다. 
        URL을 다시 확인하거나 아래 버튼을 사용하여 이동해주세요.
      </p>

      {/* 버튼 그룹 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
        <Button
          size="lg"
          onClick={handleGoHome}
          className="min-w-40 cursor-pointer"
        >
          <Home className="mr-2 h-4 w-4" />
          홈으로 이동
        </Button>
          
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoBack}
          className="min-w-40 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          이전 페이지
        </Button>
      </div>

      {/* 추가 정보 */}
      <Card className="max-w-sm">
        <CardContent className="text-sm text-muted-foreground">
          문제가 지속되면 관리자에게 문의해주세요.
        </CardContent>
      </Card>
    </div>
  );
}
