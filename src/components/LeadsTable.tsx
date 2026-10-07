import React, { useState, useRef, useEffect } from 'react';
import { Lead } from '../types';
import { Pencil, ChevronDown, Filter, Check, X } from 'lucide-react';

interface ColumnFilterDropdownProps {
  columnTitle: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholderAll: string;
  align?: 'left' | 'right';
}

const ColumnFilterDropdown: React.FC<ColumnFilterDropdownProps> = ({
  columnTitle,
  options,
  selectedValue,
  onSelect,
  placeholderAll,
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const hasFilter = Boolean(selectedValue && selectedValue.trim().length > 0);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Column Header Button with Fixed Footprint - Never resizes table columns */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group inline-flex items-center gap-1.5 font-bold text-xs tracking-tight transition-all cursor-pointer py-1 px-1.5 rounded ${
          hasFilter
            ? 'text-[#275971] bg-[#275971]/15 ring-1 ring-[#275971]/30'
            : 'text-[#2c3e50] hover:bg-black/5 hover:text-[#183a4a]'
        }`}
        aria-expanded={isOpen}
        title={
          hasFilter
            ? `${columnTitle} (Filtered by: ${selectedValue} — click to change)`
            : `Filter by ${columnTitle}`
        }
      >
        <span>{columnTitle}</span>

        {/* Minimal indicator letting the user know a filter is applied without taking width */}
        {hasFilter ? (
          <span className="flex items-center gap-1 text-[#275971]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#275971]" />
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        ) : (
          <ChevronDown
            className={`w-3 h-3 text-slate-400 transition-transform duration-200 group-hover:text-[#275971] ${
              isOpen ? 'rotate-180 text-[#275971]' : ''
            }`}
          />
        )}
      </button>

      {/* Column Filter Dropdown Menu (Compact, slim width without bulky header) */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } top-full mt-1.5 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1 text-xs font-normal text-slate-700 animate-in fade-in slide-in-from-top-1`}
        >
          <div className="max-h-60 overflow-y-auto py-0.5 scrollbar-thin">
            {/* 1. "All" Option (Clear selection) */}
            <button
              type="button"
              onClick={() => {
                onSelect('');
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#edf5f8] transition-colors cursor-pointer text-xs ${
                !hasFilter ? 'font-bold text-[#275971] bg-[#edf5f8]/80' : 'text-slate-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    !hasFilter ? 'bg-[#275971]' : 'bg-slate-300'
                  }`}
                />
                <span className="font-medium text-xs">{placeholderAll}</span>
              </span>
              {!hasFilter && <Check className="w-3.5 h-3.5 text-[#275971] stroke-[2.5]" />}
            </button>

            {/* 2. Single selection options */}
            {options.map((option) => {
              const isSelected = selectedValue.trim().toLowerCase() === option.trim().toLowerCase();
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#edf5f8] transition-colors cursor-pointer text-xs ${
                    isSelected
                      ? 'font-bold text-[#275971] bg-[#edf5f8]/80'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#275971]' : 'bg-slate-300'
                      }`}
                    />
                    <span className="truncate text-xs">{option}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#275971] stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface LeadsTableProps {
  leads: Lead[];
  onOpenAddModal: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
  onResetLeads?: () => void;
  selectedPotential?: string;
  onSelectPotential?: (potential: string) => void;
  availablePotentials?: string[];
  selectedStatus?: string;
  onSelectStatus?: (status: string) => void;
  availableStatuses?: string[];
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onOpenAddModal,
  onEditLead,
  selectedPotential = '',
  onSelectPotential,
  availablePotentials = ['50-100', '100-250', '250-500', '500-1000', '1000+'],
  selectedStatus = '',
  onSelectStatus,
  availableStatuses = ['New', 'Contacted', 'Qualified', 'Unqualified', 'In Discussion', 'Proposal Sent', 'MOU Signed', 'Follow-up'],
  onResetLeads,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(leads.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentLeads = leads.slice(startIndex, startIndex + pageSize);

  const startDisplay = leads.length > 0 ? startIndex + 1 : 0;
  const endDisplay = Math.min(startIndex + pageSize, leads.length);

  return (
    <div className="flex flex-col gap-3">
      {/* Table Container with right scrollbar arrows styling */}
      <div className="bg-[#fefdfb] rounded-xl border border-[#ede3d4] shadow-xs overflow-hidden relative">
        <div className="overflow-x-auto max-h-[540px] overflow-y-auto relative scrollbar-thin">
          <table className="w-full border-collapse text-left text-xs">
            {/* Table Header with Warm Peach/Sand Tone */}
            <thead className="sticky top-0 z-10 bg-[#faebe1]">
              <tr className="border-b border-[#ebd8cc] text-[#2c3e50] font-semibold">
                <th scope="col" className="py-3 px-4 font-semibold text-xs tracking-tight whitespace-nowrap">
                  College Name
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-xs tracking-tight whitespace-nowrap">
                  College Location
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-xs tracking-tight whitespace-nowrap">
                  Lead Name
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-xs tracking-tight whitespace-nowrap">
                  Lead Designation
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-xs tracking-tight whitespace-nowrap">
                  Lead Number
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-xs tracking-tight whitespace-nowrap">
                  Lead Mail
                </th>
                {/* Column 7: Lead Potential with dropdown filter */}
                <th scope="col" className="py-2 px-3 font-semibold text-xs tracking-tight whitespace-nowrap">
                  <ColumnFilterDropdown
                    columnTitle="Lead Potential"
                    options={availablePotentials}
                    selectedValue={selectedPotential}
                    onSelect={(val) => onSelectPotential?.(val)}
                    placeholderAll="All Potentials"
                    align="left"
                  />
                </th>
                {/* Column 8: Lead Status with dropdown filter */}
                <th scope="col" className="py-2 px-3 font-semibold text-xs tracking-tight whitespace-nowrap">
                  <ColumnFilterDropdown
                    columnTitle="Lead Status"
                    options={availableStatuses}
                    selectedValue={selectedStatus}
                    onSelect={(val) => onSelectStatus?.(val)}
                    placeholderAll="All Statuses"
                    align="right"
                  />
                </th>
                <th scope="col" className="py-3 px-4 font-semibold text-xs tracking-tight whitespace-nowrap text-center">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#f2e9dc]/70">
              {leads.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={9} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="text-slate-400">
                        <svg
                          className="w-11 h-11 text-slate-400"
                          viewBox="0 0 48 48"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 18L18.5 9H29.5L34 18" />
                          <rect x="9" y="18" width="30" height="20" rx="3" />
                          <path d="M9 26H18C19 26 20 27 20 28V28.5C20 29.8 21.2 31 22.5 31H25.5C26.8 31 28 29.8 28 28.5V28C28 27 29 26 30 26H39" />
                        </svg>
                      </div>

                      <p className="text-slate-600 text-[13px] font-normal tracking-tight">
                        No leads matching current filters.{' '}
                        {(selectedPotential || selectedStatus) ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectPotential?.('');
                                onSelectStatus?.('');
                              }}
                              className="font-semibold text-[#275971] hover:underline cursor-pointer mr-1"
                            >
                              Clear column filters
                            </button>
                            or click{' '}
                          </>
                        ) : (
                          'Click '
                        )}
                        <button
                          type="button"
                          onClick={onOpenAddModal}
                          className="font-semibold text-[#275971] hover:underline cursor-pointer"
                        >
                          + ADD
                        </button>{' '}
                        to add a new lead
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Populated Leads List matching screenshot rows
                currentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-[#fbf7ee] transition-colors text-slate-800 text-xs"
                  >
                    {/* College Name */}
                    <td className="py-3 px-4 whitespace-nowrap font-normal">
                      {lead.collegeName}
                    </td>

                    {/* College Location */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      {lead.collegeLocation}
                    </td>

                    {/* Lead Name */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-800">
                      {lead.leadName}
                    </td>

                    {/* Lead Designation */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      {lead.leadDesignation}
                    </td>

                    {/* Lead Number */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-800 font-mono text-[11px]">
                      {lead.leadNumber}
                    </td>

                    {/* Lead Mail */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      {lead.leadMail}
                    </td>

                    {/* Lead Potential */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-800">
                      <span className="inline-block py-0.5 px-1.5 rounded bg-slate-100 font-medium text-[11px] text-slate-700">
                        {lead.leadPotential}
                      </span>
                    </td>

                    {/* Lead Status */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-800">
                      <span className="inline-block py-0.5 px-2 rounded-full font-medium text-[11px] bg-[#edf5f8] text-[#204e63]">
                        {lead.leadStatus}
                      </span>
                    </td>

                    {/* Action (Teal pencil icon matching screenshot) */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onEditLead(lead)}
                        className="inline-flex items-center justify-center text-[#275971] hover:text-[#183a4a] hover:bg-slate-100 p-1.5 rounded transition-colors cursor-pointer"
                        title={`Edit ${lead.leadName}`}
                        aria-label={`Edit ${lead.leadName}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Scroll indicator arrows on far right edge like in the image */}
        <div className="absolute top-2 right-1.5 flex flex-col items-center gap-1 pointer-events-none text-slate-400 text-[10px]">
          <span>▲</span>
        </div>
        <div className="absolute bottom-2 right-1.5 flex flex-col items-center gap-1 pointer-events-none text-slate-400 text-[10px]">
          <span>▼</span>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-1 py-1 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Showing {startDisplay} - {endDisplay} of {leads.length} leads</span>
          {leads.length > 0 && onResetLeads && (
            <>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={onResetLeads}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors cursor-pointer"
                title="Reset leads to empty state"
              >
                Reset table
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
          >
            Previous
          </button>

          <span className="text-xs text-slate-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
