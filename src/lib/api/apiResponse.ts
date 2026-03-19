import { NextResponse } from "next/server";

export const ApiResponse = {
  success: <T>(data: T, message?: string) => {
    return NextResponse.json({
      success: true,
      message: message || "요청이 성공적으로 처리되었습니다.",
      data,
    });
  },
  
  error: (message: string, status: number = 400) => {
    return NextResponse.json(
      { success: false, message, data: null },
      { status }
    );
  },
  
  unauthorized: (message: string = "인증되지 않은 요청입니다.") => {
    return NextResponse.json(
      { success: false, message, data: null },
      { status: 401 }
    );
  }
};