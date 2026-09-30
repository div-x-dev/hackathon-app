import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Logo } from '../brand/Logo';
import { CITIZEN_PROFILES, INITIAL_WORKERS, MUNICIPAL_AREAS } from '../../data/mockData';
import { LANGUAGE_OPTIONS, LanguageCode } from '../../utils/translations';
import {
  ShieldCheck,
  User,
  HardHat,
  Shield,
  ArrowRight,
  Phone,
  Lock,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Globe,
  Loader2,
  Check,
  ChevronDown,
} from 'lucide-react';

export const RoleAuthScreen: React.FC = () => {
  const {
    login,
    theme,
    toggleTheme,
    language,
    setLanguage,
    t,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Citizen Form State
  const [citizenMode, setCitizenMode] = useState<'signin' | 'register'>('signin');
  const [citizenPhone, setCitizenPhone] = useState('+91 98765 43210');
  const [citizenOtp, setCitizenOtp] = useState('4829');
  const [citizenName, setCitizenName] = useState('Aarav Sharma');
  const [citizenWard, setCitizenWard] = useState('College Road');
  const [citizenAddress, setCitizenAddress] = useState('Flat 402, Green Meadows');
  const [citizenError, setCitizenError] = useState<string | null>(null);

  // Worker Form State
  const [workerId, setWorkerId] = useState('w-1');
  const [workerPin, setWorkerPin] = useState('4321');
  const [workerError, setWorkerError] = useState<string | null>(null);

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('officer.verma@binsync.gov.in');
  const [adminPasscode, setAdminPasscode] = useState('admin2026');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Citizen Submit Handler
  const handleCitizenSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCitizenError(null);

    if (citizenMode === 'signin') {
      if (!citizenPhone.trim()) {
        setCitizenError('Please enter a valid mobile number.');
        return;
      }
      if (!citizenOtp.trim()) {
        setCitizenError('Please enter the 4-digit verification code.');
        return;
      }
    } else {
      if (!citizenName.trim()) {
        setCitizenError('Please enter your full name.');
        return;
      }
      if (!citizenPhone.trim()) {
        setCitizenError('Please enter your mobile number.');
        return;
      }
    }

    setIsLoading(true);
    setLoadingMessage('Authenticating citizen profile & ward permissions...');

    setTimeout(() => {
      const userProfile = {
        id: citizenMode === 'signin' ? 'u-aarav' : `u-${Date.now()}`,
        name: citizenMode === 'signin' ? 'Aarav Sharma' : citizenName,
        phone: citizenPhone,
        address: citizenMode === 'signin' ? 'Flat 402, Green Meadows, College Road' : `${citizenAddress}, ${citizenWard}`,
        area: citizenMode === 'signin' ? 'College Road' : citizenWard,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        joinedDate: 'Jan 2026',
      };

      setIsLoading(false);
      login('citizen', userProfile);
    }, 600);
  };

  // Worker Submit Handler
  const handleWorkerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setWorkerError(null);

    if (!workerId) {
      setWorkerError('Please select your worker badge ID.');
      return;
    }
    if (!workerPin || workerPin.length < 4) {
      setWorkerError('Please enter your 4-digit security PIN.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Verifying municipal field crew badge & duty zone...');

    setTimeout(() => {
      setIsLoading(false);
      login('worker');
    }, 600);
  };

  // Admin Submit Handler
  const handleAdminSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAdminError(null);

    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setAdminError('Please enter an authorized municipal email.');
      return;
    }
    if (!adminPasscode.trim()) {
      setAdminError('Please enter your department security passcode.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Authorizing administrative security clearance...');

    setTimeout(() => {
      setIsLoading(false);
      login('admin');
    }, 600);
  };

  // Quick 1-click Demo shortcuts
  const handleQuickDemoCitizen = () => {
    setCitizenMode('signin');
    setCitizenPhone('+91 98765 43210');
    setCitizenOtp('4829');
    handleCitizenSubmit();
  };

  const handleQuickDemoWorker = () => {
    setWorkerId('w-1');
    setWorkerPin('4321');
    handleWorkerSubmit();
  };

  const handleQuickDemoAdmin = () => {
    setAdminEmail('officer.verma@binsync.gov.in');
    setAdminPasscode('admin2026');
    handleAdminSubmit();
  };

  return (
    <div className="min-h-screen bg-[#F7F7F1] dark:bg-[#10160D] text-[#14200C] dark:text-[#F2F6ED] flex flex-col transition-colors duration-200">
      {/* Top Utility Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#EEF0E4] dark:bg-[#202D1A] border border-[#14200C]/10 dark:border-[#DAE3B7]/15 text-[#4A5F29] dark:text-[#DAE3B7]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4A5F29] dark:bg-[#DAE3B7] animate-pulse" />
            Civic Municipal Portal
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-[#182214] border border-[#14200C]/15 dark:border-[#DAE3B7]/20 text-[#14200C] dark:text-[#F2F6ED] hover:border-[#4A5F29] transition-smooth shadow-xs"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#4A5F29] dark:text-[#DAE3B7]" />
              <span className="capitalize">{language}</span>
              <ChevronDown className="w-3 h-3 text-[#969691]" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 max-h-72 overflow-y-auto rounded-xl bg-white dark:bg-[#182214] border border-[#14200C]/15 dark:border-[#DAE3B7]/20 shadow-xl py-2 z-50">
                <div className="px-3 py-1 text-[11px] font-bold text-[#969691] uppercase tracking-wider border-b border-[#14200C]/08 dark:border-[#DAE3B7]/10">
                  Select Language
                </div>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      setLanguage(opt.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-[#EEF0E4] dark:hover:bg-[#202D1A] transition-colors ${
                      language === opt.code
                        ? 'font-bold text-[#4A5F29] dark:text-[#DAE3B7] bg-[#EEF0E4]/60 dark:bg-[#202D1A]/60'
                        : 'text-[#14200C] dark:text-[#F2F6ED]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[11px] text-[#969691] font-normal">{opt.nativeLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#182214] border border-[#14200C]/15 dark:border-[#DAE3B7]/20 text-[#14200C] dark:text-[#F2F6ED] hover:border-[#4A5F29] transition-smooth shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#DAE3B7]" />
            ) : (
              <Moon className="w-4 h-4 text-[#4A5F29]" />
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Flow Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          
          {/* ================================================== */}
          {/* 1. LOGO & BRANDING (Exact uploaded BinSync logo) */}
          {/* ================================================== */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="transition-transform duration-300 hover:scale-105">
              <Logo size="hero" showText={false} className="drop-shadow-sm" />
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#14200C] dark:text-[#F2F6ED]">
              BINSYNC
            </h1>

            <p className="mt-1.5 text-sm sm:text-base text-[#14200C]/75 dark:text-[#DAE3B7]/80 max-w-xs sm:max-w-sm">
              Smarter waste management. Cleaner communities.
            </p>
          </div>

          {/* ================================================== */}
          {/* 2. THREE PILL-SHAPED ROLE BUTTONS */}
          {/* ================================================== */}
          <div className="w-full max-w-md bg-[#EEF0E4]/90 dark:bg-[#202D1A] p-1.5 rounded-full border border-[#14200C]/15 dark:border-[#DAE3B7]/20 shadow-xs mb-8">
            <div className="grid grid-cols-3 gap-1.5">
              {/* Citizen Pill */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('citizen');
                  setCitizenError(null);
                }}
                className={`py-2.5 px-3 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-1.5 select-none active:scale-[0.98] ${
                  selectedRole === 'citizen'
                    ? 'bg-[#4A5F29] text-white shadow-md shadow-[#4A5F29]/25 scale-[1.01]'
                    : 'text-[#14200C] dark:text-[#F2F6ED]/85 hover:text-[#14200C] dark:hover:text-white hover:-translate-y-0.5 hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>CITIZEN</span>
              </button>

              {/* Worker Pill */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('worker');
                  setWorkerError(null);
                }}
                className={`py-2.5 px-3 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-1.5 select-none active:scale-[0.98] ${
                  selectedRole === 'worker'
                    ? 'bg-[#4A5F29] text-white shadow-md shadow-[#4A5F29]/25 scale-[1.01]'
                    : 'text-[#14200C] dark:text-[#F2F6ED]/85 hover:text-[#14200C] dark:hover:text-white hover:-translate-y-0.5 hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>WORKER</span>
              </button>

              {/* Admin Pill */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setAdminError(null);
                }}
                className={`py-2.5 px-3 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-1.5 select-none active:scale-[0.98] ${
                  selectedRole === 'admin'
                    ? 'bg-[#4A5F29] text-white shadow-md shadow-[#4A5F29]/25 scale-[1.01]'
                    : 'text-[#14200C] dark:text-[#F2F6ED]/85 hover:text-[#14200C] dark:hover:text-white hover:-translate-y-0.5 hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>ADMIN</span>
              </button>
            </div>
          </div>

          {/* ================================================== */}
          {/* 3. SMOOTH ROLE-SPECIFIC FORM CONTAINER */}
          {/* ================================================== */}
          <div className="w-full bg-white dark:bg-[#182214] rounded-3xl border border-[#14200C]/12 dark:border-[#DAE3B7]/15 p-6 sm:p-8 shadow-lg shadow-[#14200C]/05 transition-all duration-300">
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-[#EEF0E4] dark:bg-[#202D1A] flex items-center justify-center text-[#4A5F29] dark:text-[#DAE3B7]">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#14200C] dark:text-[#F2F6ED]">
                    Authenticating
                  </h3>
                  <p className="text-xs text-[#969691] dark:text-[#DAE3B7]/70 max-w-xs">
                    {loadingMessage}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && (
              <>
                {/* ------------------------------------------------ */}
                {/* ROLE 1: CITIZEN FORM */}
                {/* ------------------------------------------------ */}
                {selectedRole === 'citizen' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-[#14200C]/08 dark:border-[#DAE3B7]/10">
                      <div>
                        <h2 className="text-lg font-bold text-[#14200C] dark:text-[#F2F6ED] flex items-center gap-2">
                          <span>Citizen Portal</span>
                        </h2>
                        <p className="text-xs text-[#969691] dark:text-[#DAE3B7]/70 mt-0.5">
                          Report waste & schedule doorstep collections
                        </p>
                      </div>

                      {/* Sign in / Register Switcher */}
                      <div className="flex rounded-lg bg-[#EEF0E4] dark:bg-[#202D1A] p-0.5 border border-[#14200C]/10 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setCitizenMode('signin')}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            citizenMode === 'signin'
                              ? 'bg-white dark:bg-[#182214] text-[#14200C] dark:text-[#F2F6ED] shadow-xs'
                              : 'text-[#969691] hover:text-[#14200C]'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => setCitizenMode('register')}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            citizenMode === 'register'
                              ? 'bg-white dark:bg-[#182214] text-[#14200C] dark:text-[#F2F6ED] shadow-xs'
                              : 'text-[#969691] hover:text-[#14200C]'
                          }`}
                        >
                          Register
                        </button>
                      </div>
                    </div>

                    {citizenError && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                        {citizenError}
                      </div>
                    )}

                    <form onSubmit={handleCitizenSubmit} className="space-y-4">
                      {citizenMode === 'signin' ? (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] mb-1.5 uppercase tracking-wide">
                              Mobile Number
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-[#969691] absolute left-3.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="tel"
                                value={citizenPhone}
                                onChange={(e) => setCitizenPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29] focus:ring-1 focus:ring-[#4A5F29]"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] uppercase tracking-wide">
                                4-Digit OTP / Passcode
                              </label>
                              <span className="text-[11px] text-[#4A5F29] dark:text-[#DAE3B7] font-semibold">
                                Demo: 4829
                              </span>
                            </div>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-[#969691] absolute left-3.5 top-1/2 -translate-y-1/2" />
                              <input
                                type="password"
                                maxLength={6}
                                value={citizenOtp}
                                onChange={(e) => setCitizenOtp(e.target.value)}
                                placeholder="Enter 4-digit code"
                                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29] focus:ring-1 focus:ring-[#4A5F29]"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] mb-1.5 uppercase tracking-wide">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={citizenName}
                              onChange={(e) => setCitizenName(e.target.value)}
                              placeholder="e.g. Aarav Sharma"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] mb-1.5 uppercase tracking-wide">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              value={citizenPhone}
                              onChange={(e) => setCitizenPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29]"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] mb-1.5 uppercase tracking-wide">
                                Ward / Area
                              </label>
                              <select
                                value={citizenWard}
                                onChange={(e) => setCitizenWard(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29]"
                              >
                                {MUNICIPAL_AREAS.map((a) => (
                                  <option key={a} value={a}>
                                    {a}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] mb-1.5 uppercase tracking-wide">
                                House / Flat
                              </label>
                              <input
                                type="text"
                                value={citizenAddress}
                                onChange={(e) => setCitizenAddress(e.target.value)}
                                placeholder="Flat 402, Green Meadows"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29]"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <button
                        type="submit"
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-[#4A5F29] hover:bg-[#3d4f21] text-white text-sm font-bold shadow-md hover:shadow-lg transition-smooth flex items-center justify-center gap-2 group"
                      >
                        <span>{citizenMode === 'signin' ? 'Sign In as Citizen' : 'Create Citizen Account'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>

                    {/* Quick Demo Shortcut (Supports Step 1 of realistic demo seamlessly) */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleQuickDemoCitizen}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#EEF0E4] dark:bg-[#202D1A] border border-[#14200C]/10 dark:border-[#DAE3B7]/20 text-xs font-semibold text-[#14200C] dark:text-[#F2F6ED] hover:border-[#4A5F29] flex items-center justify-center gap-2 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#4A5F29] dark:text-[#DAE3B7]" />
                        <span>⚡ Quick Demo: Continue as Aarav Sharma (Resident)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------ */}
                {/* ROLE 2: WORKER FORM */}
                {/* ------------------------------------------------ */}
                {selectedRole === 'worker' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="pb-3 border-b border-[#14200C]/08 dark:border-[#DAE3B7]/10">
                      <h2 className="text-lg font-bold text-[#14200C] dark:text-[#F2F6ED] flex items-center gap-2">
                        <span>Municipal Field Staff</span>
                      </h2>
                      <p className="text-xs text-[#969691] dark:text-[#DAE3B7]/70 mt-0.5">
                        Sanitation workers, collection drivers & field supervisors
                      </p>
                    </div>

                    {workerError && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                        {workerError}
                      </div>
                    )}

                    <form onSubmit={handleWorkerSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] mb-1.5 uppercase tracking-wide">
                          Select Worker Badge ID
                        </label>
                        <select
                          value={workerId}
                          onChange={(e) => setWorkerId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29]"
                        >
                          {INITIAL_WORKERS.map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name} · {w.unit} ({w.zone})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] uppercase tracking-wide">
                            4-Digit Staff Security PIN
                          </label>
                          <span className="text-[11px] text-[#4A5F29] dark:text-[#DAE3B7] font-semibold">
                            Demo PIN: 4321
                          </span>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#969691] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            maxLength={4}
                            value={workerPin}
                            onChange={(e) => setWorkerPin(e.target.value)}
                            placeholder="4321"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-[#4A5F29] hover:bg-[#3d4f21] text-white text-sm font-bold shadow-md hover:shadow-lg transition-smooth flex items-center justify-center gap-2 group"
                      >
                        <span>Sign In to Field Dispatch</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>

                    {/* Quick Demo Shortcut */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleQuickDemoWorker}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#EEF0E4] dark:bg-[#202D1A] border border-[#14200C]/10 dark:border-[#DAE3B7]/20 text-xs font-semibold text-[#14200C] dark:text-[#F2F6ED] hover:border-[#4A5F29] flex items-center justify-center gap-2 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#4A5F29] dark:text-[#DAE3B7]" />
                        <span>⚡ Quick Demo: Continue as Ramesh Kumar (Zone 2)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------ */}
                {/* ROLE 3: ADMIN FORM */}
                {/* ------------------------------------------------ */}
                {selectedRole === 'admin' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="pb-3 border-b border-[#14200C]/08 dark:border-[#DAE3B7]/10">
                      <h2 className="text-lg font-bold text-[#14200C] dark:text-[#F2F6ED] flex items-center gap-2">
                        <span>Municipal Command Center</span>
                      </h2>
                      <p className="text-xs text-[#969691] dark:text-[#DAE3B7]/70 mt-0.5">
                        Zonal inspectors, SLA triage & resource dispatchers
                      </p>
                    </div>

                    {adminError && (
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300">
                        {adminError}
                      </div>
                    )}

                    <form onSubmit={handleAdminSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] mb-1.5 uppercase tracking-wide">
                          Officer Municipal Email
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#969691] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="officer.verma@binsync.gov.in"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29]"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] uppercase tracking-wide">
                            Department Passcode
                          </label>
                          <span className="text-[11px] text-[#4A5F29] dark:text-[#DAE3B7] font-semibold">
                            Demo: admin2026
                          </span>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#969691] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            value={adminPasscode}
                            onChange={(e) => setAdminPasscode(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#14200C]/15 dark:border-[#DAE3B7]/20 bg-[#F7F7F1]/60 dark:bg-[#202D1A] text-sm font-medium focus:outline-none focus:border-[#4A5F29]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#EEF0E4]/60 dark:bg-[#202D1A]/60 border border-[#14200C]/08 text-xs text-[#14200C]/80 dark:text-[#DAE3B7]/80">
                        <ShieldCheck className="w-4 h-4 text-[#4A5F29] dark:text-[#DAE3B7] shrink-0" />
                        <span>Authorized for Ward 24 SLA triage, ticket assignment & dispatch</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-[#4A5F29] hover:bg-[#3d4f21] text-white text-sm font-bold shadow-md hover:shadow-lg transition-smooth flex items-center justify-center gap-2 group"
                      >
                        <span>Authorize Municipal Command</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>

                    {/* Quick Demo Shortcut (Supports Step 4 of realistic demo seamlessly) */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleQuickDemoAdmin}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#EEF0E4] dark:bg-[#202D1A] border border-[#14200C]/10 dark:border-[#DAE3B7]/20 text-xs font-semibold text-[#14200C] dark:text-[#F2F6ED] hover:border-[#4A5F29] flex items-center justify-center gap-2 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#4A5F29] dark:text-[#DAE3B7]" />
                        <span>⚡ Quick Demo: Continue as Municipal Admin (Dr. S. K. Verma)</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Clean minimal footer on sign in */}
          <p className="mt-8 text-xs text-[#969691] text-center">
            Ward 24 Municipal Corporation · Audited Civic Cleanliness Platform
          </p>
        </div>
      </main>
    </div>
  );
};
