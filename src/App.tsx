import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavItem } from './components/Sidebar';
import { FiltersBar } from './components/FiltersBar';
import { LeadsTable } from './components/LeadsTable';
import { AddLeadModal } from './components/AddLeadModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Lead, FilterState } from './types';
import { SAMPLE_LEADS } from './data/initialLeads';
import { Sparkles, Plus } from 'lucide-react';

const STORAGE_KEY = 'jobcheck_campus_connect_leads_v2';

export default function App() {
  // State for leads list (defaults to the exact screenshot data requested by user)
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return SAMPLE_LEADS;
  });

  // Current Organization
  const [currentOrg, setCurrentOrg] = useState<string>('DIGIONE');

  // Navigation Item
  const [activeNav, setActiveNav] = useState<NavItem>('campus');

  // Filter inputs (live)
  const [filters, setFilters] = useState<FilterState>({
    collegeName: '',
    leadName: '',
    location: '',
    potentials: [],
    statuses: [],
    potential: '',
    status: '',
  });

  // Applied filters (after clicking "Search")
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    collegeName: '',
    leadName: '',
    location: '',
    potentials: [],
    statuses: [],
    potential: '',
    status: '',
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  // Sync leads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch {
      // Ignore storage errors
    }
  }, [leads]);

  // Available unique lists for dropdown hints
  const availableColleges = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => l.collegeName && set.add(l.collegeName));
    SAMPLE_LEADS.forEach((l) => set.add(l.collegeName));
    return Array.from(set);
  }, [leads]);

  const availableLeads = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => l.leadName && set.add(l.leadName));
    SAMPLE_LEADS.forEach((l) => set.add(l.leadName));
    return Array.from(set);
  }, [leads]);

  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => l.collegeLocation && set.add(l.collegeLocation));
    SAMPLE_LEADS.forEach((l) => set.add(l.collegeLocation));
    return Array.from(set);
  }, [leads]);

  const availablePotentials = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => l.leadPotential && set.add(l.leadPotential));
    SAMPLE_LEADS.forEach((l) => set.add(l.leadPotential));
    return Array.from(set);
  }, [leads]);

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => l.leadStatus && set.add(l.leadStatus));
    SAMPLE_LEADS.forEach((l) => set.add(l.leadStatus));
    return Array.from(set);
  }, [leads]);

  // Filtered Leads: Inclusive OR search across active text queries + Multi-select filtering by Potential & Status
  const filteredLeads = useMemo(() => {
    const queryCollege = appliedFilters.collegeName.trim().toLowerCase();
    const queryLead = appliedFilters.leadName.trim().toLowerCase();
    const queryLocation = appliedFilters.location.trim().toLowerCase();

    const selectedPotentials =
      appliedFilters.potentials && appliedFilters.potentials.length > 0
        ? appliedFilters.potentials
        : appliedFilters.potential
        ? [appliedFilters.potential]
        : [];

    const selectedStatuses =
      appliedFilters.statuses && appliedFilters.statuses.length > 0
        ? appliedFilters.statuses
        : appliedFilters.status
        ? [appliedFilters.status]
        : [];

    const hasCollegeQuery = queryCollege.length > 0;
    const hasLeadQuery = queryLead.length > 0;
    const hasLocationQuery = queryLocation.length > 0;
    const hasTextQuery = hasCollegeQuery || hasLeadQuery || hasLocationQuery;
    const hasPotentialQuery = selectedPotentials.length > 0;
    const hasStatusQuery = selectedStatuses.length > 0;

    // If no search fields or filters are active, show all leads
    if (!hasTextQuery && !hasPotentialQuery && !hasStatusQuery) {
      return leads;
    }

    return leads.filter((lead) => {
      // 1. Text query matching (OR union across active text fields)
      const matchText =
        !hasTextQuery ||
        (hasCollegeQuery && lead.collegeName.toLowerCase().includes(queryCollege)) ||
        (hasLeadQuery && lead.leadName.toLowerCase().includes(queryLead)) ||
        (hasLocationQuery && lead.collegeLocation.toLowerCase().includes(queryLocation));

      // 2. Multi-select matching: Lead Potential (lead matches if in selected array)
      const matchPotential =
        !hasPotentialQuery || selectedPotentials.includes(lead.leadPotential);

      // 3. Multi-select matching: Lead Status (lead matches if in selected array)
      const matchStatus =
        !hasStatusQuery || selectedStatuses.includes(lead.leadStatus);

      return matchText && matchPotential && matchStatus;
    });
  }, [leads, appliedFilters]);

  // Search handler
  const handleSearch = () => {
    setAppliedFilters({ ...filters });
  };

  // Filter change handler with real-time search trigger on selection or clear
  const handleFilterChange = (newFilters: FilterState, triggerRealtimeSearch = false) => {
    setFilters(newFilters);
    if (triggerRealtimeSearch) {
      setAppliedFilters(newFilters);
    }
  };

  // Clear handler
  const handleClear = () => {
    const resetState: FilterState = {
      collegeName: '',
      leadName: '',
      location: '',
      potentials: [],
      statuses: [],
      potential: '',
      status: '',
    };
    setFilters(resetState);
    setAppliedFilters(resetState);
  };

  // Column filter single selection handler: Lead Potential
  const handleSelectPotential = (potential: string) => {
    const updated: FilterState = {
      ...filters,
      potential: potential,
      potentials: potential ? [potential] : [],
    };
    setFilters(updated);
    setAppliedFilters(updated);
  };

  // Column filter single selection handler: Lead Status
  const handleSelectStatus = (status: string) => {
    const updated: FilterState = {
      ...filters,
      status: status,
      statuses: status ? [status] : [],
    };
    setFilters(updated);
    setAppliedFilters(updated);
  };

  // Save (Create or Update) Lead
  const handleSaveLead = (leadData: Omit<Lead, 'id' | 'createdAt'>, leadId?: string) => {
    if (leadId) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, ...leadData } : l))
      );
    } else {
      const newLead: Lead = {
        ...leadData,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLeads((prev) => [newLead, ...prev]);
    }
  };

  // Delete lead handler
  const handleDeleteConfirm = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  // Toggle demo sample leads for quick evaluation
  const handleLoadSampleData = () => {
    setLeads(SAMPLE_LEADS);
  };

  const handleClearAllLeads = () => {
    setLeads([]);
    handleClear();
  };

  return (
    <div className="min-h-screen bg-[#faf5ea] flex flex-col text-slate-800">
      {/* 1. Header (Navbar) */}
      <Header
        currentOrg={currentOrg}
        onOrgChange={setCurrentOrg}
      />

      {/* 2. Main Layout: Left Sidebar + Center Content Area */}
      <div className="flex flex-1">
        {/* Slim Icon Navigation Sidebar */}
        <Sidebar
          activeItem={activeNav}
          onSelectItem={(item) => setActiveNav(item)}
          onLogout={() => {
            // Optional sign out toast or action
          }}
        />

        {/* Content Viewport */}
        <main className="flex-1 px-6 py-6 md:px-8 md:py-7 max-w-[1700px] mx-auto w-full flex flex-col gap-5">
          {/* Page Title & Utility Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl md:text-[26px] font-semibold text-[#25323a] tracking-tight">
              Campus Connect
            </h1>

            {/* Action Buttons & Utilities */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingLead(null);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide text-white bg-[#275971] hover:bg-[#1d4558] rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
                title="Add new campus recruitment lead"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ ADD LEAD</span>
              </button>

              {leads.length === 0 && (
                <button
                  type="button"
                  onClick={handleLoadSampleData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#275971] bg-[#e6eff4] hover:bg-[#d6e6ee] rounded-md transition-colors cursor-pointer"
                  title="Populate table with sample university leads"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#275971]" />
                  Load Sample Leads
                </button>
              )}
            </div>
          </div>

          {/* Filters & Actions Bar */}
          <FiltersBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onClear={handleClear}
            onOpenAddModal={() => {
              setEditingLead(null);
              setIsAddModalOpen(true);
            }}
            availableColleges={availableColleges}
            availableLeads={availableLeads}
            availableLocations={availableLocations}
          />

          {/* Campus Connect Leads Table */}
          <LeadsTable
            leads={filteredLeads}
            onOpenAddModal={() => {
              setEditingLead(null);
              setIsAddModalOpen(true);
            }}
            onEditLead={(lead) => {
              setEditingLead(lead);
              setIsAddModalOpen(true);
            }}
            onDeleteLead={(lead) => {
              setDeletingLead(lead);
            }}
            onResetLeads={handleClearAllLeads}
            selectedPotential={appliedFilters.potential || ''}
            onSelectPotential={handleSelectPotential}
            availablePotentials={availablePotentials}
            selectedStatus={appliedFilters.status || ''}
            onSelectStatus={handleSelectStatus}
            availableStatuses={availableStatuses}
          />
        </main>
      </div>

      {/* Add / Edit Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        editingLead={editingLead}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingLead}
        lead={deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
