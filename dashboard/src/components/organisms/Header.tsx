import React from 'react';
import { LogOut, Bot } from 'lucide-react';
import { StatusBadge } from '../atoms/StatusBadge';
import { BotStatus } from '@/config/viewmodels/useDashboardViewModel';

interface HeaderProps {
  status: BotStatus;
  isConnected: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, isConnected, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <Bot size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold tracking-tight text-slate-800">WA Sticker Bot</h1>
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {isConnected ? 'Dashboard Connected' : 'Dashboard Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <StatusBadge status={status} />
          <div className="h-6 w-[1px] bg-slate-100 mx-2" />
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50/50"
          >
            <LogOut size={14} />
            Logout Bot
          </button>
        </div>
      </div>
    </header>
  );
};
