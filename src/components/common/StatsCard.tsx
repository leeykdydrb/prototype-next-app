"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from '@/components/framework/layout';

type StatConfig<T> = ReadonlyArray<{
  label: string;
  key: keyof T;
  color: string;
}>;

interface StatsProps<T> {
  stats: T;
  statConfig: StatConfig<T>;
}

function StatsCard<T extends object>({ stats, statConfig }: StatsProps<T>) {
  const gridCols = useMemo(() => {
    const count = statConfig.length;
    if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (count <= 4) return "grid-cols-2 sm:grid-cols-4";
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
  }, [statConfig.length]);
  
  return (
    <div className={`grid ${gridCols} gap-4 mb-4`}>
      {statConfig.map(({ label, key, color }) => (
        <Card key={String(key)}>
          <CardContent className="p-4">
            <div className="text-lg text-muted-foreground mb-2">
              {label}
            </div>
            <div className="text-2xl font-bold" style={{ color: color }}>
              {stats[key] as React.ReactNode}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default React.memo(StatsCard) as typeof StatsCard;