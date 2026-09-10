import React from "react";
import { AlertCircle } from "lucide-react";

interface AlertBannerProps {
  title: string;
  message: string;
  subMessage?: string;
  onRetry?: () => void;
}

export function AlertBanner({
  title,
  message,
  subMessage,
  onRetry,
}: AlertBannerProps) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-3 shadow-[2px_2px_0px_0px_rgba(244,63,94,0.3)] animate-fade-in">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
      <div className="flex-1 text-sm">
        <p className="font-bold text-rose-900">{title}</p>
        <p className="mt-0.5 text-rose-800 text-xs sm:text-sm">{message}</p>
        {subMessage && (
          <p className="mt-1.5 text-xs font-mono text-rose-700 bg-rose-100/80 p-1.5 rounded border border-rose-200">
            {subMessage}
          </p>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-rose-100 text-rose-800 border-2 border-rose-300 font-bold shadow-xs transition cursor-pointer"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
