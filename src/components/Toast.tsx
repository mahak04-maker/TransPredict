import { useApp } from '@/store';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
    info: <Info className="h-5 w-5 text-accent-400" />,
  };
  const borders = {
    success: 'border-emerald-500/40',
    error: 'border-red-500/40',
    warning: 'border-yellow-500/40',
    info: 'border-accent-500/40',
  };
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex w-[360px] max-w-[calc(100vw-3rem)] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`card flex items-start gap-3 border ${borders[t.variant]} p-4 animate-slide-up`}
        >
          {icons[t.variant]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100">{t.title}</p>
            {t.message && <p className="mt-0.5 text-xs text-slate-400">{t.message}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} className="text-slate-500 hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
