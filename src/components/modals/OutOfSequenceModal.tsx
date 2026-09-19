import React, { useState, useEffect } from 'react';
import { ScheduleActivity } from '../../types';
import { AlertTriangle, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface OutOfSequenceModalProps {
  activity: ScheduleActivity;
  incompletePredecessors: ScheduleActivity[];
  onConfirm: (justification: string) => void;
  onClose: () => void;
}

export const OutOfSequenceModal: React.FC<OutOfSequenceModalProps> = ({
  activity,
  incompletePredecessors,
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

  const [justification, setJustification] = useState(
    'Field erection proceeded on temporary structural shoring prior to foundation sign-off. Approved with engineering mitigation.'
  );

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="oos-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(245, 158, 11, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Out-of-Sequence Execution Warning</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <div style={{
            background: 'var(--warning-bg)',
            border: '1px solid var(--warning)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '12.5px',
            color: 'var(--text-primary)',
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <ShieldAlert size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--warning)' }}>Predecessor Incomplete: Schedule Synchronization Paused</strong>
              <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Activity <strong>{activity.activityCode} ({activity.description})</strong> has uncompleted predecessors in the baseline schedule logic.
              </div>
            </div>
          </div>

          {/* Incomplete Predecessors List */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Uncompleted Upstream Dependencies:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {incompletePredecessors.map(p => (
                <div key={p.id} className="oil-card" style={{
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{p.activityCode}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '8px' }}>{p.description}</span>
                  </div>
                  <span className="badge badge-warning">
                    {p.percentComplete}% Complete
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Rule Note */}
          <div style={{
            fontSize: '11.5px',
            color: 'var(--text-muted)',
            lineHeight: '1.5',
            marginBottom: '20px',
            padding: '8px 12px',
            background: 'var(--bg-base)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <strong>Rule:</strong> Approving this record updates physical actuals but <em>never modifies predecessor logic or downstream baseline dates</em>. A mandatory planner justification is permanently recorded in the append-only audit trail.
          </div>

          {/* Mandatory Justification */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Mandatory Planner Justification Note:
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain how work proceeded despite incomplete predecessor..."
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel & Hold
          </button>
          <button
            disabled={!justification.trim()}
            onClick={() => onConfirm(justification)}
            className="btn btn-warning"
          >
            <CheckCircle2 size={15} />
            <span>Confirm Override & Record Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
