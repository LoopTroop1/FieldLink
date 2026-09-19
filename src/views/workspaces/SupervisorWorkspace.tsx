import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimeAgentView } from '../TimeAgentView';
import { DataIngestionView } from '../DataIngestionView';
import { 
  HardHat, 
  Bot, 
  FileInput, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Workflow, 
  Sparkles,
  Users,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

export const SupervisorWorkspace: React.FC = () => {
  const { 
    currentUser, 
    progressEvents, 
    fieldRecords, 
    ingestNewRecord, 
    addRoleHandoff,
    setActiveView,
    switchRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'agent' | 'dpr-submit' | 'status' | 'ingestion'>('agent');
  
  // Form state for quick DPR submission to Planner
  const [dprText, setDprText] = useState('');
  const [dprQuantity, setDprQuantity] = useState('18');
  const [dprUnit, setDprUnit] = useState('joints');
  const [dprLocation, setDprLocation] = useState('Area B (Line 24-XX)');
  const [dprDiscipline, setDprDiscipline] = useState<any>('PIPING');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter records and events submitted by supervisor
  const supervisorEvents = progressEvents.slice(0, 5);

  const handleQuickSubmitToPlanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dprText.trim()) return;

    // 1. Ingest as raw field record
    const newRecord = ingestNewRecord({
      sourceType: 'report',
      sourceName: `DPR_AreaB_Shift_${new Date().toISOString().split('T')[0]}.txt`,
      submittedBy: currentUser.name,
      discipline: dprDiscipline,
      sourceDateText: new Date().toISOString().split('T')[0],
      rawText: `${dprLocation}: Completed ${dprQuantity} ${dprUnit}. ${dprText}`
    });

    // 2. Dispatch cross-tier handoff to Lead Planner
    addRoleHandoff({
      fromRole: 'L5 Supervisor',
      fromName: currentUser.name,
      toRole: 'L3 Planner',
      toName: 'Rajiv Sen',
      action: `Dispatched Daily Field Progress Log (${dprQuantity} ${dprUnit} in ${dprLocation})`,
      activityCode: 'PIP-L6-024A',
      activityName: 'Line 24-XX Field Progress',
      status: 'submitted',
      note: dprText
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setDprText('');
    }, 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Role Connection Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
        border: '1.5px solid rgba(16, 185, 129, 0.35)',
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
                background: '#10B981',
                color: '#0F172A',
                fontWeight: 800,
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.8px'
              }}>
                LEVEL 5 WORKSPACE
              </span>
              <span style={{ fontSize: '12px', color: '#6EE7B7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <HardHat size={14} />
                Frontline Field Execution Directorate
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
              Field Execution Console — Supervisor {currentUser.name}
            </h1>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '800px', lineHeight: 1.5 }}>
              Frontline actuals capture layer. Direct voice, WhatsApp audio, and daily progress logs are automatically transcribed, parsed, and submitted upstream to the <strong>Lead Planning Engineer</strong> for schedule linking.
            </p>
          </div>

          {/* Upstream Reporting Connection Pill */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '12px 16px',
            minWidth: '280px',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
              Active Coordination Channels
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#38BDF8', marginBottom: '3px' }}>
              <span>Reports Upstream To:</span>
              <strong style={{ color: '#fff' }}>Rajiv Sen (L3 Lead Planner)</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Technical Endorsement:</span>
              <strong style={{ color: '#F59E0B' }}>Vikram Patel (L4 Eng)</strong>
            </div>
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => switchRole('L3 Planner')}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38BDF8',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Switch to Planner View (L3)</span>
                <ArrowRight size={12} />
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
          borderTop: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Shift Logs Captured</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{fieldRecords.length} Records</div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pending Planner Link</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B' }}>2 In Queue</div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Approved into Schedule</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>{progressEvents.filter(e => e.validationStatus === 'approved').length} Linked</div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Active Crew on Site</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8' }}>14 Welders & Fitters</div>
          </div>
        </div>
      </div>

      {/* Primary Supervisor Workspace Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('agent')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'agent' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'agent' ? '#10B981' : 'var(--text-secondary)',
            borderBottom: activeTab === 'agent' ? '3px solid #10B981' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <Bot size={16} />
          <span>WhatsApp Time Agent (Voice & Chat)</span>
        </button>

        <button
          onClick={() => setActiveTab('dpr-submit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'dpr-submit' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'dpr-submit' ? '#10B981' : 'var(--text-secondary)',
            borderBottom: activeTab === 'dpr-submit' ? '3px solid #10B981' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <Send size={16} />
          <span>Direct Dispatch to Lead Planner</span>
        </button>

        <button
          onClick={() => setActiveTab('status')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'status' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'status' ? '#10B981' : 'var(--text-secondary)',
            borderBottom: activeTab === 'status' ? '3px solid #10B981' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <Workflow size={16} />
          <span>My Submissions in P6 Schedule ({progressEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ingestion')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'ingestion' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'ingestion' ? '#10B981' : 'var(--text-secondary)',
            borderBottom: activeTab === 'ingestion' ? '3px solid #10B981' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <FileInput size={16} />
          <span>Multi-Format Ingestion Hub</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'agent' && (
        <div>
          <TimeAgentView />
        </div>
      )}

      {activeTab === 'dpr-submit' && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Submit Frontline DPR Directly to Lead Planner Rajiv Sen
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Submitting creates an immutable field record and dispatches a high-priority handoff notification directly to the Planner review queue.
              </p>
            </div>
            <span className="badge badge-success" style={{ fontSize: '11px', padding: '4px 10px' }}>
              Target: Planner Rajiv Sen (L3)
            </span>
          </div>

          {submitSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#34D399'
            }}>
              <CheckCircle2 size={18} />
              <div style={{ fontSize: '12.5px' }}>
                <strong>Progress Dispatched!</strong> Your field log has been normalized and sent to Lead Planner Rajiv Sen. You can now switch to the Planner role to review and link it to the Level 6 P6 schedule!
              </div>
            </div>
          )}

          <form onSubmit={handleQuickSubmitToPlanner} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Execution Area & Target Line:
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={dprLocation}
                  onChange={(e) => setDprLocation(e.target.value)}
                  placeholder="e.g. Area B (Line 24-XX)"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Physical Quantity Executed:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    className="input-field"
                    value={dprQuantity}
                    onChange={(e) => setDprQuantity(e.target.value)}
                    required
                    style={{ width: '100px' }}
                  />
                  <input
                    type="text"
                    className="input-field"
                    value={dprUnit}
                    onChange={(e) => setDprUnit(e.target.value)}
                    placeholder="joints, meters, m3"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Engineering Discipline:
                </label>
                <select
                  className="input-field"
                  value={dprDiscipline}
                  onChange={(e) => setDprDiscipline(e.target.value)}
                >
                  <option value="PIPING">Piping Execution</option>
                  <option value="CIVIL">Civil & Foundations</option>
                  <option value="ELECTRICAL">Electrical & Cabling</option>
                  <option value="STATIC_EQUIP">Static Equipment</option>
                  <option value="ROTATING_EQUIP">Rotating Equipment</option>
                  <option value="INSTRUMENTATION">Instrumentation</option>
                  <option value="HSE">HSE & Safety</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Shift Diary Entry & Contractor Notes:
              </label>
              <textarea
                className="input-field"
                rows={4}
                value={dprText}
                onChange={(e) => setDprText(e.target.value)}
                placeholder="e.g. Day shift crew of 6 welders completed joint fit-up on Line 24-XX spool B-12. NDT inspection cleared. Predecessor civil foundation is ready."
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                FieldLink AI will auto-extract structured progress and compute initial confidence score for the Planner.
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '10px 22px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Send size={15} />
                <span>Submit to Planner (Rajiv Sen)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'status' && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Live Lineage: Supervisor Submissions ➔ P6 Primavera Schedule
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Track how your field logs are verified by the Discipline Engineer, approved by the Lead Planner, and synchronized to the enterprise schedule.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {supervisorEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {evt.activityDescription}
                    </span>
                    <span className="badge badge-info" style={{ fontSize: '10px' }}>
                      {evt.discipline}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      • Date: {evt.statusDate || '2026-09-12'}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Quantity: <strong>{evt.quantity || evt.impliedQuantity || 18} {evt.progressUnit || 'units'}</strong> ({evt.progressValue}% physical progress) in <strong>{evt.location}</strong>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Snippet: "{evt.evidenceSnippet}"
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Approval Status</div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: evt.validationStatus === 'approved' ? '#10B981' : '#F59E0B',
                      background: evt.validationStatus === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${evt.validationStatus === 'approved' ? '#10B981' : '#F59E0B'}40`
                    }}>
                      {evt.validationStatus === 'approved' ? 'Approved by Planner' : 'Under Planner Review'}
                    </span>
                  </div>

                  <button
                    onClick={() => switchRole('L3 Planner')}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>View in Planner</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ingestion' && (
        <div>
          <DataIngestionView />
        </div>
      )}
    </div>
  );
};
