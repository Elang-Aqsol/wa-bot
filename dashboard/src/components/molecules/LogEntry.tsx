import React from 'react';
import { format } from 'date-fns';
import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogEntry as ILogEntry } from '@/config/viewmodels/useDashboardViewModel';

interface LogEntryProps {
  log: ILogEntry;
}

export const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  const config = {
    info: { icon: Info, color: 'text-blue-500' },
    warn: { icon: AlertTriangle, color: 'text-yellow-500' },
    error: { icon: XCircle, color: 'text-red-500' },
    success: { icon: CheckCircle, color: 'text-green-500' },
  };

  const { icon: Icon, color } = config[log.type] || config.info;
  const time = new Date(log.timestamp).toLocaleTimeString();

  return (
    <div className="flex animate-in fade-in slide-in-from-left-2 duration-300 items-start gap-4 border-b border-slate-50 py-3 last:border-0">
      <div className={cn("mt-0.5", color)}>
        <Icon size={16} />
      </div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <span className="text-sm font-medium leading-tight text-slate-700">
          {log.message}
        </span>
        <span className="text-[10px] font-medium text-slate-400">
          {time}
        </span>
      </div>
    </div>
  );
};
