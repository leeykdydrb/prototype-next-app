'use client';

import React, { useState } from 'react';
import OnDeviceList from './OnDeviceList';
import CameraControl from './CameraControl';
import LightingControl from './LightingControl';
import AppliedValues from './AppliedValues';

// 디바이스별 설정값 타입 정의
interface DeviceSettings {
  camera: {
    left: { exposure: number; gain: number };
    right: { exposure: number; gain: number };
  };
  lighting: {
    channel1: number;
    channel2: number;
    channel3: number;
    channel4: number;
  };
}

export default function DeviceControlForm() {
  const [selectedDevice, setSelectedDevice] = useState('Jetson01');
  
  // 디바이스별 설정값 상태 관리
  const [deviceSettings, setDeviceSettings] = useState<Record<string, DeviceSettings>>({
    'Jetson01': {
      camera: {
        left: { exposure: 0.5, gain: 6 },
        right: { exposure: 0.5, gain: 6 }
      },
      lighting: {
        channel1: 255,
        channel2: 255,
        channel3: 255,
        channel4: 255
      }
    },
    'Jetson02': {
      camera: {
        left: { exposure: 1.0, gain: 12 },
        right: { exposure: 1.0, gain: 12 }
      },
      lighting: {
        channel1: 200,
        channel2: 200,
        channel3: 200,
        channel4: 200
      }
    }
  });

  // 현재 선택된 디바이스의 설정값
  const currentSettings = deviceSettings[selectedDevice] || deviceSettings['Jetson01'];

  // 디바이스 선택 핸들러
  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId);
  };

  // 카메라 설정 적용 핸들러
  const handleCameraApply = (settings: { left: { exposure: number; gain: number }; right: { exposure: number; gain: number } }) => {
    setDeviceSettings(prev => ({
      ...prev,
      [selectedDevice]: {
        ...prev[selectedDevice],
        camera: settings
      }
    }));
    console.log('Camera settings applied:', settings);
  };

  const handleCameraCancel = () => {
    console.log('Camera settings cancelled');
  };

  // 조명 설정 적용 핸들러
  const handleLightingApply = (settings: { channel1: number; channel2: number; channel3: number; channel4: number }) => {
    setDeviceSettings(prev => ({
      ...prev,
      [selectedDevice]: {
        ...prev[selectedDevice],
        lighting: settings
      }
    }));
    console.log('Lighting settings applied:', settings);
  };

  const handleLightingCancel = () => {
    console.log('Lighting settings cancelled');
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-2">
      {/* Left Sidebar - OnDevice List */}
      <div className="lg:col-span-3">
        <OnDeviceList 
          selectedDevice={selectedDevice}
          onDeviceSelect={handleDeviceSelect}
        />
      </div>

      {/* Center - Control Settings */}
      <div className="lg:col-span-6 h-full flex flex-col gap-2">
        <div className="flex-1">
          <CameraControl 
            settings={currentSettings.camera}
            onApply={handleCameraApply}
            onCancel={handleCameraCancel}
          />
        </div>
        <div className="flex-1">
          <LightingControl 
            settings={currentSettings.lighting}
            onApply={handleLightingApply}
            onCancel={handleLightingCancel}
          />
        </div>
      </div>

      {/* Right Sidebar - Applied Values */}
      <div className="lg:col-span-3">
        <AppliedValues 
          appliedValues={{
            camLeft: { 
              exposure: currentSettings.camera.left.exposure * 100000, 
              gain: currentSettings.camera.left.gain 
            },
            camRight: { 
              exposure: currentSettings.camera.right.exposure * 100000, 
              gain: currentSettings.camera.right.gain 
            },
            light: currentSettings.lighting
          }} 
        />
      </div>
    </div>
  );
}
