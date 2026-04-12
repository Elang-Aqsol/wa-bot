import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface LogEntry {
  timestamp: string;
  type: 'info' | 'warn' | 'error' | 'success'; 
  message: string;
}

export type BotStatus = 'idle' | 'waiting_for_scan' | 'online' | 'error';

export interface DashboardViewModel {
  qrCode: string | null;
  status: BotStatus;
  logs: LogEntry[];
  isConnected: boolean;
  logout: () => Promise<void>;
  generateQr: () => Promise<void>;
  clearLogs: () => void;
}

/**
 * useDashboardViewModel
 * Following the AMS Pattern for state and logic management
 */
export function useDashboardViewModel(): DashboardViewModel {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<BotStatus>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket: Socket = io();

    socket.on('connect', () => {
      setIsConnected(true);
      addLog({ type: 'info', message: 'Connected to Bot Dashboard stream' });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      addLog({ type: 'warn', message: 'Disconnected from Bot stream' });
    });

    socket.on('qr_update', (qr: string) => {
      setQrCode(qr);
      setStatus('waiting_for_scan');
      addLog({ type: 'info', message: 'New QR code received' });
    });

    socket.on('status_update', (newStatus: BotStatus) => {
      setStatus(newStatus);
    });

    socket.on('log_update', (log: LogEntry) => {
      addLog(log);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addLog = useCallback((log: Partial<LogEntry>) => {
    setLogs((prev) => [
      {
        timestamp: new Date().toISOString(),
        type: log.type || 'info',
        message: log.message || '',
      },
      ...prev,
    ].slice(0, 50)); // Keep last 50 logs
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        setQrCode(null);
        setStatus('idle');
        addLog({ type: 'success', message: 'Logout successful' });
      }
    } catch (error) {
      addLog({ type: 'error', message: 'Failed to logout' });
    }
  };

  const generateQr = async () => {
    try {
      addLog({ type: 'info', message: 'Requesting QR code generation...' });
      await fetch('/api/auth/generate-qr', { method: 'POST' });
    } catch (error) {
      addLog({ type: 'error', message: 'Failed to request QR generation' });
    }
  };

  const clearLogs = () => setLogs([]);

  return {
    qrCode,
    status,
    logs,
    isConnected,
    logout,
    generateQr,
    clearLogs,
  };
}
