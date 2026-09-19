import React, { useState, useEffect } from 'react';
import { ProgressEvent, ScheduleActivity, AllocationSplitItem } from '../../types';
import { X, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';

interface GranularityModalProps {
  event: ProgressEvent;
  activities: ScheduleActivity[];
  onConfirm: (allocations: AllocationSplitItem[], justification: string) => void;
  onClose: () => void;
}

export const GranularityModal: React.FC<GranularityModalProps> = ({
  event,
  activities,
  onConfirm,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Pre-configured Piping Joint Split Template
  const pipingActivities = activities.filter(a => a.discipline === 'PIPING');
  
  const [allocations, setAllocations] = useState<AllocationSplitItem[]>([
    { activityId: pipingActivities[1]?.id || 'act-pip-024', allocationPercent: 20 },  // Fit-up
    { activityId: pipingActivities[2]?.id || 'act-pip-024a', allocationPercent: 50 }, // Welding
    { activityId: pipingActivities[3]?.id || 'act-pip-025', allocationPercent: 30 }   // NDT
  ]);

  const [justification, setJustification] = useState(
    'Field report composite work allocated across Fit-up (20%), Welding (50%), and NDT (30%) per standard craft norms.'
  );

  const totalAlloc = allocations.reduce((acc, a) => acc + a.allocationPercent, 0);
  const isValid = totalAlloc === 100;

  const handleSliderChange = (actId: string, val: number) => {
    setAllocations(prev =>
      prev.map(item => (item.activityId === actId ? { ...item, allocationPercent: val } : item))
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="granularity-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--teal-accent)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>1:N Field Record Allocation Splitter</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          <div style={{
            background: 'rgba(14, 165, 233, 0.08)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '20px'
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>Composite Field Event: </strong>
            "{event.activityDescription}"
            <div style={{ marginTop: '5px', fontSize: '11.5px', color: 'var(--teal-accent)', lineHeight: 1.5 }}>
              <strong>Notice:</strong> These percentages represent <em>Field Record Allocation</em> to distribute the source field report across activities. They do not directly set each activity's percentage completion. Total allocation must equal exactly 100%.
            </div>
          </div>

          {/* Allocation Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {allocations.map(item => {
              const act = activities.find(a => a.id === item.activityId);
              return (
                <div key={item.activityId} className="oil-card" style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {act?.activityCode}: {act?.description}
                    </span>
                    <strong style={{ fontSize: '13px', color: 'var(--teal-accent)' }}>
                      Field Allocation: {item.allocationPercent}%
                    </strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={item.allocationPercent}
                    onChange={(e) => handleSliderChange(item.activityId, parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--teal-accent)', cursor: 'pointer' }}
                  />
                </div>
              );
            })}
          </div>

          {/* Total Validation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            borderRadius: '6px',
            background: isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              {isValid ? <CheckCircle2 size={16} color="var(--oil-green)" /> : <AlertCircle size={16} color="var(--danger)" />}
              <span>Total Allocation:</span>
            </div>
            <strong style={{ fontSize: '14px', color: isValid ? 'var(--oil-green)' : 'var(--danger)' }}>
              {totalAlloc}% / 100%
            </strong>
          </div>

          {/* Planner Justification */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Planner Justification Note (Required for Audit Trail):
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Enter technical justification for the 1:N split..."
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            disabled={!isValid || !justification.trim()}
            onClick={() => onConfirm(allocations, justification)}
            className="btn btn-primary"
            style={{ opacity: isValid && justification.trim() ? 1 : 0.5 }}
          >
            Confirm 1:N Split
          </button>
        </div>
      </div>
    </div>
  );
};
