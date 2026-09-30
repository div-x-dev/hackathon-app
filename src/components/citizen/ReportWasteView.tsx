import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import { MUNICIPAL_AREAS } from '../../data/mockData';
import {
  Upload,
  Camera,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReportWasteView: React.FC = () => {
  const { createComplaint, setActiveTab, setSelectedComplaintId } = useApp();

  const [category, setCategory] = useState<ComplaintCategory>('Overflowing Bin');
  const [location, setLocation] = useState<string>('College Road');
  const [addressDetails, setAddressDetails] = useState<string>('Near Main University Gate, College Road');
  const [priority, setPriority] = useState<ComplaintPriority>('Urgent');
  const [description, setDescription] = useState<string>(
    'Public municipal bin is overflowing onto the pedestrian footpath. Litter is scattered across the pavement and blocking the walking path.'
  );
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
  );
  const [aiTriageDone, setAiTriageDone] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const categories: ComplaintCategory[] = [
    'Overflowing Bin',
    'Illegal Dumping',
    'Broken Bin',
    'Hazardous Waste',
    'Bio-Waste',
    'Uncollected Garbage',
    'Other',
  ];

  const priorities: { value: ComplaintPriority; label: string; desc: string; color: string }[] = [
    { value: 'Low', label: 'Low', desc: 'Routine pickup / Minor debris', color: 'border-slate-200 text-slate-700 bg-slate-50' },
    { value: 'Medium', label: 'Medium', desc: 'Standard turnaround within 24h', color: 'border-amber-200 text-amber-700 bg-amber-50' },
    { value: 'High', label: 'High', desc: 'Heavily littered / public nuisance', color: 'border-orange-200 text-orange-700 bg-orange-50' },
    { value: 'Urgent', label: 'Urgent', desc: 'Blocked road, health hazard, immediate dispatch', color: 'border-red-300 text-red-800 bg-red-50' },
  ];

  // Quick fill preset for exact demo scenario
  const handleQuickDemoPreset = () => {
    setCategory('Overflowing Bin');
    setLocation('College Road');
    setPriority('Urgent');
    setAddressDetails('Opposite Engineering College Library, College Road');
    setDescription(
      'Municipal garbage bin is completely full and spilling over the walkway. Needs immediate sanitation truck clearance.'
    );
    setPhotoUrl('https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80');
    setAiTriageDone(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !location) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newComplaint = createComplaint({
        title: `${category} at ${location}`,
        category,
        location,
        addressDetails,
        priority,
        description,
        beforePhotoUrl: photoUrl,
      });

      setIsSubmitting(false);
      setSubmittedTicketId(newComplaint.id);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#4A5F29', '#DAE3B7', '#728B3C', '#14200C'],
        });
      } catch {
        // graceful ignore
      }
    }, 400);
  };

  if (submittedTicketId) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="glass-hero rounded-3xl p-8 md:p-10 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#DAE3B7] text-[#4A5F29] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#4A5F29] dark:text-[#DAE3B7] bg-[#DAE3B7]/50 dark:bg-[#4A5F29]/30 border border-white/60 dark:border-white/10 px-3 py-1 rounded-full shadow-2xs">
            Civic Dispatch Alert Created
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-[#14200C] dark:text-[#F2F6ED] mt-3">
            Report submitted successfully.
          </h2>

          <p className="text-sm text-[#969691] dark:text-[#8E9B82] mt-2">
            Your complaint has been queued in the municipal ward triage desk.
          </p>

          <div className="my-6 p-4 rounded-2xl glass-card-subtle max-w-sm mx-auto">
            <p className="text-xs text-[#969691] dark:text-[#8E9B82] uppercase tracking-wider font-semibold">
              Official Tracking ID
            </p>
            <p className="text-2xl font-mono font-bold text-[#4A5F29] dark:text-[#DAE3B7] mt-1">
              {submittedTicketId}
            </p>
            <div className="mt-2 text-xs text-[#14200C]/80 dark:text-[#F2F6ED]/80 flex items-center justify-center gap-2">
              <span className="font-semibold">{location}</span>
              <span>·</span>
              <span className="text-red-700 dark:text-red-400 font-bold">{priority} Priority</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedComplaintId(submittedTicketId);
                setActiveTab('my-complaints');
              }}
              className="glass-button-primary w-full sm:w-auto px-6 py-3 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Track Ticket Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmittedTicketId(null);
                handleQuickDemoPreset();
              }}
              className="glass-button-secondary w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header with Quick Preset Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#14200C]/08">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#14200C] tracking-tight">
            Report Waste Issue
          </h1>
          <p className="text-xs md:text-sm text-[#969691] mt-1">
            Submit photos and coordinates to dispatch municipal cleaning crews.
          </p>
        </div>

        {/* 1-Click Demo Shortcut matching prompt requirements */}
        <button
          type="button"
          onClick={handleQuickDemoPreset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#DAE3B7]/80 hover:bg-[#DAE3B7] text-[#14200C] text-xs font-semibold border border-[#4A5F29]/20 transition-smooth shadow-2xs self-start"
          title="Autofill Overflowing Bin at College Road (Urgent)"
        >
          <Zap className="w-3.5 h-3.5 text-[#4A5F29]" />
          <span>Quick Demo: Overflowing Bin @ College Rd</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Fields */}
        <div className="lg:col-span-2 space-y-6 glass-card-primary p-6 md:p-8 rounded-3xl">
          {/* Issue Category */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14200C] uppercase tracking-wider">
              Issue Category <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left border transition-smooth ${
                    category === cat
                      ? 'border-[#4A5F29] bg-[#EEF0E4] text-[#4A5F29] font-bold shadow-2xs'
                      : 'border-[#14200C]/10 hover:border-[#14200C]/30 text-[#14200C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location Area Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#14200C] uppercase tracking-wider">
                Location Area <span className="text-red-600">*</span>
              </label>
              <span className="text-[11px] text-[#4A5F29] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" /> GPS Pin Auto-Verified
              </span>
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F7F7F1] border border-[#14200C]/15 rounded-xl text-sm font-medium text-[#14200C] focus:outline-hidden focus:border-[#4A5F29]"
            >
              {MUNICIPAL_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Street Address / Landmark */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14200C] uppercase tracking-wider">
              Street Landmark / Details
            </label>
            <input
              type="text"
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              placeholder="e.g. Opposite Main Gate, near electrical pole #12"
              className="w-full px-3.5 py-2.5 bg-[#F7F7F1] border border-[#14200C]/15 rounded-xl text-sm text-[#14200C] focus:outline-hidden focus:border-[#4A5F29]"
            />
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14200C] uppercase tracking-wider">
              Priority Level <span className="text-red-600">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`p-3 rounded-xl border text-left transition-smooth flex flex-col justify-between ${
                    priority === p.value
                      ? 'border-[#4A5F29] ring-2 ring-[#4A5F29]/20 bg-[#EEF0E4]'
                      : 'border-[#14200C]/10 hover:border-[#14200C]/30 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#14200C]">{p.label}</span>
                    {priority === p.value && (
                      <span className="w-2 h-2 rounded-full bg-[#4A5F29]" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#969691] mt-1 leading-tight line-clamp-2">
                    {p.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#14200C] uppercase tracking-wider">
              Issue Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the waste situation, volume, or obstacles..."
              className="w-full px-3.5 py-2.5 bg-[#F7F7F1] border border-[#14200C]/15 rounded-xl text-sm text-[#14200C] focus:outline-hidden focus:border-[#4A5F29]"
            />
          </div>
        </div>

        {/* Right Col: Photo Upload & AI Triage Simulator */}
        <div className="space-y-6">
          {/* Photo Card */}
          <div className="glass-card-primary p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#14200C] dark:text-[#F2F6ED] uppercase tracking-wider">
                Photo Evidence
              </span>
              <span className="text-[11px] text-[#969691] dark:text-[#8E9B82]">Geo-tagged</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/50 dark:border-white/15 aspect-4/3 bg-black/5">
              <img
                src={photoUrl}
                alt="Waste report preview"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => {
                    // Toggle alternative realistic photo
                    setPhotoUrl(
                      photoUrl.includes('photo-1528323273322-d81458248d40')
                        ? 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
                        : 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80'
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-semibold text-[#14200C] hover:bg-white transition-colors"
                >
                  Change Photo
                </button>
              </div>

              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-md flex items-center justify-between">
                <span>📍 28.6139° N, 77.2090° E</span>
                <span className="text-emerald-300 font-semibold">Valid GPS</span>
              </div>
            </div>

            {/* AI Triage verification box matching wireframe */}
            {aiTriageDone && (
              <div className="p-3.5 rounded-2xl glass-card-subtle space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A5F29] dark:text-[#DAE3B7]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Triage & Classification</span>
                </div>
                <div className="text-[11px] space-y-1 text-[#14200C]/85 dark:text-[#F2F6ED]/85 font-medium">
                  <p>
                    <strong className="text-[#14200C] dark:text-[#F2F6ED]">Detection:</strong> Overflowing bin spilling on footpath
                  </p>
                  <p>
                    <strong className="text-[#14200C] dark:text-[#F2F6ED]">Confidence:</strong> 96% Match
                  </p>
                  <p>
                    <strong className="text-[#14200C] dark:text-[#F2F6ED]">Recommended Priority:</strong>{' '}
                    <span className="text-red-700 dark:text-red-400 font-bold uppercase">{priority}</span>
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="glass-button-primary w-full py-3.5 px-6 rounded-full text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Ticket...</span>
                </>
              ) : (
                <>
                  <span>Submit Waste Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
