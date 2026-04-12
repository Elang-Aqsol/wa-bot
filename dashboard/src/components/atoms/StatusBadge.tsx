import React from 'react';
import { cn } from '@/lib/utils';
import { BotStatus } from '@/config/viewmodels/useDashboardViewModel';

interface StatusBadgeProps {
  status: BotStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    idle: { label: 'Idle', color: 'bg-slate-500' },
    waiting_for_scan: { label: 'Waiting for Scan', color: 'bg-yellow-500 animate-pulse' },
    online: { label: 'Online', color: 'bg-green-500' },
    error: { label: 'Error', color: 'bg-red-500' },
  };

  const { label, color } = config[status] || config.idle;

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full", color)} />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};
