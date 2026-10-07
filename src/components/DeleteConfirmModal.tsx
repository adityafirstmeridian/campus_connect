import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Lead } from '../types';

interface DeleteConfirmModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (leadId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  lead,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !lead) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Delete Lead Confirmation
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-slate-800">{lead.leadName}</span> from{' '}
              <span className="font-semibold text-slate-800">{lead.collegeName}</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(lead.id);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
          >
            Delete Lead
          </button>
        </div>
      </div>
    </div>
  );
};
