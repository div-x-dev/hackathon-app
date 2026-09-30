import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { ReportWasteView } from './components/citizen/ReportWasteView';
import { MyComplaintsView } from './components/citizen/MyComplaintsView';
import { SchedulePickupView } from './components/citizen/SchedulePickupView';
import { EcoAwarenessView } from './components/citizen/EcoAwarenessView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { WorkerDashboard } from './components/worker/WorkerDashboard';
import { LandingHero } from './components/home/LandingHero';
import { Toast } from './components/common/Toast';
import { Logo } from './components/brand/Logo';
import { SproutIcon } from './components/brand/Mascots';
import { RoleAuthScreen } from './components/auth/RoleAuthScreen';
import { DashboardEcoBackground } from './components/common/DashboardEcoBackground';

const MainContent: React.FC = () => {
  const { role, activeTab, setActiveTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* If viewing landing/home */}
      {activeTab === 'landing' ? (
        <LandingHero />
      ) : role === 'admin' ? (
        <AdminDashboard />
      ) : role === 'worker' ? (
        <WorkerDashboard />
      ) : (
        <>
          {activeTab === 'dashboard' && <CitizenDashboard />}
          {activeTab === 'report' && <ReportWasteView />}
          {activeTab === 'my-complaints' && <MyComplaintsView />}
          {activeTab === 'pickups' && <SchedulePickupView />}
          {activeTab === 'awareness' && <EcoAwarenessView />}
        </>
      )}
    </main>
  );
};

const Footer: React.FC = () => {
  const { setRole, setActiveTab } = useApp();

  return (
    <footer className="mt-20 border-t border-white/50 dark:border-white/10 bg-white/60 dark:bg-[#182214]/65 backdrop-blur-xl py-12 text-[#14200C]/75 dark:text-[#F2F6ED]/75 text-xs shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Logo size="sm" />
          <div className="h-4 w-px bg-[#14200C]/15 dark:bg-white/20 hidden sm:block" />
          <p className="text-[#969691] dark:text-[#8E9B82]">
            Civic-Tech Municipal Waste Dispatch & Audited Tracking Platform · Ward 24
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
          <button
            onClick={() => setActiveTab('landing')}
            className="hover:text-[#4A5F29] dark:hover:text-[#DAE3B7] transition-colors"
          >
            Landing Overview
          </button>
          <button
            onClick={() => {
              setRole('citizen');
              setActiveTab('dashboard');
            }}
            className="hover:text-[#4A5F29] dark:hover:text-[#DAE3B7] transition-colors"
          >
            Citizen Portal
          </button>
          <button
            onClick={() => {
              setRole('admin');
              setActiveTab('priority-queue');
            }}
            className="hover:text-[#4A5F29] dark:hover:text-[#DAE3B7] transition-colors"
          >
            Municipal Admin
          </button>
          <button
            onClick={() => {
              setRole('worker');
              setActiveTab('my-tasks');
            }}
            className="hover:text-[#4A5F29] dark:hover:text-[#DAE3B7] transition-colors"
          >
            Worker Portal
          </button>
          <button
            onClick={() => setActiveTab('awareness')}
            className="hover:text-[#4A5F29] dark:hover:text-[#DAE3B7] transition-colors"
          >
            Eco Awareness
          </button>
        </div>

        <div className="text-[#969691] dark:text-[#8E9B82] text-center sm:text-right font-tabular">
          © 2026 BinSync Inc. Designed for Civic Cleanliness.
        </div>
      </div>
    </footer>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <RoleAuthScreen />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative overflow-x-hidden">
      <DashboardEcoBackground />
      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />
      </div>
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
