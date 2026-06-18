'use client';

import { useIvaStore } from '@/lib/iva/store';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog() {
  const { showConfirmDialog, confirmDialogData, hideConfirmDialog } = useIvaStore();

  if (!showConfirmDialog || !confirmDialogData) return null;

  return (
    <div className="modal-overlay" onClick={hideConfirmDialog}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <AlertTriangle size={32} />
        </div>
        <h3>{confirmDialogData.title}</h3>
        <p>{confirmDialogData.message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={hideConfirmDialog}>
            Cancel
          </button>
          <button
            className="confirm-ok"
            onClick={() => {
              confirmDialogData.onConfirm();
              hideConfirmDialog();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
