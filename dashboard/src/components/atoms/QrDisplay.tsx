import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrDisplayProps {
  value: string | null;
}

export const QrDisplay: React.FC<QrDisplayProps> = ({ value }) => {
  if (!value) {
    return (
      <div className="flex aspect-square w-full max-w-[280px] items-center justify-center rounded-xl border-2 border-dashed border-muted bg-slate-50 p-8 text-center text-sm text-muted-foreground">
        Waiting for QR Code generation...
      </div>
    );
  }

  return (
    <div className="flex aspect-square w-full max-w-[280px] items-center justify-center rounded-xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
      <QRCodeSVG 
        value={value} 
        size={256} 
        level="H"
        includeMargin={false}
      />
    </div>
  );
};
