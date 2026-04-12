import React from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { LogEntry as ILogEntry } from '@/config/viewmodels/useDashboardViewModel';
import { LogEntry } from '../molecules/LogEntry';

interface LiveConsoleProps {
  logs: ILogEntry[];
  onClear: () => void;
}

export const LiveConsole: React.FC<LiveConsoleProps> = ({ logs, onClear }) => {
  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b bg-slate-50/50 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500">
            <Terminal size={14} />
          </div>
          <h2 className="text-sm font-bold text-slate-700">Live Activity Feed</h2>
        </div>
        <button 
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <Trash2 size={12} />
          Clear Console
        </button>
      </div>

      <div className="flex h-[400px] flex-col overflow-y-auto px-5 py-2 scrollbar-thin scrollbar-thumb-slate-200">
        {logs.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400 italic">
            No activity recorded yet...
          </div>
        ) : (
          logs.map((log, index) => (
            <LogEntry key={`${log.timestamp}-${index}`} log={log} />
          ))
        )}
      </div>
      
      <div className="border-t bg-slate-50/30 px-5 py-2">
        <span className="text-[10px] font-medium text-slate-400 italic">
          Showing real-time events from bot instance...
        </span>
      </div>
    </div>
  );
};
