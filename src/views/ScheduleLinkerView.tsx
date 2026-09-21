import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduleActivity, MatchCandidate } from '../types';
import { ApprovalService } from '../services/approvalService';
import { OutOfSequenceModal } from '../components/modals/OutOfSequenceModal';
import { GranularityModal } from '../components/modals/GranularityModal';
import { 
  GitMerge, 
  CheckCircle2, 
  Sliders, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  PlusCircle
} from 'lucide-react';

export const ScheduleLinkerView: React.FC = () => {
  const {
    activities,
    progressEvents,
    selectedEventId,
    setSelectedEventId,
    approveCandidateMatch,
    apply1ToNSplit,
    proposeNewActivity,
    setActiveView,
    getCandidatesForEvent
  } = useApp();

  const currentEvent = progressEvents.find(e => e.id === selectedEventId) || progressEvents[0];
  const candidates: MatchCandidate[] = currentEvent ? getCandidatesForEvent(currentEvent).slice(0, 3) : [];

  const [expandedCardId, setExpandedCardId] = useState<string | null>(candidates[0]?.id || null);
  const [outOfSequenceTarget, setOutOfSequenceTarget] = useState<ScheduleActivity | null>(null);
  const [showGranularityModal, setShowGranularityModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityDiscipline, setNewActivityDiscipline] = useState('PIPING');
  const [newActivityLocation, setNewActivityLocation] = useState('Process Area');
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  if (!currentEvent) {
    return (
      <div className="oil-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>No Event Selected for Linking</h3>
        <button onClick={() => setActiveView('extract')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Return to Extraction
        </button>
      </div>
    );
  }

  const handleApprove = (cand: MatchCandidate) => {
    const act = activities.find(a => a.id === cand.activityId);
    if (!act) return;

    // Check safety validation
    const safety = ApprovalService.validate(currentEvent, act, activities);
    if (safety.isOutOfSequence) {
      setOutOfSequenceTarget(act);
      return;
    }

    // Direct approval
    approveCandidateMatch(currentEvent, act);
    setApprovalFeedback(`Successfully approved ${act.activityCode} with ${cand.score}% confidence. Live schedule updated.`);
  };

  const handleConfirmOutOfSequence = (justification: string) => {
    if (!outOfSequenceTarget) return;
    approveCandidateMatch(currentEvent, outOfSequenceTarget, justification);
    setOutOfSequenceTarget(null);
    setApprovalFeedback(`Approved ${outOfSequenceTarget.activityCode} with out-of-sequence override justification logged.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Schedule Linker (6-Signal Matching)
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Transparent algorithmic alignment of field events to baseline Level 5/Level 6 Primavera activities.
          </p>
        </div>

        <button onClick={() => setActiveView('review')} className="btn btn-secondary">
          <span>Open Planner Review Queue</span>
        </button>
      </div>

      {/* Target Event Banner */}
      <div className="oil-card" style={{ background: 'var(--bg-surface)', borderLeft: '4px solid var(--teal-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-info">{currentEvent.discipline}</span>
            <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
              {currentEvent.activityDescription}
            </strong>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Execution Date: <strong>{currentEvent.actualStart}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
          <span>Reported Quantity: <strong style={{ color: 'var(--text-primary)' }}>{currentEvent.quantity ? `${currentEvent.quantity} ${currentEvent.progressUnit}` : 'N/A'}</strong></span>
          <span>Calculated Progress: <strong style={{ color: 'var(--teal-accent)' }}>{currentEvent.progressValue}%</strong></span>
          <span>Location: <strong style={{ color: 'var(--text-primary)' }}>{currentEvent.location}</strong></span>
          <span>Evidence: <em style={{ color: 'var(--text-primary)', background: 'var(--highlight-bg)', padding: '1px 4px', borderRadius: '3px' }}>"{currentEvent.evidenceSnippet.substring(0, 50)}..."</em></span>
        </div>
      </div>

      {/* Ambiguity Alert Banner if Top 1 and Top 2 have <10% gap */}
      {candidates[0]?.isAmbiguous && (
        <div style={{
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12.5px',
          color: 'var(--text-primary)'
        }}>
          <AlertTriangle size={18} color="var(--warning)" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: 'var(--warning)' }}>Ambiguous Candidates Detected (&lt;10% Score Gap): </strong>
            Score lead is only {candidates[1]?.scoreGapFromLeader}%. Fast-track approval disabled; planner review required.
          </div>
        </div>
      )}

      {/* Approval Feedback Toast */}
      {approvalFeedback && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10B981',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#34D399',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{approvalFeedback}</span>
          </div>
          <button onClick={() => setActiveView('schedule')} className="btn btn-success" style={{ padding: '4px 10px', fontSize: '11px' }}>
            Inspect on Live Gantt
          </button>
        </div>
      )}

      {/* Ranked Candidate Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700 }}>
          Ranked Candidate Activities ({candidates.length} Matches Found)
        </h2>

        {candidates.map((cand, idx) => {
          const act = activities.find(a => a.id === cand.activityId);
          const isExpanded = expandedCardId === cand.id;
          const isTopMatch = idx === 0;

          return (
            <div
              key={cand.id}
              className="oil-card"
              style={{
                border: isTopMatch ? '1px solid var(--teal-accent)' : '1px solid var(--border-subtle)',
                background: isTopMatch ? 'var(--teal-subtle)' : 'var(--bg-surface)'
              }}
            >
              {/* Main Card Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isTopMatch ? 'var(--teal-accent)' : 'var(--bg-surface-elevated)',
                    color: isTopMatch ? '#000' : 'var(--text-secondary)',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px'
                  }}>
                    #{idx + 1}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
                        {cand.activityCode}
                      </strong>
                      <span className="badge badge-neutral">Level {cand.level}</span>
                      {cand.isLevel6PriorityApplied && (
                        <span className="badge badge-info">Level 6 Priority Applied</span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {cand.description} | <span style={{ color: 'var(--text-muted)' }}>{act?.parentWbs}</span>
                    </div>
                  </div>
                </div>

                {/* Score Pill & Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {cand.score >= 85 ? 'Fast-Track Review Eligible' : cand.score >= 60 ? 'Planner Review Required' : 'Unmatched'}
                    </div>
                    <span className={`badge badge-${cand.score >= 85 ? 'success' : cand.score >= 60 ? 'warning' : 'danger'}`} style={{ fontSize: '13px', padding: '4px 10px' }}>
                      {cand.score}%
                    </span>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Requires planner confirmation
                    </div>
                  </div>

                  {cand.score >= 85 && !cand.isAmbiguous && (
                    <button
                      onClick={() => handleApprove(cand)}
                      className="btn btn-success"
                      style={{ padding: '6px 12px' }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Fast-Track Confirm</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowGranularityModal(true)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px' }}
                  >
                    <Sliders size={13} />
                    <span>Split 1:N</span>
                  </button>

                  <button
                    onClick={() => setExpandedCardId(isExpanded ? null : cand.id)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px' }}
                    title="Toggle score breakdown"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Text Explanation */}
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '8px' }}>
                <Sparkles size={13} color="var(--teal-accent)" style={{ display: 'inline', marginRight: '6px' }} />
                {cand.explanation}
              </div>

              {/* Expandable 6-Signal Score Breakdown */}
              {isExpanded && (
                <div style={{
                  marginTop: '14px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  background: 'var(--bg-surface-elevated)',
                  padding: '12px',
                  borderRadius: '6px'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>Text Similarity (30%)</span>
                      <strong>{cand.componentScores.textSimilarity}%</strong>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${cand.componentScores.textSimilarity}%`, height: '100%', background: 'var(--teal-accent)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>Discipline Fit (20%)</span>
                      <strong>{cand.componentScores.disciplineFit}%</strong>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${cand.componentScores.disciplineFit}%`, height: '100%', background: '#10B981' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>Location Fit (15%)</span>
                      <strong>{cand.componentScores.locationFit}%</strong>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${cand.componentScores.locationFit}%`, height: '100%', background: 'var(--teal-accent)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>WBS Alignment (15%)</span>
                      <strong>{cand.componentScores.wbsFit}%</strong>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${cand.componentScores.wbsFit}%`, height: '100%', background: 'var(--teal-accent)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>Date Plausibility (10%)</span>
                      <strong>{cand.componentScores.dateConsistency}%</strong>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${cand.componentScores.dateConsistency}%`, height: '100%', background: '#10B981' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                      <span>Synonym Match (10%)</span>
                      <strong>{cand.componentScores.terminologyMatch}%</strong>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${cand.componentScores.terminologyMatch}%`, height: '100%', background: '#A78BFA' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Unmatched / New Scope Action Box */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '6px'
        }}>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={15} color="var(--teal-accent)" />
              <span>Unmatched or Field Activity Not Present in Planned WBS?</span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
              Field execution is frequently more granular or represents ad-hoc work. Flag as a new scope activity for planner governance rather than silently dropping it.
            </p>
          </div>

          <button
            onClick={() => {
              setNewActivityDesc(currentEvent.activityDescription);
              setNewActivityDiscipline(currentEvent.discipline);
              setNewActivityLocation(currentEvent.location || 'Process Area');
              setShowProposeModal(true);
            }}
            className="btn btn-secondary"
            style={{ padding: '7px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusCircle size={14} />
            <span>Propose New Activity Node</span>
          </button>
        </div>
      </div>

      {/* Propose New Activity Modal */}
      {showProposeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="oil-card" style={{ maxWidth: '480px', width: '100%', background: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>
              Propose New Activity in Schedule WBS
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Create an official proposed activity entry linked to this field progress event for planner review.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Activity Description
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newActivityDesc}
                  onChange={(e) => setNewActivityDesc(e.target.value)}
                  style={{ width: '100%', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Discipline
                  </label>
                  <select
                    className="input-field"
                    value={newActivityDiscipline}
                    onChange={(e) => setNewActivityDiscipline(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {['CIVIL', 'PIPING', 'STATIC_EQUIP', 'ROTATING_EQUIP', 'ELECTRICAL', 'INSTRUMENTATION', 'HSE'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Location / Zone
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newActivityLocation}
                    onChange={(e) => setNewActivityLocation(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  onClick={() => setShowProposeModal(false)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    proposeNewActivity(currentEvent, newActivityDesc, newActivityDiscipline, newActivityLocation);
                    setShowProposeModal(false);
                    setApprovalFeedback(`Created proposed new activity: "${newActivityDesc}". Queued in live schedule.`);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '6px 14px' }}
                  disabled={!newActivityDesc.trim()}
                >
                  Confirm & Propose
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Out of Sequence Modal */}
      {outOfSequenceTarget && (
        <OutOfSequenceModal
          activity={outOfSequenceTarget}
          incompletePredecessors={activities.filter(a => outOfSequenceTarget.predecessorIds.includes(a.id) && a.percentComplete < 100)}
          onConfirm={handleConfirmOutOfSequence}
          onClose={() => setOutOfSequenceTarget(null)}
        />
      )}

      {/* 1:N Granularity Splitter Modal */}
      {showGranularityModal && (
        <GranularityModal
          event={currentEvent}
          activities={activities}
          onConfirm={(allocs, just) => {
            apply1ToNSplit(currentEvent, allocs, just);
            setShowGranularityModal(false);
            setApprovalFeedback(`Successfully split event into ${allocs.length} activities with 1:N allocation.`);
          }}
          onClose={() => setShowGranularityModal(false)}
        />
      )}
    </div>
  );
};
