import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProgressEvent, ScheduleActivity } from '../types';
import { ApprovalService } from '../services/approvalService';
import { OutOfSequenceModal } from '../components/modals/OutOfSequenceModal';
import { GranularityModal } from '../components/modals/GranularityModal';
import { 
  Inbox, 
  CheckCircle2, 
  Sliders, 
  PlusCircle, 
  AlertTriangle, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

export const PlannerReviewQueueView: React.FC = () => {
  const {
    activities,
    progressEvents,
    approveCandidateMatch,
    apply1ToNSplit,
    proposeNewActivity,
    setSelectedEventId,
    setActiveView,
    getCandidatesForEvent
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'fast-track' | 'review' | 'unmatched'>('all');
  const [disciplineFilter, setDisciplineFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [activeGranularityEvent, setActiveGranularityEvent] = useState<ProgressEvent | null>(null);
  const [activeOutOfSeqTarget, setActiveOutOfSeqTarget] = useState<{ event: ProgressEvent; act: ScheduleActivity } | null>(null);
  const [proposingNewEvent, setProposingNewEvent] = useState<ProgressEvent | null>(null);
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityDiscipline, setNewActivityDiscipline] = useState('CIVIL');
  const [newActivityLocation, setNewActivityLocation] = useState('Tank Farm Facilities');

  // Filter events
  const filteredEvents = progressEvents.filter(ev => {
    // Tab filter
    if (filterTab === 'fast-track' && ev.confidenceLevel !== 'HIGH') return false;
    if (filterTab === 'review' && ev.confidenceLevel !== 'MEDIUM') return false;
    if (filterTab === 'unmatched' && ev.confidenceLevel !== 'UNMATCHED') return false;

    // Discipline filter
    if (disciplineFilter !== 'ALL' && ev.discipline !== disciplineFilter) return false;

    // Search filter
    if (searchTerm && !ev.activityDescription.toLowerCase().includes(searchTerm.toLowerCase())) return false;

    return true;
  });

  const handleApprove = (ev: ProgressEvent) => {
    const act = activities.find(a => a.id === ev.candidateActivityId);
    if (!act) return;

    const safety = ApprovalService.validate(ev, act, activities);
    if (safety.isOutOfSequence) {
      setActiveOutOfSeqTarget({ event: ev, act });
      return;
    }

    approveCandidateMatch(ev, act);
  };

  const handleConfirmOutOfSeq = (justification: string) => {
    if (!activeOutOfSeqTarget) return;
    approveCandidateMatch(activeOutOfSeqTarget.event, activeOutOfSeqTarget.act, justification);
    setActiveOutOfSeqTarget(null);
  };

  const handleProposeNew = () => {
    if (!proposingNewEvent || !newActivityDesc.trim()) return;
    proposeNewActivity(proposingNewEvent, newActivityDesc, newActivityDiscipline, newActivityLocation);
    setProposingNewEvent(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Planner Review & Exception Queue
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Human-in-the-loop decision gate: Verify matches, resolve ambiguous candidates, execute 1:N splits, and approve schedule mutations.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: `All (${progressEvents.length})` },
            { id: 'fast-track', label: `Fast-Track Eligible (${progressEvents.filter(e => e.confidenceLevel === 'HIGH').length})` },
            { id: 'review', label: `Review Required (${progressEvents.filter(e => e.confidenceLevel === 'MEDIUM').length})` },
            { id: 'unmatched', label: `Unmatched Scope (${progressEvents.filter(e => e.confidenceLevel === 'UNMATCHED').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`btn ${filterTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '5px 12px', fontSize: '12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Discipline & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
            className="input-field"
            style={{ width: 'auto', padding: '5px 10px', fontSize: '12px' }}
          >
            <option value="ALL">All Disciplines</option>
            <option value="PIPING">Piping</option>
            <option value="CIVIL">Civil</option>
            <option value="STATIC_EQUIP">Static Equipment</option>
            <option value="ROTATING_EQUIP">Rotating Equipment</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="INSTRUMENTATION">Instrumentation</option>
            <option value="HSE">HSE</option>
          </select>

          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
            <input
              type="text"
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search field event..."
              style={{ paddingLeft: '30px', width: '200px', fontSize: '12px' }}
            />
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="oil-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px' }}>Extracted Field Description</th>
              <th style={{ padding: '12px 16px' }}>Discipline & Date</th>
              <th style={{ padding: '12px 16px' }}>Candidate L5/L6 Activity</th>
              <th style={{ padding: '12px 16px' }}>Confidence</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(ev => {
              const candAct = activities.find(a => a.id === ev.candidateActivityId);
              const isApproved = ev.validationStatus === 'approved';

              return (
                <tr
                  key={ev.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isApproved ? 'rgba(16, 185, 129, 0.03)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = isApproved ? 'rgba(16, 185, 129, 0.03)' : 'transparent'}
                >
                  {/* Field Event */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ev.activityDescription}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {ev.quantity ? `${ev.quantity} ${ev.progressUnit} (${ev.progressValue}%)` : `${ev.progressValue}%`} | {ev.location}
                    </div>
                  </td>

                  {/* Discipline & Date */}
                  <td style={{ padding: '12px 16px' }}>
                    <div>{ev.discipline}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ev.actualStart}</div>
                  </td>

                  {/* Matched Activity */}
                  <td style={{ padding: '12px 16px' }}>
                    {candAct ? (
                      <div>
                        <strong style={{ color: 'var(--teal-accent)' }}>{candAct.activityCode}</strong>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{candAct.description}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#F87171', fontStyle: 'italic' }}>Unmapped / New Scope</span>
                    )}
                  </td>

                  {/* Confidence Pill */}
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${ev.confidenceLevel === 'HIGH' ? 'success' : ev.confidenceLevel === 'MEDIUM' ? 'warning' : 'danger'}`}>
                      {ev.confidenceScore}% {ev.confidenceLevel}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 16px' }}>
                    {isApproved ? (
                      <span className="badge badge-success">Approved & Synced</span>
                    ) : ev.validationStatus === 'new-activity-proposed' ? (
                      <span className="badge badge-info">Scope Proposed</span>
                    ) : (
                      <span className="badge badge-warning">Pending Review</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      {!isApproved && candAct && (
                        <button
                          onClick={() => handleApprove(ev)}
                          className="btn btn-success"
                          style={{ padding: '4px 8px', fontSize: '11.5px' }}
                          title="Approve match and mutate schedule"
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve</span>
                        </button>
                      )}

                      {!isApproved && (
                        <button
                          onClick={() => setActiveGranularityEvent(ev)}
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11.5px' }}
                          title="Split composite field work into 1:N activities"
                        >
                          <Sliders size={13} />
                          <span>Split 1:N</span>
                        </button>
                      )}

                      {ev.confidenceLevel === 'UNMATCHED' && !isApproved && (
                        <button
                          onClick={() => {
                            setProposingNewEvent(ev);
                            setNewActivityDesc(ev.activityDescription);
                          }}
                          className="btn btn-primary"
                          style={{ padding: '4px 8px', fontSize: '11.5px' }}
                          title="Propose as change order activity"
                        >
                          <PlusCircle size={13} />
                          <span>Propose Scope</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedEventId(ev.id);
                          setActiveView('link');
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11.5px' }}
                        title="Open in Schedule Linker"
                      >
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
            No records match the current filter criteria.
          </div>
        )}
      </div>

      {/* Out of Sequence Modal */}
      {activeOutOfSeqTarget && (
        <OutOfSequenceModal
          activity={activeOutOfSeqTarget.act}
          incompletePredecessors={activities.filter(a => activeOutOfSeqTarget.act.predecessorIds.includes(a.id) && a.percentComplete < 100)}
          onConfirm={handleConfirmOutOfSeq}
          onClose={() => setActiveOutOfSeqTarget(null)}
        />
      )}

      {/* 1:N Granularity Splitter Modal */}
      {activeGranularityEvent && (
        <GranularityModal
          event={activeGranularityEvent}
          activities={activities}
          onConfirm={(allocs, just) => {
            apply1ToNSplit(activeGranularityEvent, allocs, just);
            setActiveGranularityEvent(null);
          }}
          onClose={() => setActiveGranularityEvent(null)}
        />
      )}

      {/* Propose New Activity Modal */}
      {proposingNewEvent && (
        <div className="modal-overlay" onClick={() => setProposingNewEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Propose New Activity</h3>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Proposed Activity Description
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newActivityDesc}
                  onChange={(e) => setNewActivityDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Discipline
                  </label>
                  <select
                    className="input-field"
                    value={newActivityDiscipline}
                    onChange={(e) => setNewActivityDiscipline(e.target.value)}
                  >
                    <option value="CIVIL">CIVIL</option>
                    <option value="PIPING">PIPING</option>
                    <option value="ELECTRICAL">ELECTRICAL</option>
                    <option value="INSTRUMENTATION">INSTRUMENTATION</option>
                    <option value="HSE">HSE</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Location Zone
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newActivityLocation}
                    onChange={(e) => setNewActivityLocation(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                This record had low confidence (&lt;60%). Proposing it creates a provisional Level 6 activity under Proposed Activities for planner review and tracking.
              </div>
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setProposingNewEvent(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleProposeNew} className="btn btn-primary">
                Propose New Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
