'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
// components
import DashboardTabs from './DashboardTabs';
import OnDeviceList from './OnDeviceList';
import DetectionModelStatus from './DetectionModelStatus';
import CameraStatus from './CameraStatus';
import LightingStatus from './LightingStatus';
import SystemGraphs from './SystemGraphs';

// 디바이스별 데이터 타입 정의
interface DetectionModelItem {
  id: string;
  name: string;
  status: string;
  fps: string;
  inferenceTime: string;
  confidenceScore: string;
}

interface CameraItem {
  id: string;
  name: string;
  status: string;
  ping: string;
  frameRate: string;
  dataThroughput: string;
}

interface LightingItem {
  id: string;
  name: string;
  status: string;
  ping: string;
  brightness: string;
}

interface DeviceData {
  detectionModel: DetectionModelItem[];
  camera: CameraItem[];
  lighting: LightingItem[];
}

export default function DashboardForm() {
  const [selectedDevice, setSelectedDevice] = useState('Jetson01');
  const t = useTranslations('Dashboard');
  const ok = t('status.ok');

  const deviceData: Record<string, DeviceData> = useMemo(
    () => ({
      Jetson01: {
        detectionModel: [
          {
            id: 'model-a',
            name: t('mock.modelA'),
            status: ok,
            fps: '29.8',
            inferenceTime: '33.6',
            confidenceScore: '99.2',
          },
          {
            id: 'model-b',
            name: t('mock.modelB'),
            status: ok,
            fps: '40.8',
            inferenceTime: '24.5',
            confidenceScore: '98.7',
          },
        ],
        camera: [
          {
            id: 'cam-left',
            name: '#Cam_left',
            status: ok,
            ping: ok,
            frameRate: '30',
            dataThroughput: '15.5',
          },
          {
            id: 'cam-right',
            name: '#Cam_right',
            status: ok,
            ping: ok,
            frameRate: '30',
            dataThroughput: '15.5',
          },
        ],
        lighting: [
          {
            id: 'light-1',
            name: t('mock.light1'),
            status: ok,
            ping: ok,
            brightness: '100',
          },
        ],
      },
      Jetson02: {
        detectionModel: [
          {
            id: 'model-c',
            name: t('mock.modelC'),
            status: ok,
            fps: '25.2',
            inferenceTime: '39.7',
            confidenceScore: '97.8',
          },
          {
            id: 'model-d',
            name: t('mock.modelD'),
            status: ok,
            fps: '35.1',
            inferenceTime: '28.5',
            confidenceScore: '99.1',
          },
        ],
        camera: [
          {
            id: 'cam-left',
            name: '#Cam_left',
            status: ok,
            ping: ok,
            frameRate: '25',
            dataThroughput: '12.8',
          },
          {
            id: 'cam-right',
            name: '#Cam_right',
            status: ok,
            ping: ok,
            frameRate: '25',
            dataThroughput: '12.8',
          },
        ],
        lighting: [
          {
            id: 'light-1',
            name: t('mock.light1'),
            status: ok,
            ping: ok,
            brightness: '85',
          },
        ],
      },
    }),
    [t, ok],
  );

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
  };

  const currentDeviceData = deviceData[selectedDevice] || deviceData['Jetson01'];
  return (
    <div className="w-full space-y-1">
      {/* 탭 */}
      <DashboardTabs />
      
      {/* 테이블 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
        {/* OnDeviceList - 12/5 */}
        <div className="lg:col-span-5 text-sm">
          <OnDeviceList 
            selectedDevice={selectedDevice}
            onDeviceSelect={handleDeviceSelect}
          />
        </div>
        
        {/* DetectionModelStatus - 12/7 */}
        <div className="lg:col-span-7 text-sm">
          <DetectionModelStatus data={currentDeviceData.detectionModel} />
        </div>
        
        {/* CameraStatus - 12/7 */}
        <div className="lg:col-span-7 lg:mt-2 text-sm">
          <CameraStatus data={currentDeviceData.camera} />
        </div>

        {/* LightingStatus - 12/5 */}
        <div className="lg:col-span-5 lg:mt-2 text-sm">
          <LightingStatus data={currentDeviceData.lighting} />
        </div>

        {/* SystemGraphs - 12/12 */}
        <div className="lg:col-span-12 lg:mt-2">
          <SystemGraphs />
        </div>
      </div>
    </div>
  );
}