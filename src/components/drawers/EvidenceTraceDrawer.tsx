import React from 'react';
import { ScheduleActivity } from '../../types';
import { useApp } from '../../context/AppContext';
import { AuditService, EvidenceTraceChain } from '../../services/auditService';
import { X, FileText, Quote, Cpu, CheckCheck, CheckCircle, CalendarDays, ExternalLink } from 'lucide-react';

interface EvidenceTraceDrawerProps {
  activity: ScheduleActivity | null;
  onClose: () => void;
}

export const EvidenceTraceDrawer: React.FC<EvidenceTraceDrawerProps> = ({ activity, onClose }) => {
  const { activities, progressEvents, fieldRecords, auditTrail, maskText } = useApp();

  if (!activity) return null;

  const chain: EvidenceTraceChain = AuditService.buildEvidenceTrace(
    activity.id,
    activities,
    progressEvents,
    fieldRecords,
    auditTrail
  );

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'SOURCE_FILE': return <FileText size={16} color="var(--teal-accent)" />;
      case 'EXTRACTED_PHRASE': return <Quote size={16} color="#FACC15" />;
      case 'STRUCTURED_EVENT': return <Cpu size={16} color="#38BDF8" />;
      case 'MATCH_CANDIDATE': return <CheckCheck size={16} color="#A78BFA" />;
      case 'PLANNER_APPROVAL': return <CheckCircle size={16} color="#34D399" />;
      case 'SCHEDULE_UPDATE': return <CalendarDays size={16} color="#F472B6" />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', width: '580px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--teal-accent)', fontWeight: 600 }}>
              6-Point Traceability Chain
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
              Evidence Lineage: {activity.activityCode}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Unbroken, clickable lineage connecting the live schedule bar back to the originating field report phrase.
        </div>

        {/* Vertical Stepper Chain */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px' }}>
          {chain.nodes.map((node, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '14px', position: 'relative', paddingBottom: idx === chain.nodes.length - 1 ? 0 : '24px' }}>
              {/* Connecting line */}
              {idx !== chain.nodes.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '15px',
                  top: '32px',
                  bottom: 0,
                  width: '2px',
                  background: 'var(--border-subtle)'
                }} />
              )}

              {/* Icon Circle */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1
              }}>
                {getStepIcon(node.step)}
              </div>

              {/* Node Card */}
              <div className="oil-card" style={{ flex: 1, padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {node.title}
                  </span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    {node.timestamp.substring(11, 16)} hrs
                  </span>
                </div>

                {/* Evidence Snippet Quote */}
                {node.evidenceSnippet && (
                  <div style={{
                    background: 'var(--highlight-bg)',
                    borderLeft: '3px solid var(--highlight-border)',
                    padding: '8px 10px',
                    fontSize: '11.5px',
                    color: 'var(--text-primary)',
                    fontStyle: 'italic',
                    borderRadius: '0 4px 4px 0',
                    marginBottom: '8px'
                  }}>
                    "{node.evidenceSnippet}"
                  </div>
                )}

                {/* Metadata List */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                  {Object.entries(node.metadata).map(([key, val]) => (
                    <div key={key}>
                      <span style={{ color: 'var(--text-muted)' }}>{key}: </span>
                      <strong style={{ color: 'var(--text-secondary)' }}>
                        {maskText(String(val))}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
