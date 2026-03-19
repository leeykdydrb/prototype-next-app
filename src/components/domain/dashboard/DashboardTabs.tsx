'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/framework/layout';

export default function DashboardTabs() {
  return (
    <div className="flex flex-col w-full max-w-sm">
      <Tabs defaultValue="5CCL">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="5CCL" 
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            5CCL
          </TabsTrigger>
          <TabsTrigger 
            value="7CCL"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            7CCL
          </TabsTrigger>
          <TabsTrigger 
            value="2CCL"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            2CCL
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
