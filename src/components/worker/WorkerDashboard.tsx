import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint } from '../../types';
import {
  HardHat,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Clock,
  Camera,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
  Upload,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WorkerDashboard: React.FC = () => {
  const { complaints, updateComplaintStatus, showToast } = useApp();

  // Ramesh Kumar is worker w-1
  const assignedWorkerName = 'Ramesh Kumar';
  const assignedWorkerUnit = 'Sanitation Unit 04 (Zone 2 North Ward)';

  // Find tasks assigned to worker (or unassigned tasks they can claim)
  const myTasks = complaints.filter(
    (c) =>
      c.assignedWorker?.name === assignedWorkerName ||
      (c.status === 'assigned' && !c.assignedWorker)
  );

  const activeTasks = myTasks.filter(
    (c) => c.status !== 'resolved' && c.status !== 'closed'
  );
  const completedTasks = complaints.filter(
    (c) =>
      (c.assignedWorker?.name === assignedWorkerName || c.assignedWorker?.id === 'w-1') &&
      (c.status === 'resolved' || c.status === 'closed')
  );

  const [activeTaskTab, setActiveTaskTab] = useState<'pending' | 'completed'>('pending');
  const [selectedTaskForVerify, setSelectedTaskForVerify] = useState<Complaint | null>(null);
  const [uploadedAfterPhoto, setUploadedAfterPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [overrideAllowed, setOverrideAllowed] = useState(false);

  const handleStartTask = (taskId: string) => {
    updateComplaintStatus(
      taskId,
      'in_progress',
      'Worker Ramesh Kumar arrived on-site and initiated cleanup operations.'
    );
    showToast('Task marked IN PROGRESS. Sanitation underway.', 'success');
  };

  const handleVerifyAndResolve = () => {
    if (!selectedTaskForVerify) return;
    setIsVerifying(true);

    setTimeout(() => {
      updateComplaintStatus(
        selectedTaskForVerify.id,
        'resolved',
        'Waste cleared, bin emptied and area disinfected with lime. Verified with after-cleanup photo.',
        'w-1',
        uploadedAfterPhoto
      );

      setIsVerifying(false);
      setSelectedTaskForVerify(null);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4A5F29', '#DAE3B7', '#728B3C'],
        });
      } catch {
        // ignore
      }

      showToast('Cleanup verified and marked RESOLVED!', 'success');
    }, 500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Worker Header matching Wireframe */}
      <div className="bg-[#14200C] text-white p-6 md:p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#4A5F29] text-white flex items-center justify-center font-bold text-xl border border-white/20">
            <HardHat className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DAE3B7]">
              <span>Field Sanitation Crew Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{assignedWorkerName}</h1>
            <p className="text-xs text-white/70 mt-0.5">{assignedWorkerUnit} · Truck: DL-01-MW-4022</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
              Assigned Active
            </span>
            <p className="text-2xl font-mono font-bold text-[#DAE3B7]">
              {activeTasks.length}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
              Completed
            </span>
            <p className="text-2xl font-mono font-bold text-white">
              {completedTasks.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#EEF0E4] rounded-2xl w-fit">
        <button
          onClick={() => setActiveTaskTab('pending')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-smooth ${
            activeTaskTab === 'pending'
              ? 'bg-[#4A5F29] text-white shadow-xs'
              : 'text-[#14200C]/70 hover:text-[#14200C]'
          }`}
        >
          My Active Tasks ({activeTasks.length})
        </button>
        <button
          onClick={() => setActiveTaskTab('completed')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-smooth ${
            activeTaskTab === 'completed'
              ? 'bg-[#4A5F29] text-white shadow-xs'
              : 'text-[#14200C]/70 hover:text-[#14200C]'
          }`}
        >
          Completed Cleanups ({completedTasks.length})
        </button>
      </div>

      {/* Tasks List */}
      {activeTaskTab === 'pending' ? (
        activeTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#14200C]/08 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#4A5F29] mx-auto" />
            <h3 className="text-base font-bold text-[#14200C]">All assigned tasks clear!</h3>
            <p className="text-xs text-[#969691]">No pending work orders currently queued for Unit 04.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-6 rounded-3xl border border-[#14200C]/08 hover:border-[#4A5F29]/30 shadow-xs transition-smooth flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-[#4A5F29] bg-[#EEF0E4] px-2.5 py-0.5 rounded">
                      {task.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded border text-[11px] font-bold ${
                        task.status === 'in_progress'
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                      }`}
                    >
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[#969691]">·</span>
                    <span className="font-semibold text-[#14200C]">{task.category}</span>
                    <span className="text-[#969691]">·</span>
                    <span
                      className={`text-[11px] font-bold ${
                        task.priority === 'Urgent'
                          ? 'text-red-700'
                          : task.priority === 'High'
                          ? 'text-orange-700'
                          : 'text-[#4A5F29]'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#14200C]">{task.title}</h3>
                  <p className="text-xs text-[#14200C]/75">{task.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#969691] pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#4A5F29]" />
                      <span>{task.location} ({task.addressDetails})</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(task.createdAt).toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                {/* Right photo preview & actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#14200C]/10 bg-[#F7F7F1] shrink-0">
                    <img
                      src={task.beforePhotoUrl}
                      alt="Task before photo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[170px]">
                    {task.status === 'assigned' ? (
                      <button
                        onClick={() => handleStartTask(task.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#4A5F29] hover:bg-[#3d4f21] text-white text-xs font-bold transition-smooth flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>Start Cleanup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedTaskForVerify(task)}
                        className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-smooth flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Verify & Resolve</span>
                      </button>
                    )}

                    <a
                      href={`tel:${task.reporterPhone || '+919811122334'}`}
                      className="w-full py-2 px-3 rounded-xl bg-[#F7F7F1] hover:bg-[#EEF0E4] text-[#14200C] text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#4A5F29]" />
                      <span>Call Citizen</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-3">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-2xl border border-[#14200C]/08 flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-[#4A5F29] bg-[#EEF0E4] px-2 py-0.5 rounded">
                    {task.id}
                  </span>
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                    Resolved
                  </span>
                  <span className="text-[#969691]">·</span>
                  <span className="font-bold text-[#14200C]">{task.title}</span>
                </div>
                <p className="text-xs text-[#969691] mt-1 flex items-center gap-2">
                  <span>{task.location}</span>
                  <span>·</span>
                  <span>Resolved: {new Date(task.updatedAt).toLocaleDateString()}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {task.afterPhotoUrl && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#14200C]/10">
                    <img
                      src={task.afterPhotoUrl}
                      alt="Resolved proof"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Verification Modal matching Wireframe Cleaned Scene flow */}
      {selectedTaskForVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#14200C]/10 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-6 bg-[#14200C] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#DAE3B7] uppercase tracking-wider">
                  Mandatory Cleanup Verification
                </span>
                <h2 className="text-lg font-bold">{selectedTaskForVerify.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTaskForVerify(null)}
                className="text-white/60 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#14200C]">
              {/* Wireframe Comparison Box: Before Photo vs After Photo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="font-bold text-[#969691]">Before: Reported Scene</span>
                  <div className="rounded-2xl overflow-hidden aspect-4/3 bg-[#F7F7F1] border border-[#14200C]/10">
                    <img
                      src={selectedTaskForVerify.beforePhotoUrl}
                      alt="Before"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#4A5F29]">After: Cleaned Photo</span>
                  <div className="rounded-2xl overflow-hidden aspect-4/3 bg-[#F7F7F1] border border-[#14200C]/10 relative group">
                    <img
                      src={uploadedAfterPhoto}
                      alt="After"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          setUploadedAfterPhoto(
                            uploadedAfterPhoto.includes('photo-1517649763962-0c623266ddc0')
                              ? 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80'
                              : 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
                          )
                        }
                        className="px-3 py-1 bg-white text-xs font-bold rounded-lg"
                      >
                        Switch Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wireframe AI Comparison Verdict Badge */}
              <div className="p-4 rounded-2xl bg-[#EEF0E4] border border-[#4A5F29]/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A5F29]">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Scene Verification Check</span>
                </div>
                <div className="space-y-1 text-[#14200C]/80">
                  <p><strong>Verdict:</strong> Cleaned — Same Scene Confirmed</p>
                  <p><strong>Confidence:</strong> 96% Match</p>
                  <p><strong>Notes:</strong> Scene matches original location coordinates and all visible waste has been evacuated.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForVerify(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#14200C]/15 font-semibold hover:bg-[#F7F7F1]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleVerifyAndResolve}
                  disabled={isVerifying}
                  className="px-6 py-2.5 rounded-xl bg-[#4A5F29] hover:bg-[#3d4f21] text-white font-bold flex items-center gap-2 shadow-xs transition-smooth disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Cleanup...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Mark Resolved</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
