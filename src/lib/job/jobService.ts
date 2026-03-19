/**
 * 작업 관리 서비스
 * 
 * 실무 수준의 작업 관리 기능 제공:
 * - 작업 생성 및 상태 관리
 * - 재시도 로직
 * - 타임아웃 처리
 * - 진행률 업데이트
 * - 작업 취소
 */

import { prisma } from '@/lib/prisma';
import { JobStatus, Prisma } from '~prisma/client';

export interface CreateJobInput {
  type: string;
  inputData: Prisma.InputJsonValue;
  priority?: number;
  maxRetries?: number;
  timeoutMinutes?: number;
  createdBy?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface JobResult {
  jobId: string;
  status: JobStatus;
  progress: number;
  result?: Prisma.JsonValue;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

/**
 * 작업 생성
 */
export async function createJob(input: CreateJobInput): Promise<string> {
  const timeoutAt = input.timeoutMinutes
    ? new Date(Date.now() + input.timeoutMinutes * 60 * 1000)
    : null;

  const job = await prisma.job.create({
    data: {
      type: input.type,
      status: JobStatus.PENDING,
      priority: input.priority ?? 0,
      inputData: input.inputData,
      maxRetries: input.maxRetries ?? 3,
      timeoutAt,
      createdBy: input.createdBy,
      metadata: input.metadata,
    },
  });

  return job.id;
}

/**
 * 작업 상태 조회
 */
export async function getJobStatus(jobId: string): Promise<JobResult | null> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return null;
  }

  // 타임아웃 체크
  if (job.status === JobStatus.PROCESSING && job.timeoutAt && new Date() > job.timeoutAt) {
    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: JobStatus.TIMEOUT,
        error: 'Job timeout',
        updatedAt: new Date(),
      },
    });
    
    return {
      jobId: job.id,
      status: JobStatus.TIMEOUT,
      progress: job.progress,
      result: job.result as Prisma.JsonValue | undefined,
      error: 'Job timeout',
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      startedAt: job.startedAt ?? undefined,
      completedAt: job.completedAt ?? undefined,
    };
  }

  return {
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    result: job.result as Prisma.JsonValue | undefined,
    error: job.error ?? undefined,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    startedAt: job.startedAt ?? undefined,
    completedAt: job.completedAt ?? undefined,
  };
}

/**
 * 작업 취소
 */
export async function cancelJob(jobId: string, cancelledBy?: string): Promise<boolean> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return false;
  }

  // 이미 완료되었거나 취소된 작업은 취소 불가
  if (
    job.status === JobStatus.COMPLETED ||
    job.status === JobStatus.CANCELLED ||
    job.status === JobStatus.FAILED
  ) {
    return false;
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: JobStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelledBy,
      updatedAt: new Date(),
    },
  });

  return true;
}

/**
 * 작업 목록 조회
 */
export async function getJobs(filters?: {
  status?: JobStatus;
  type?: string;
  createdBy?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Prisma.JobWhereInput = {};

  if (filters?.status) {
    where.status = filters.status;
  }
  if (filters?.type) {
    where.type = filters.type;
  }
  if (filters?.createdBy) {
    where.createdBy = filters.createdBy;
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: filters?.limit ?? 50,
      skip: filters?.offset ?? 0,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    total,
    limit: filters?.limit ?? 50,
    offset: filters?.offset ?? 0,
  };
}

