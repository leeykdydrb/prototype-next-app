import { withAuthGuard } from "@/lib/auth/withAuthGuard";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** SystemGraphs.tsx가 처리하는 형태(collector 게이트웨이와 동일) */
export type DashboardSnapshotPayload = {
  collectedAt: string;
  metrics: {
    cpuTemp: { value: number; value2: number };
    gpuTemp: { value: number; value2: number };
    cpuUsage: { value: number; value2: number };
    memoryUsage: { value: number; value2: number };
    diskActivity: { value: number; value2: number };
  };
};

export type DashboardSnapshotStreamEvent = {
  type: "dashboardSnapshot";
  snapshot: DashboardSnapshotPayload;
};

/**
 * SSE: collector 내부 SSE 게이트웨이로부터 데이터를 받아옵니다.
 */
export const GET = withAuthGuard(async (req: NextRequest) => {
  const encoder = new TextEncoder();
  const signal = req.signal;

  const collectorBase = process.env.COLLECTOR_INTERNAL_URL; // ex) http://prototype-collector:4100
  const internalToken = process.env.COLLECTOR_INTERNAL_TOKEN; // must match collector GATEWAY_INTERNAL_TOKEN

  const stream = new ReadableStream({
    async start(controller) {
      const write = (s: string) => controller.enqueue(encoder.encode(s));

      try {
        // collector가 설정되어 있으면: collector SSE를 서버-서버로 구독 후 그대로 중계
        if (collectorBase && internalToken) {
          const url = `${collectorBase.replace(/\/$/, "")}/sse`;

          const resp = await fetch(url, {
            headers: { "x-internal-token": internalToken, },
            signal
          });

          if (!resp.ok || !resp.body) {
            write(`event: error\ndata: ${JSON.stringify({ error: "collector_unavailable", status: resp.status })}\n\n`);
            return;
          }

          const reader = resp.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (!signal.aborted) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // SSE 이벤트는 빈 줄(\n\n)로 구분
            let idx;
            while ((idx = buffer.indexOf("\n\n")) !== -1) {
              const chunk = buffer.slice(0, idx);
              buffer = buffer.slice(idx + 2);

              // data: 라인만 그대로 전달 (collector는 이미 data: {...}\n\n 형태)
              // comment(: ...)도 그대로 전달
              if (chunk.startsWith("data:") || chunk.startsWith(":") || chunk.startsWith("event:")) {
                write(`${chunk}\n\n`);
              }
            }
          }

          return;
        }
      } catch {
        /* 연결 종료 등 */
      } finally {
        try {
          controller.close();
        } catch {
          /* ignore */
        }
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
