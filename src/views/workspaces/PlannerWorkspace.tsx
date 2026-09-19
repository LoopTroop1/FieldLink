import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlannerReviewQueueView } from '../PlannerReviewQueueView';
import { ScheduleLinkerView } from '../ScheduleLinkerView';
import { LiveScheduleGanttView } from '../LiveScheduleGanttView';
import { 
  Briefcase, 
  GitMerge, 
  Inbox, 
  CalendarDays, 
  HardHat, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  Send,
  AlertCircle,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const PlannerWorkspace: React.FC = () => {
  const { 
    currentUser, 
    progressEvents, 
    activities, 
    switchRole, 
    addRoleHandoff,
    approveCandidateMatch,
    selectedEventId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'incoming-supervisor' | 'linker' | 'review-queue' | 'gantt'>('incoming-supervisor');
  const [clarificationNote, setClarificationNote] = useState('');
  const [clarificationSent, setClarificationSent] = useState(false);

  // Unlinked or pending supervisor events
  const pendingEvents = progressEvents.filter(e => e.validationStatus === 'pending');
  const highConfidenceEvents = pendingEvents.filter(e => e.confidenceLevel === 'HIGH');
  const unmatchedEvents = pendingEvents.filter(e => e.confidenceLevel === 'UNMATCHED' || e.confidenceLevel === 'LOW');

  const handleRequestSupervisorClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationNote.trim()) return;

    addRoleHandoff({
      fromRole: 'L3 Planner',
      fromName: currentUser.name,
      toRole: 'L5 Supervisor',
      toName: 'Ramesh Sharma',
      action: 'Clarification Request on Field Joint Count & NDT Clearance',
      activityCode: 'PIP-L6-024A',
      activityName: 'Line 24-XX Segment Execution',
      status: 'flagged',
      note: clarificationNote
    });

    setClarificationSent(true);
    setTimeout(() => {
      setClarificationSent(false);
      setClarificationNote('');
    }, 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Role Connection Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
        border: '1.5px solid rgba(14, 165, 233, 0.35)',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: '#0EA5E9',
                color: '#0F172A',
                fontWeight: 800,
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.8px'
              }}>
                LEVEL 3 WORKSPACE
              </span>
              <span style={{ fontSize: '12px', color: '#7DD3FC', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Briefcase size={14} />
                Planning & Project Controls Directorate
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
              Lead Planner Console — Rajiv Sen
            </h1>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '820px', lineHeight: 1.5 }}>
              The central Planning-to-Execution Bridge. Continuously receives frontline DPRs and voice actuals from <strong>Site Supervisor Ramesh Sharma</strong>, matches them using the 6-signal deterministic engine, gates out-of-sequence safety predecessors, and feeds validated actuals into Primavera P6.
            </p>
          </div>

          {/* Active Coordination Channels Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '12px 16px',
            minWidth: '290px',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
              Active Coordination Channels
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#34D399', marginBottom: '3px' }}>
              <HardHat size={13} />
              <span>Receiving Field Actuals:</span>
              <strong style={{ color: '#fff' }}>Supervisor Ramesh Sharma (L5)</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Submits PMIS Sync To:</span>
              <strong style={{ color: '#A78BFA' }}>PM S. Banerjee (L2)</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => switchRole('L5 Supervisor')}
                style={{
                  background: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  color: '#34D399',
                  borderRadius: '5px',
                  padding: '4px 6px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <ArrowLeft size={11} />
                <span>Supervisor View</span>
              </button>

              <button
                onClick={() => switchRole('L2 Project Manager')}
                style={{
                  background: 'rgba(167, 139, 250, 0.12)',
                  border: '1px solid rgba(167, 139, 250, 0.35)',
                  color: '#A78BFA',
                  borderRadius: '5px',
                  padding: '4px 6px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <span>PM View (L2)</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Metric Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(14, 165, 233, 0.2)'
        }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Supervisor Reports Pending</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: pendingEvents.length > 0 ? '#F59E0B' : '#10B981' }}>
              {pendingEvents.length} Events
            </div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>High Confidence (Fast-Track)</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>{highConfidenceEvents.length} Matched (&gt;85%)</div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Unmatched / Scope Candidates</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: unmatchedEvents.length > 0 ? '#EF4444' : 'var(--text-muted)' }}>
              {unmatchedEvents.length} Action Needed
            </div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Level 5/6 P6 Baseline Scope</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8' }}>{activities.length} Work Packages</div>
          </div>
        </div>
      </div>

      {/* Primary Planner Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('incoming-supervisor')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'incoming-supervisor' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'incoming-supervisor' ? '#0EA5E9' : 'var(--text-secondary)',
            borderBottom: activeTab === 'incoming-supervisor' ? '3px solid #0EA5E9' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <Inbox size={16} />
          <span>Incoming Supervisor Feed ({pendingEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('linker')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'linker' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'linker' ? '#0EA5E9' : 'var(--text-secondary)',
            borderBottom: activeTab === 'linker' ? '3px solid #0EA5E9' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <GitMerge size={16} />
          <span>6-Signal Schedule Linker</span>
        </button>

        <button
          onClick={() => setActiveTab('review-queue')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'review-queue' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'review-queue' ? '#0EA5E9' : 'var(--text-secondary)',
            borderBottom: activeTab === 'review-queue' ? '3px solid #0EA5E9' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <ShieldCheck size={16} />
          <span>Out-of-Sequence Predecessor Safety Gate</span>
        </button>

        <button
          onClick={() => setActiveTab('gantt')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'gantt' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'gantt' ? '#0EA5E9' : 'var(--text-secondary)',
            borderBottom: activeTab === 'gantt' ? '3px solid #0EA5E9' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <CalendarDays size={16} />
          <span>Live Level 5/6 Gantt Chart</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'incoming-supervisor' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Communication Widget with Site Supervisor */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '20px 24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={17} color="#38BDF8" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Active Coordination Line: Lead Planner Rajiv Sen ◄► Supervisor Ramesh Sharma
                </h3>
              </div>
              <span className="badge badge-info" style={{ fontSize: '11px' }}>
                Role Coordination Channel Active
              </span>
            </div>

            {clarificationSent && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '14px',
                color: '#38BDF8',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} />
                <span>Clarification request dispatched to Supervisor Ramesh Sharma's WhatsApp / Time Agent feed.</span>
              </div>
            )}

            <form onSubmit={handleRequestSupervisorClarification} style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                className="input-field"
                value={clarificationNote}
                onChange={(e) => setClarificationNote(e.target.value)}
                placeholder="Send quick site query to Supervisor (e.g. Ramesh, please confirm if Line 24-XX joint 18 NDT radiography is cleared by QC)..."
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '12px' }}
                disabled={!clarificationNote.trim()}
              >
                <Send size={13} />
                <span>Request Clarification</span>
              </button>
            </form>
          </div>

          {/* Incoming Items List from Supervisor */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Frontline Daily Progress Reports Awaiting Schedule Linking
                </h2>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Submitted directly by site supervisors. Review 6-signal confidence score, link to WBS Level 5/6, or trigger 1:N split.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('linker')}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <GitMerge size={14} />
                <span>Open Multi-Signal Linker</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {evt.activityDescription}
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '10.5px' }}>
                        {evt.discipline}
                      </span>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        color: evt.confidenceLevel === 'HIGH' ? '#10B981' : (evt.confidenceLevel === 'MEDIUM' ? '#F59E0B' : '#EF4444'),
                        background: evt.confidenceLevel === 'HIGH' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        border: `1px solid ${evt.confidenceLevel === 'HIGH' ? '#10B981' : '#F59E0B'}40`
                      }}>
                        {evt.confidenceScore}% Confidence ({evt.confidenceLevel})
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Submitted by Ramesh Sharma (L5)
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Physical Actual: <strong>{evt.quantity || evt.impliedQuantity || 18} {evt.progressUnit || 'units'}</strong> ({evt.progressValue}% progress) in <strong>{evt.location}</strong>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: '4px' }}>
                      Raw Source Quote: "{evt.evidenceSnippet}"
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => setActiveTab('linker')}
                      className="btn btn-primary"
                      style={{ padding: '7px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <GitMerge size={13} />
                      <span>Link to L5/L6 Schedule</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('review-queue')}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ShieldCheck size={13} />
                      <span>Check Predecessors</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'linker' && (
        <div>
          <ScheduleLinkerView />
        </div>
      )}

      {activeTab === 'review-queue' && (
        <div>
          <PlannerReviewQueueView />
        </div>
      )}

      {activeTab === 'gantt' && (
        <div>
          <LiveScheduleGanttView />
        </div>
      )}
    </div>
  );
};
