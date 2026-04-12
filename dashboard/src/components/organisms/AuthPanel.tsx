import React from 'react';
import { Smartphone, ShieldCheck, QrCode } from 'lucide-react';
import { QrDisplay } from '../atoms/QrDisplay';
import { BotStatus } from '@/config/viewmodels/useDashboardViewModel';

interface AuthPanelProps {
  qrCode: string | null;
  status: BotStatus;
  onGenerateQr: () => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ qrCode, status, onGenerateQr }) => {
  const isOnline = status === 'online';

  return (
    <div className="flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden h-full">
      <div className="flex items-center gap-2.5 border-b bg-slate-50/50 px-5 py-3.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <QrCode size={14} />
        </div>
        <h2 className="text-sm font-bold text-slate-700">Authentication Context</h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
        {isOnline ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 ring-8 ring-green-500/10">
              <ShieldCheck size={40} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-slate-800">Connection Secure</h3>
              <p className="max-w-[200px] text-xs font-medium text-slate-400">
                The bot is successfully linked and actively monitoring messages.
              </p>
            </div>
          </div>
        ) : (
          <>
            {qrCode ? (
              <QrDisplay value={qrCode} />
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 ring-4 ring-slate-50">
                  <Smartphone size={32} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-bold text-slate-700">Bot is Offline</h3>
                  <p className="text-xs text-slate-400 max-w-[200px]">Click below to create a secure session key.</p>
                </div>
                <button
                  onClick={onGenerateQr}
                  disabled={status !== 'idle'}
                  className="mt-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status !== 'idle' ? 'Generating...' : 'Generate New QR'}
                </button>
              </div>
            )}
            
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">
                <div className="mt-0.5 rounded-full bg-slate-200 p-1 text-slate-500 leading-none">
                  <Smartphone size={12} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-slate-700">How to link:</span>
                  <span className="text-[10px] font-medium leading-normal text-slate-500">
                    Open WhatsApp → Settings → Linked Devices → Link a Device.
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
