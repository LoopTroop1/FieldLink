import React from 'react';
import { ChevronRight, X, CheckCircle2 } from 'lucide-react';

interface GuidedDemoProps {
  currentStep: number;
  onNextStep: () => void;
  onExit: () => void;
}

export const GuidedDemoBanner: React.FC<GuidedDemoProps> = ({ currentStep, onNextStep, onExit }) => {
  const steps = [
    {
      act: 'Act 1: Field Ingestion',
      title: 'Ingesting Daily Progress Report',
      description: 'Observe heterogeneous free-text DPR for Line 24-XX being parsed, cleaned, and date-normalized.',
      targetView: 'ingestion'
    },
    {
      act: 'Act 2: Extraction & Match',
      title: 'Explainable Multi-Signal Linking',
      description: 'Review structured quantities (18 joints / 75%) and transparent 94% composite score breakdown.',
      targetView: 'linker'
    },
    {
      act: 'Act 3: Planner Governance',
      title: 'Triage & Fast-Track Approval',
      description: 'Review ambiguous civil entry (<10% gap), unmapped tank platform, and approve high-confidence piping.',
      targetView: 'review'
    },
    {
      act: 'Act 4: Live Schedule & P6',
      title: 'Simulated PMIS Synchronization',
      description: 'Verify actual progress bar, +1.0 day baseline variance, and inspect P6-compatible REST payload.',
      targetView: 'schedule'
    },
    {
      act: 'Act 5: Organizational Memory',
      title: 'Analytics & Reusable Intelligence',
      description: 'Examine dynamic S-curves, What-If delay ripple simulation, and auto-synthesized lessons learned.',
      targetView: 'analytics'
    }
  ];

  const active = steps[currentStep] || steps[0];

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(8, 47, 73, 0.95) 0%, rgba(12, 74, 110, 0.9) 100%)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.35)',
      padding: '9px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#fff',
      zIndex: 40,
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11.5px',
          fontWeight: 700,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {active.act} ({currentStep + 1}/5)
        </div>

        <div>
          <strong style={{ fontSize: '13px', color: '#FFFFFF', fontWeight: 700 }}>{active.title}: </strong>
          <span style={{ fontSize: '12.5px', color: '#BAE6FD' }}>{active.description}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {currentStep < 4 ? (
          <button onClick={onNextStep} className="btn btn-primary" style={{ padding: '5px 12px', fontSize: '12px' }}>
            <span>Next Step</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <button onClick={onExit} className="btn btn-success" style={{ padding: '5px 12px', fontSize: '12px' }}>
            <CheckCircle2 size={14} />
            <span>Complete Demo</span>
          </button>
        )}

        <button onClick={onExit} className="btn btn-secondary" style={{ padding: '5px 8px', fontSize: '12px' }} title="Exit Guided Walkthrough">
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
