'use client';

import React from 'react';
// components
import DeviceList from './DeviceList';

export default function DeviceForm() {
  console.log("DeviceForm");
  return (
    <div className="w-full">
      {/* 디바이스 목록 */}
      <DeviceList />
    </div>
  );
}