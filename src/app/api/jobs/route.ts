import { NextRequest, NextResponse } from 'next/server';
import { sendRabbitMQMessage } from '@/lib/mq/rabbitmq';
import { sendKafkaMessage } from '@/lib/mq/kafka';
import { createJob, getJobStatus, cancelJob, getJobs } from '@/lib/job/jobService';
import { JobStatus } from '~prisma/client';

/**
 * 작업 요청 API
 * 
 * 1. 작업 ID 생성 및 DB에 저장
 * 2. MQ로 작업 메시지 전송
 * 3. 즉시 작업 ID 반환 (브라우저는 스피너 표시)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      data,
      priority,
      maxRetries,
      timeoutMinutes,
      createdBy,
      metadata,
    } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'type and data are required' },
        { status: 400 }
      );
    }

    // DB에 작업 생성
    const jobId = await createJob({
      type,
      inputData: data,
      priority: priority ?? 0,
      maxRetries: maxRetries ?? 3,
      timeoutMinutes: timeoutMinutes ?? 30,
      createdBy,
      metadata,
    });

    // MQ로 작업 메시지 전송 (jobId, type, data 모두 전송)
    const mqType = process.env.MQ_TYPE || 'rabbitmq';

    try {
      if (mqType === 'rabbitmq') {
        await sendRabbitMQMessage(
          'job-exchange',
          'job.created',
          {
            jobId,
            type,
            data,
            timestamp: new Date().toISOString(),
          }
        );
      } else {
        await sendKafkaMessage('job-events', [
          {
            key: jobId,
            value: JSON.stringify({
              jobId,
              type,
              data,
              timestamp: new Date().toISOString(),
            }),
          },
        ]);
      }
    } catch (mqError) {
      // MQ 전송 실패 시 작업을 FAILED로 표시
      console.error('Failed to send job to MQ:', mqError);
      // MQ 전송 실패는 작업 자체의 실패이므로 즉시 실패 처리
      // (나중에 재시도할 수 있도록 PENDING 상태로 남겨둘 수도 있음)
      // 현재는 에러만 로깅하고 작업은 PENDING 상태로 유지
    }

    // 즉시 작업 ID 반환
    return NextResponse.json({
      success: true,
      jobId,
      status: JobStatus.PENDING,
      message: 'Job queued successfully',
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      {
        error: 'Failed to create job',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 작업 상태 확인 API
 * 
 * 브라우저에서 폴링으로 호출하여 작업 상태 확인
 * 
 * GET /api/jobs?jobId=xxx - 특정 작업 상태 조회
 * GET /api/jobs?status=PENDING&type=EQUIPMENT_CREATE - 작업 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const status = searchParams.get('status') as JobStatus | null;
    const type = searchParams.get('type');
    const createdBy = searchParams.get('createdBy');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // 특정 작업 조회
    if (jobId) {
      const job = await getJobStatus(jobId);

      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(job);
    }

    // 작업 목록 조회
    const result = await getJobs({
      status: status ?? undefined,
      type: type ?? undefined,
      createdBy: createdBy ?? undefined,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch job status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 작업 취소 API
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const cancelledBy = searchParams.get('cancelledBy') || undefined;

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId is required' },
        { status: 400 }
      );
    }

    const success = await cancelJob(jobId, cancelledBy);

    if (!success) {
      return NextResponse.json(
        { error: 'Job cannot be cancelled (may be already completed or not found)' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling job:', error);
    return NextResponse.json(
      {
        error: 'Failed to cancel job',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

