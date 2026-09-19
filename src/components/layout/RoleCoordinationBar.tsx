import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, DEMO_USERS, RoleHandoffItem } from '../../types';
import { 
  Network, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X, 
  Briefcase, 
  HardHat, 
  Wrench, 
  BarChart3, 
  Crown,
  Layers,
  Sparkles,
  Send,
  Workflow
} from 'lucide-react';

export const RoleCoordinationBar: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    roleHandoffs, 
    addRoleHandoff, 
    isRoleCoordinationOpen, 
    toggleRoleCoordination,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'handoffs'>('pipeline');
  const [newHandoffNote, setNewHandoffNote] = useState<string>('');
  const [selectedTargetRole, setSelectedTargetRole] = useState<UserRole>('L3 Planner');

  if (!isRoleCoordinationOpen) return null;

  const tiers: Array<{
    role: UserRole;
    levelNum: number;
    code: 'L5' | 'L4' | 'L3' | 'L2' | 'L1';
    icon: React.ReactNode;
    color: string;
    bg: string;
    focus: string;
    primaryView: string;
    viewId: any;
  }> = [
    {
      role: 'L5 Supervisor',
      levelNum: 5,
      code: 'L5',
      icon: <HardHat size={15} color="#10B981" />,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.12)',
      focus: 'Frontline Capture & Shift DPR',
      primaryView: 'Time Agent & DPR Hub',
      viewId: 'time-agent'
    },
    {
      role: 'L4 Discipline Engineer',
      levelNum: 4,
      code: 'L4',
      icon: <Wrench size={15} color="#F59E0B" />,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.12)',
      focus: 'Technical Attributes & Spec Validation',
      primaryView: 'Extraction Workspace',
      viewId: 'extraction'
    },
    {
      role: 'L3 Planner',
      levelNum: 3,
      code: 'L3',
      icon: <Briefcase size={15} color="#0EA5E9" />,
      color: '#0EA5E9',
      bg: 'rgba(14, 165, 233, 0.12)',
      focus: '6-Signal Linking & WBS Gating',
      primaryView: 'Review Queue & Gantt',
      viewId: 'review'
    },
    {
      role: 'L2 Project Manager',
      levelNum: 2,
      code: 'L2',
      icon: <BarChart3 size={15} color="#8B5CF6" />,
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.12)',
      focus: 'Earned Value & What-If Ripples',
      primaryView: 'Operations Overview',
      viewId: 'overview'
    },
    {
      role: 'L1 Project Director',
      levelNum: 1,
      code: 'L1',
      icon: <Crown size={15} color="#EC4899" />,
      color: '#EC4899',
      bg: 'rgba(236, 72, 153, 0.12)',
      focus: 'Portfolio Governance & Benchmark Memory',
      primaryView: 'Project Memory & KPIs',
      viewId: 'memory'
    }
  ];

  const handleSendHandoff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandoffNote.trim()) return;

    const targetUser = DEMO_USERS[selectedTargetRole];
    addRoleHandoff({
      fromRole: currentUser.role,
      fromName: currentUser.name,
      toRole: selectedTargetRole,
      toName: targetUser.name,
      action: `Cross-Tier Notification & Endorsement Request from ${currentUser.role}`,
      activityCode: 'PIP-L6-024A',
      activityName: 'Line 24-XX Segment Execution',
      status: 'submitted',
      note: newHandoffNote
    });

    setNewHandoffNote('');
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderBottom: '2px solid var(--border-subtle)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
      position: 'relative',
      zIndex: 45,
      transition: 'all 0.25s ease'
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 24px',
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--teal-accent)',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            <Workflow size={15} />
            <span>5-TIER ROLE COORDINATION & HANDOFF PIPELINE (L1 – L5)</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>
            Active Session: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('pipeline')}
              style={{
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '4px',
                background: activeTab === 'pipeline' ? 'var(--teal-accent)' : 'transparent',
                color: activeTab === 'pipeline' ? '#0F172A' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Role Hierarchy Chain
            </button>
            <button
              onClick={() => setActiveTab('handoffs')}
              style={{
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '4px',
                background: activeTab === 'handoffs' ? 'var(--teal-accent)' : 'transparent',
                color: activeTab === 'handoffs' ? '#0F172A' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Handoff Stream ({roleHandoffs.length})
            </button>
          </div>

          <button
            onClick={toggleRoleCoordination}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
            title="Collapse Role Coordination Bar"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '14px 24px' }}>
        {activeTab === 'pipeline' ? (
          <div>
            {/* Visual 5-Tier Interactive Chain */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '12px',
              marginBottom: '14px'
            }}>
              {tiers.map((tier, idx) => {
                const isCurrent = currentUser.level === tier.levelNum;
                const user = DEMO_USERS[tier.role];

                return (
                  <div
                    key={tier.code}
                    onClick={() => switchRole(tier.role)}
                    style={{
                      background: isCurrent ? tier.bg : 'var(--bg-base)',
                      border: `1.5px solid ${isCurrent ? tier.color : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      boxShadow: isCurrent ? `0 0 15px ${tier.color}30` : 'none'
                    }}
                  >
                    {/* Header: Tier Code & Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: '#fff',
                          background: tier.color,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          letterSpacing: '0.5px'
                        }}>
                          {tier.code}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {tier.role.replace(/^L\d\s*/, '')}
                        </span>
                      </div>

                      {isCurrent && (
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          color: tier.color,
                          background: `${tier.color}25`,
                          padding: '1px 5px',
                          borderRadius: '3px',
                          border: `1px solid ${tier.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: tier.color }} />
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Officer Details */}
                    <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '2px' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: 1.3 }}>
                      {tier.focus}
                    </div>

                    {/* Primary Workspace Link */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '10px',
                      color: isCurrent ? tier.color : 'var(--text-muted)'
                    }}>
                      <span>Interface: <strong>{tier.primaryView}</strong></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          switchRole(tier.role);
                          setActiveView(tier.viewId);
                        }}
                        style={{
                          background: isCurrent ? tier.color : 'transparent',
                          color: isCurrent ? '#0F172A' : 'var(--text-secondary)',
                          border: `1px solid ${isCurrent ? tier.color : 'var(--border-subtle)'}`,
                          borderRadius: '3px',
                          padding: '2px 5px',
                          fontSize: '9.5px',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                        title={`Jump to ${tier.role}'s primary view`}
                      >
                        {isCurrent ? 'Open View' : 'Switch & Open'}
                      </button>
                    </div>

                    {/* Flow arrow connecting tiers (except last) */}
                    {idx < tiers.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        right: '-11px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        color: 'var(--text-muted)',
                        background: 'var(--bg-surface)',
                        borderRadius: '50%',
                        padding: '1px',
                        display: 'none' // Hidden in grid, rendered visually via sequence
                      }}>
                        <ArrowRight size={10} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Role Relationship Context Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
              gap: '12px',
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '11px'
            }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                  Current Operational Scope
                </div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {currentUser.responsibilities}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={12} color="#38BDF8" />
                  <span>Direct Reporting Line (Upstream)</span>
                </div>
                <div style={{ color: '#38BDF8', fontWeight: 600 }}>
                  {currentUser.reportsTo || 'Executive Board'}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowDownLeft size={12} color="#34D399" />
                  <span>Supervises & Directs (Downstream)</span>
                </div>
                <div style={{ color: '#34D399', fontWeight: 600 }}>
                  {currentUser.supervises || 'Frontline Field Personnel'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Demo Tip:</span>
                <span style={{
                  fontSize: '10.5px',
                  color: 'var(--teal-accent)',
                  background: 'var(--teal-subtle)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(14, 165, 233, 0.25)'
                }}>
                  Click any tier above to instantly simulate their view & role authority.
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Handoff Stream & Quick Message Dispatch */
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            {/* Left: Stream of Handoffs */}
            <div style={{
              maxHeight: '160px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              paddingRight: '6px'
            }}>
              {roleHandoffs.map((item) => {
                const statusColor = item.status === 'approved' || item.status === 'synced' 
                  ? '#10B981' 
                  : (item.status === 'endorsed' ? '#38BDF8' : '#F59E0B');

                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-base)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                        <span style={{ color: 'var(--text-primary)' }}>{item.fromRole}</span>
                        <ArrowRight size={11} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-primary)' }}>{item.toRole}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '10px' }}>• {item.timestamp}</span>
                      </div>
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: statusColor,
                        background: `${statusColor}18`,
                        padding: '1px 6px',
                        borderRadius: '3px',
                        border: `1px solid ${statusColor}40`
                      }}>
                        {item.status}
                      </span>
                    </div>

                    <div style={{ color: 'var(--text-secondary)' }}>
                      <strong>{item.activityCode}</strong>: {item.action}
                    </div>

                    {item.note && (
                      <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontStyle: 'italic' }}>
                        "{item.note}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Quick Handoff Dispatch Form */}
            <form onSubmit={handleSendHandoff} style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '8px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={12} color="var(--teal-accent)" />
                <span>Send Cross-Tier Work Package</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Target Role:
                </label>
                <select
                  value={selectedTargetRole}
                  onChange={(e) => setSelectedTargetRole(e.target.value as UserRole)}
                  className="input-field"
                  style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}
                >
                  {tiers.map(t => (
                    <option key={t.role} value={t.role}>
                      {t.code} — {t.role.replace(/^L\d\s*/, '')} ({DEMO_USERS[t.role].name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Handoff Note / Variance Explanation:
                </label>
                <input
                  type="text"
                  value={newHandoffNote}
                  onChange={(e) => setNewHandoffNote(e.target.value)}
                  placeholder="e.g. Verified joint alignment; ready for P6 schedule linking."
                  className="input-field"
                  style={{ padding: '4px 8px', fontSize: '11px', height: 'auto' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                disabled={!newHandoffNote.trim()}
              >
                <Send size={11} />
                <span>Dispatch Handoff Record</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
