import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState, triggerRealtimeSearch?: boolean) => void;
  onSearch: () => void;
  onClear: () => void;
  onOpenAddModal?: () => void;
  availableColleges: string[];
  availableLeads: string[];
  availableLocations: string[];
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onClear,
  availableColleges,
  availableLeads,
  availableLocations,
}) => {
  // Dropdown open states
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [leadDropdownOpen, setLeadDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // Tooltip / hint states for when user tries to open dropdown with < 3 characters
  const [collegeHint, setCollegeHint] = useState(false);
  const [leadHint, setLeadHint] = useState(false);
  const [locationHint, setLocationHint] = useState(false);

  const collegeRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns and hints on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (collegeRef.current && !collegeRef.current.contains(e.target as Node)) {
        setCollegeDropdownOpen(false);
        setCollegeHint(false);
      }
      if (leadRef.current && !leadRef.current.contains(e.target as Node)) {
        setLeadDropdownOpen(false);
        setLeadHint(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
        setLocationHint(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter options only when 3 or more characters are entered
  const isCollegeSearchable = filters.collegeName.trim().length >= 3;
  const isLeadSearchable = filters.leadName.trim().length >= 3;
  const isLocationSearchable = filters.location.trim().length >= 3;

  const filteredCollegeOptions = isCollegeSearchable
    ? availableColleges.filter((c) =>
        c.toLowerCase().includes(filters.collegeName.toLowerCase().trim())
      )
    : [];

  const filteredLeadOptions = isLeadSearchable
    ? availableLeads.filter((l) =>
        l.toLowerCase().includes(filters.leadName.toLowerCase().trim())
      )
    : [];

  const filteredLocationOptions = isLocationSearchable
    ? availableLocations.filter((loc) =>
        loc.toLowerCase().includes(filters.location.toLowerCase().trim())
      )
    : [];

  const hasSearchText = Boolean(
    filters.collegeName.trim() ||
    filters.leadName.trim() ||
    filters.location.trim() ||
    (filters.potential && filters.potential.trim()) ||
    (filters.status && filters.status.trim()) ||
    (filters.potentials && filters.potentials.length > 0) ||
    (filters.statuses && filters.statuses.length > 0)
  );

  // Helper function to highlight the matched characters
  const renderHighlightedText = (text: string, query: string) => {
    if (!query || query.trim().length < 3) return text;
    const trimmed = query.trim();
    const index = text.toLowerCase().indexOf(trimmed.toLowerCase());
    if (index === -1) return text;

    const before = text.substring(0, index);
    const match = text.substring(index, index + trimmed.length);
    const after = text.substring(index + trimmed.length);

    return (
      <>
        {before}
        <span className="font-bold text-[#275971] bg-amber-100/60 rounded px-0.5">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="bg-[#fefdfb] rounded-xl p-5 border border-[#ede3d4] shadow-xs transition-all">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="flex flex-wrap items-end gap-3.5 xl:gap-4"
      >
        {/* 1. College Name Filter */}
        <div className="w-full sm:w-[220px] md:w-[240px] xl:w-[260px] relative" ref={collegeRef}>
          <label
            htmlFor="college-filter"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            College Name
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="college-filter"
              type="text"
              value={filters.collegeName}
              onChange={(e) => {
                const val = e.target.value;
                const newFilters = { ...filters, collegeName: val };
                onFilterChange(newFilters, false);
                setCollegeHint(false);
                if (val.trim().length >= 3) {
                  setCollegeDropdownOpen(true);
                } else {
                  setCollegeDropdownOpen(false);
                }
              }}
              onFocus={() => {
                if (filters.collegeName.trim().length >= 3) {
                  setCollegeDropdownOpen(true);
                }
              }}
              placeholder="Search college (min 3 chars)..."
              autoComplete="off"
              className="w-full pl-9 pr-7 py-2 bg-white text-xs text-slate-800 rounded-md border border-slate-300 focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971] transition-all"
            />

            {filters.collegeName ? (
              <button
                type="button"
                onClick={() => {
                  const newFilters = { ...filters, collegeName: '' };
                  onFilterChange(newFilters, true); // Real-time search update on clear
                  setCollegeDropdownOpen(false);
                  setCollegeHint(false);
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear college input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (filters.collegeName.trim().length < 3) {
                    setCollegeHint(true);
                    setTimeout(() => setCollegeHint(false), 2500);
                  } else {
                    setCollegeDropdownOpen((prev) => !prev);
                  }
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle college suggestions"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hint popup when user clicks chevron with < 3 characters */}
          {collegeHint && (
            <div className="absolute left-0 top-full mt-1 w-full bg-slate-800 text-white text-[11px] rounded-md px-3 py-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-1">
              Type at least 3 characters to view suggestions
            </div>
          )}

          {/* Suggestion list: Only appears when 3 or more characters are entered */}
          {collegeDropdownOpen && isCollegeSearchable && (
            <div className="absolute left-0 top-full mt-1 w-full max-h-52 overflow-y-auto bg-white rounded-md shadow-lg border border-slate-200 z-40 py-1 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Matching Colleges</span>
                <span>{filteredCollegeOptions.length} found</span>
              </div>
              {filteredCollegeOptions.length > 0 ? (
                filteredCollegeOptions.map((college) => (
                  <button
                    key={college}
                    type="button"
                    onClick={() => {
                      const newFilters = { ...filters, collegeName: college };
                      onFilterChange(newFilters, true);
                      setCollegeDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#edf5f8] text-slate-700 truncate block cursor-pointer transition-colors"
                  >
                    {renderHighlightedText(college, filters.collegeName)}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2.5 text-slate-400 text-center italic text-xs">
                  No colleges matching "{filters.collegeName}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Lead Name Filter */}
        <div className="w-full sm:w-[200px] md:w-[220px] xl:w-[240px] relative" ref={leadRef}>
          <label
            htmlFor="lead-filter"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Lead Name
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="lead-filter"
              type="text"
              value={filters.leadName}
              onChange={(e) => {
                const val = e.target.value;
                const newFilters = { ...filters, leadName: val };
                onFilterChange(newFilters, false);
                setLeadHint(false);
                if (val.trim().length >= 3) {
                  setLeadDropdownOpen(true);
                } else {
                  setLeadDropdownOpen(false);
                }
              }}
              onFocus={() => {
                if (filters.leadName.trim().length >= 3) {
                  setLeadDropdownOpen(true);
                }
              }}
              placeholder="Search lead (min 3 chars)..."
              autoComplete="off"
              className="w-full pl-9 pr-7 py-2 bg-white text-xs text-slate-800 rounded-md border border-slate-300 focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971] transition-all"
            />

            {filters.leadName ? (
              <button
                type="button"
                onClick={() => {
                  const newFilters = { ...filters, leadName: '' };
                  onFilterChange(newFilters, true);
                  setLeadDropdownOpen(false);
                  setLeadHint(false);
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear lead name input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (filters.leadName.trim().length < 3) {
                    setLeadHint(true);
                    setTimeout(() => setLeadHint(false), 2500);
                  } else {
                    setLeadDropdownOpen((prev) => !prev);
                  }
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle lead suggestions"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hint popup when user clicks chevron with < 3 characters */}
          {leadHint && (
            <div className="absolute left-0 top-full mt-1 w-full bg-slate-800 text-white text-[11px] rounded-md px-3 py-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-1">
              Type at least 3 characters to view suggestions
            </div>
          )}

          {/* Suggestion list */}
          {leadDropdownOpen && isLeadSearchable && (
            <div className="absolute left-0 top-full mt-1 w-full max-h-52 overflow-y-auto bg-white rounded-md shadow-lg border border-slate-200 z-40 py-1 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Matching Leads</span>
                <span>{filteredLeadOptions.length} found</span>
              </div>
              {filteredLeadOptions.length > 0 ? (
                filteredLeadOptions.map((lead) => (
                  <button
                    key={lead}
                    type="button"
                    onClick={() => {
                      const newFilters = { ...filters, leadName: lead };
                      onFilterChange(newFilters, true);
                      setLeadDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#edf5f8] text-slate-700 truncate block cursor-pointer transition-colors"
                  >
                    {renderHighlightedText(lead, filters.leadName)}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2.5 text-slate-400 text-center italic text-xs">
                  No leads matching "{filters.leadName}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Location Filter */}
        <div className="w-full sm:w-[200px] md:w-[220px] xl:w-[240px] relative" ref={locationRef}>
          <label
            htmlFor="location-filter"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Location
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="location-filter"
              type="text"
              value={filters.location}
              onChange={(e) => {
                const val = e.target.value;
                const newFilters = { ...filters, location: val };
                onFilterChange(newFilters, false);
                setLocationHint(false);
                if (val.trim().length >= 3) {
                  setLocationDropdownOpen(true);
                } else {
                  setLocationDropdownOpen(false);
                }
              }}
              onFocus={() => {
                if (filters.location.trim().length >= 3) {
                  setLocationDropdownOpen(true);
                }
              }}
              placeholder="Search location (min 3 chars)..."
              autoComplete="off"
              className="w-full pl-9 pr-7 py-2 bg-white text-xs text-slate-800 rounded-md border border-slate-300 focus:outline-hidden focus:border-[#275971] focus:ring-1 focus:ring-[#275971] transition-all"
            />

            {filters.location ? (
              <button
                type="button"
                onClick={() => {
                  const newFilters = { ...filters, location: '' };
                  onFilterChange(newFilters, true);
                  setLocationDropdownOpen(false);
                  setLocationHint(false);
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear location input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (filters.location.trim().length < 3) {
                    setLocationHint(true);
                    setTimeout(() => setLocationHint(false), 2500);
                  } else {
                    setLocationDropdownOpen((prev) => !prev);
                  }
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle location suggestions"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Hint popup */}
          {locationHint && (
            <div className="absolute left-0 top-full mt-1 w-full bg-slate-800 text-white text-[11px] rounded-md px-3 py-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-1">
              Type at least 3 characters to view suggestions
            </div>
          )}

          {/* Suggestion list */}
          {locationDropdownOpen && isLocationSearchable && (
            <div className="absolute left-0 top-full mt-1 w-full max-h-52 overflow-y-auto bg-white rounded-md shadow-lg border border-slate-200 z-40 py-1 text-xs">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Matching Locations</span>
                <span>{filteredLocationOptions.length} found</span>
              </div>
              {filteredLocationOptions.length > 0 ? (
                filteredLocationOptions.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      const newFilters = { ...filters, location: loc };
                      onFilterChange(newFilters, true);
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#edf5f8] text-slate-700 truncate block cursor-pointer transition-colors"
                  >
                    {renderHighlightedText(loc, filters.location)}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2.5 text-slate-400 text-center italic text-xs">
                  No locations matching "{filters.location}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons & Auxiliary Clear */}
        <div className="flex items-center gap-2.5 mt-2 sm:mt-0">
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-white hover:bg-[#275971] text-[#275971] hover:text-white border border-[#275971] text-xs font-semibold rounded-lg shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-200 cursor-pointer whitespace-nowrap min-w-[92px] text-center"
          >
            <Search className="w-3.5 h-3.5 text-[#275971] group-hover:text-white transition-colors" />
            <span>Search</span>
          </button>

          {/* Clear text cleanly placed to the right with a delicate hairline separator */}
          {hasSearchText && (
            <div className="flex items-center gap-2 pl-1 animate-in fade-in duration-200">
              <span className="h-4 w-px bg-slate-300/80" aria-hidden="true" />
              <button
                type="button"
                onClick={onClear}
                className="text-xs text-slate-500 hover:text-[#275971] underline underline-offset-4 decoration-slate-300 hover:decoration-[#275971] transition-all cursor-pointer font-medium whitespace-nowrap py-1"
                title="Clear all search filters"
              >
                clear
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
