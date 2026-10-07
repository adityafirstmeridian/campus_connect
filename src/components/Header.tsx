import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, User, LogOut, Settings, HelpCircle, Building2 } from 'lucide-react';

interface HeaderProps {
  currentOrg: string;
  onOrgChange: (org: string) => void;
  userEmail?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentOrg,
  onOrgChange,
  userEmail = 'aditya.firstmeridian@gmail.com',
}) => {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const orgRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const orgs = ['DIGIONE', 'FIRSTMERIDIAN', 'TECHSPHERE', 'CAMPUS_HIRE'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orgRef.current && !orgRef.current.contains(event.target as Node)) {
        setOrgDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-[#275971] text-white px-5 flex items-center justify-between border-b border-[#214c60] select-none z-30 relative shadow-sm">
      {/* Brand logo & name */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center">
          {/* Jobcheck Custom Brand Logo Icon */}
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 15.5L10 20.5L18 8.5"
              stroke="white"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15.5L17 20.5L25 8.5"
              stroke="white"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>
        </div>
        <span className="text-[19px] font-semibold tracking-tight text-white font-sans">
          Jobcheck
        </span>
      </div>

      {/* Right controls: Organization Selector & Profile Avatar */}
      <div className="flex items-center gap-4">
        {/* Org Selector */}
        <div className="relative" ref={orgRef}>
          <button
            type="button"
            onClick={() => setOrgDropdownOpen((prev) => !prev)}
            className="flex items-center justify-between gap-3 bg-white text-[#20495d] px-3.5 py-1 rounded text-xs font-semibold tracking-wide shadow-xs border border-white/90 hover:bg-slate-50 transition-colors cursor-pointer w-28 sm:w-32"
            aria-label="Select organization"
            aria-expanded={orgDropdownOpen}
          >
            <span className="truncate">{currentOrg}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${orgDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {orgDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white text-slate-800 rounded-md shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                Select Tenant
              </div>
              {orgs.map((org) => (
                <button
                  key={org}
                  type="button"
                  onClick={() => {
                    onOrgChange(org);
                    setOrgDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                    currentOrg === org ? 'font-semibold text-[#275971] bg-slate-50' : 'text-slate-700'
                  }`}
                >
                  <span>{org}</span>
                  {currentOrg === org && <Check className="w-3.5 h-3.5 text-[#275971]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Avatar with online status badge */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="relative flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-emerald-500/80 bg-slate-800 hover:ring-white transition-all cursor-pointer focus:outline-hidden"
            aria-label="User Profile"
          >
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
              <svg className="w-full h-full text-slate-300" viewBox="0 0 32 32" fill="currentColor">
                <rect width="32" height="32" fill="#1e293b" />
                <path d="M16 16a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" fill="#cbd5e1" />
              </svg>
            </div>
            {/* Online Green Indicator Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#275971] rounded-full" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Aditya</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Campus Recruitment Lead
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 text-left"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  My Account
                </button>
                <button
                  type="button"
                  className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Portal Settings
                </button>
                <button
                  type="button"
                  className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Support & Help
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  className="w-full px-3.5 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
