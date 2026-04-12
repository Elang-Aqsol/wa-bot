import React from 'react';
import { useDashboardViewModel } from './config/viewmodels/useDashboardViewModel';
import { Header } from './components/organisms/Header';
import { LiveConsole } from './components/organisms/LiveConsole';
import { AuthPanel } from './components/organisms/AuthPanel';
import { Activity, Zap, MessageSquare, Image } from 'lucide-react';

const App: React.FC = () => {
  const { qrCode, status, logs, isConnected, logout, generateQr, clearLogs } = useDashboardViewModel();

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header 
        status={status} 
        isConnected={isConnected} 
        onLogout={logout} 
      />

      <main className="container mx-auto px-4 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Left Column: Stats & Auth */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between text-slate-400">
                  <Activity size={16} />
                </div>
                <div className="text-2xl font-bold text-slate-800">100%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Uptime</div>
              </div>
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between text-primary">
                  <Zap size={16} />
                </div>
                <div className="text-2xl font-bold text-slate-800">0.8s</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Speed</div>
              </div>
            </div>

            {/* Auth Panel */}
            <AuthPanel qrCode={qrCode} status={status} onGenerateQr={generateQr} />

            {/* Feature Status */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Features</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Image size={14} className="text-primary" />
                    <span className="text-sm font-semibold text-slate-600">Sticker Maker</span>
                  </div>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 ring-1 ring-green-600/10">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MessageSquare size={14} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-400">Auto Reply</span>
                  </div>
                  <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-400">v2.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Console */}
          <div className="lg:col-span-8">
            <LiveConsole logs={logs} onClear={clearLogs} />
          </div>

        </div>
      </main>
      
      <footer className="mt-12 border-t bg-white py-8">
        <div className="container flex flex-col items-center justify-center gap-2 text-center text-[11px] font-medium text-slate-400">
          <p>© 2026 WhatsApp Sticker Bot Dashboard — Professional Edition</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-primary transition-colors cursor-pointer">Documentation</span>
            <span>•</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
