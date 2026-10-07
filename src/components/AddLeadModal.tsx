import React, { useState, useEffect } from 'react';
import { X, Building, MapPin, User, Briefcase, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import { Lead, LeadPotential, LeadStatus } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leadData: Omit<Lead, 'id' | 'createdAt'>, leadId?: string) => void;
  editingLead?: Lead | null;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLead,
}) => {
  const [collegeName, setCollegeName] = useState('');
  const [collegeLocation, setCollegeLocation] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadDesignation, setLeadDesignation] = useState('');
  const [leadNumber, setLeadNumber] = useState('');
  const [leadMail, setLeadMail] = useState('');
  const [leadPotential, setLeadPotential] = useState<LeadPotential>('High');
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('In Discussion');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingLead) {
      setCollegeName(editingLead.collegeName);
      setCollegeLocation(editingLead.collegeLocation);
      setLeadName(editingLead.leadName);
      setLeadDesignation(editingLead.leadDesignation);
      setLeadNumber(editingLead.leadNumber);
      setLeadMail(editingLead.leadMail);
      setLeadPotential(editingLead.leadPotential);
      setLeadStatus(editingLead.leadStatus);
      setNotes(editingLead.notes || '');
    } else {
      setCollegeName('');
      setCollegeLocation('');
      setLeadName('');
      setLeadDesignation('');
      setLeadNumber('');
      setLeadMail('');
      setLeadPotential('High');
      setLeadStatus('In Discussion');
      setNotes('');
    }
    setErrors({});
  }, [editingLead, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!collegeName.trim()) newErrors.collegeName = 'College Name is required';
    if (!collegeLocation.trim()) newErrors.collegeLocation = 'College Location is required';
    if (!leadName.trim()) newErrors.leadName = 'Lead Name is required';
    if (!leadDesignation.trim()) newErrors.leadDesignation = 'Lead Designation is required';
    if (!leadNumber.trim()) newErrors.leadNumber = 'Contact Number is required';
    if (!leadMail.trim()) {
      newErrors.leadMail = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadMail.trim())) {
      newErrors.leadMail = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        collegeName: collegeName.trim(),
        collegeLocation: collegeLocation.trim(),
        leadName: leadName.trim(),
        leadDesignation: leadDesignation.trim(),
        leadNumber: leadNumber.trim(),
        leadMail: leadMail.trim(),
        leadPotential,
        leadStatus,
        notes: notes.trim(),
      },
      editingLead ? editingLead.id : undefined
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden text-slate-800 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#275971] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 id="modal-headline" className="text-base font-semibold">
              {editingLead ? 'Edit Campus Lead' : '+ Add Campus Recruitment Lead'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-md transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: College Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-college-name"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5 text-[#275971]" />
                College / Institution Name *
              </label>
              <input
                id="input-college-name"
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Indian Institute of Technology, Delhi"
                className={`w-full px-3 py-2 text-xs rounded-md border ${
                  errors.collegeName ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                } focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]`}
              />
              {errors.collegeName && <p className="text-[11px] text-red-600 mt-1">{errors.collegeName}</p>}
            </div>

            <div>
              <label
                htmlFor="input-college-location"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#275971]" />
                College Location (City, State) *
              </label>
              <input
                id="input-college-location"
                type="text"
                value={collegeLocation}
                onChange={(e) => setCollegeLocation(e.target.value)}
                placeholder="e.g. Hauz Khas, New Delhi"
                className={`w-full px-3 py-2 text-xs rounded-md border ${
                  errors.collegeLocation ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                } focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]`}
              />
              {errors.collegeLocation && (
                <p className="text-[11px] text-red-600 mt-1">{errors.collegeLocation}</p>
              )}
            </div>
          </div>

          {/* Row 2: Lead Name & Designation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-lead-name"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#275971]" />
                Lead / Contact Person Name *
              </label>
              <input
                id="input-lead-name"
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g. Prof. Rajesh Kumar"
                className={`w-full px-3 py-2 text-xs rounded-md border ${
                  errors.leadName ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                } focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]`}
              />
              {errors.leadName && <p className="text-[11px] text-red-600 mt-1">{errors.leadName}</p>}
            </div>

            <div>
              <label
                htmlFor="input-lead-designation"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#275971]" />
                Lead Designation *
              </label>
              <input
                id="input-lead-designation"
                type="text"
                value={leadDesignation}
                onChange={(e) => setLeadDesignation(e.target.value)}
                placeholder="e.g. Head of Training & Placement"
                className={`w-full px-3 py-2 text-xs rounded-md border ${
                  errors.leadDesignation ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                } focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]`}
              />
              {errors.leadDesignation && (
                <p className="text-[11px] text-red-600 mt-1">{errors.leadDesignation}</p>
              )}
            </div>
          </div>

          {/* Row 3: Lead Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="input-lead-number"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#275971]" />
                Lead Contact Number *
              </label>
              <input
                id="input-lead-number"
                type="text"
                value={leadNumber}
                onChange={(e) => setLeadNumber(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={`w-full px-3 py-2 text-xs font-mono rounded-md border ${
                  errors.leadNumber ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                } focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]`}
              />
              {errors.leadNumber && <p className="text-[11px] text-red-600 mt-1">{errors.leadNumber}</p>}
            </div>

            <div>
              <label
                htmlFor="input-lead-mail"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#275971]" />
                Lead Email Address *
              </label>
              <input
                id="input-lead-mail"
                type="email"
                value={leadMail}
                onChange={(e) => setLeadMail(e.target.value)}
                placeholder="e.g. placements@iitd.ac.in"
                className={`w-full px-3 py-2 text-xs rounded-md border ${
                  errors.leadMail ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
                } focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]`}
              />
              {errors.leadMail && <p className="text-[11px] text-red-600 mt-1">{errors.leadMail}</p>}
            </div>
          </div>

          {/* Row 4: Potential & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="select-lead-potential"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-[#275971]" />
                Lead Potential
              </label>
              <select
                id="select-lead-potential"
                value={leadPotential}
                onChange={(e) => setLeadPotential(e.target.value as LeadPotential)}
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]"
              >
                <option value="50-100">50-100</option>
                <option value="100-250">100-250</option>
                <option value="250-500">250-500</option>
                <option value="500-1000">500-1000</option>
                <option value="1000+">1000+</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="select-lead-status"
                className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#275971]" />
                Lead Status
              </label>
              <select
                id="select-lead-status"
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Unqualified">Unqualified</option>
                <option value="In Discussion">In Discussion</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="MOU Signed">MOU Signed</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 5: Notes / Comments */}
          <div>
            <label
              htmlFor="textarea-notes"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Recruitment Context & Notes (Optional)
            </label>
            <textarea
              id="textarea-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Expected hiring batch size 800+, tier-1 preference, MoU discussions started..."
              className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971]"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#275971] hover:bg-[#1f4a5f] rounded-md transition-colors cursor-pointer"
            >
              {editingLead ? 'Save Changes' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
