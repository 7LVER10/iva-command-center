'use client';

import { useIvaStore } from '@/lib/iva/store';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useIvaStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle size={18} />}
          {toast.type === 'error' && <XCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
