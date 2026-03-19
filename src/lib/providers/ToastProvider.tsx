// components/common/ToastProvider.tsx
// react-toastify의 ToastContainer를 앱 전체에 주입하는 Provider 컴포넌트
// 전역 위치 (layout.tsx)에서 사용되며, toast 메시지 출력 시 필요한 UI를 렌더링

import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import "@/styles/toast.css"

export const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-right"        // 오른쪽 상단에 표시
      autoClose={3000}            // 3초 후 자동 종료
      hideProgressBar={false}     // 진행 바 표시 여부
      newestOnTop                 // 최근 메시지를 상단에 표시
      closeOnClick                // 클릭 시 닫힘
      rtl={false}                 // 왼쪽→오른쪽 방향
      pauseOnFocusLoss            // 탭 포커스 잃으면 일시 정지
      draggable                   // 드래그 가능 여부
      pauseOnHover                // 마우스 올리면 일시 정지
      theme="light"               // 테마 설정 ("light" or "dark")
      toastClassName="custom-toast" // 커스텀 스타일 적용 (toast.css에서 정의)
    />
  );
};