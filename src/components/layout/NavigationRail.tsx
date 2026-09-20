import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileInput,
  ScanText,
  GitMerge,
  Inbox,
  Bot,
  CalendarDays,
  LineChart,
  Brain,
  History,
  Settings,
  Sparkles,
  HardHat,
  Wrench,
  Briefcase,
  BarChart3,
  Crown,
  ClipboardList,
  Send,
  FileCheck2,
  Gauge,
  ShieldCheck,
  Layers,
  AlertTriangle,
  BarChart,
  RefreshCcw
} from 'lucide-react';

interface RoleNavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeType?: 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
}

interface RoleNavGroup {
  title: string;
  items: RoleNavItem[];
}

export const NavigationRail: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    progressEvents, 
    fieldRecords, 
    currentUser
  } = useApp();

  const pendingReviewCount = progressEvents.filter(e => e.validationStatus === 'pending').length;
  const userLevel = currentUser.level || 3;

  // ============================================================
  // STRICT ROLE-BASED NAV ITEMS -- each role sees ONLY its items
  // ============================================================
  const getRoleNavGroups = (): RoleNavGroup[] => {
    switch (userLevel) {
      case 5: // L5 Supervisor
        return [
          {
            title: 'FIELD EXECUTION',
            items: [
              {
                id: 'supervisor-workspace',
                label: 'My Field Console',
                icon: <HardHat size={17} />,
                badge: 'Live',
                badgeType: 'info'
              },
              {
                id: 'time-agent',
                label: 'Voice & Time Agent',
                icon: <Bot size={17} />,
                badge: 'Active',
                badgeType: 'info'
              },
              {
                id: 'ingestion',
                label: 'Submit Shift DPR',
                icon: <Send size={17} />,
                badge: fieldRecords.length,
                badgeType: 'neutral'
              }
            ]
          },
          {
            title: 'MY SUBMISSIONS',
            items: [
              {
                id: 'review',
                label: 'Submission Status',
                icon: <FileCheck2 size={17} />,
                badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
                badgeType: 'warning'
              }
            ]
          }
        ];

      case 4: // L4 Discipline Engineer
        return [
          {
            title: 'ENGINEERING CONSOLE',
            items: [
              {
                id: 'engineer-workspace',
                label: 'My Engineering Console',
                icon: <Wrench size={17} />,
                badge: 'Live',
                badgeType: 'info'
              },
              {
                id: 'extraction',
                label: 'Extraction & Validation',
                icon: <ScanText size={17} />
              },
              {
                id: 'ingestion',
                label: 'Incoming Field Data',
                icon: <FileInput size={17} />,
                badge: fieldRecords.length,
                badgeType: 'neutral'
              }
            ]
          },
          {
            title: 'TECHNICAL REVIEW',
            items: [
              {
                id: 'review',
                label: 'Endorsement Queue',
                icon: <ShieldCheck size={17} />,
                badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
                badgeType: 'warning'
              }
            ]
          }
        ];

      case 3: // L3 Lead Planner
        return [
          {
            title: 'PLANNING CONSOLE',
            items: [
              {
                id: 'planner-workspace',
                label: 'My Planning Console',
                icon: <Briefcase size={17} />,
                badge: 'Live',
                badgeType: 'info'
              },
              {
                id: 'review',
                label: 'Incoming Supervisor Feed',
                icon: <Inbox size={17} />,
                badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
                badgeType: pendingReviewCount > 0 ? 'danger' : 'neutral'
              },
              {
                id: 'linker',
                label: '6-Signal Schedule Linker',
                icon: <GitMerge size={17} />,
                badge: '6-Signal',
                badgeType: 'info'
              }
            ]
          },
          {
            title: 'SCHEDULE VIEWS',
            items: [
              {
                id: 'schedule',
                label: 'Level 5/6 Gantt Chart',
                icon: <CalendarDays size={17} />
              },
              {
                id: 'extraction',
                label: 'Extraction Workspace',
                icon: <ScanText size={17} />
              }
            ]
          }
        ];

      case 2: // L2 Project Controls Manager
        return [
          {
            title: 'CONTROLS CONSOLE',
            items: [
              {
                id: 'pm-workspace',
                label: 'My Controls Console',
                icon: <BarChart3 size={17} />,
                badge: 'Live',
                badgeType: 'info'
              },
              {
                id: 'overview',
                label: 'Operations Overview & EVM',
                icon: <LayoutDashboard size={17} />
              },
              {
                id: 'analytics',
                label: 'S-Curves & What-If',
                icon: <LineChart size={17} />
              }
            ]
          },
          {
            title: 'GOVERNANCE',
            items: [
              {
                id: 'schedule',
                label: 'P6 PMIS Sync Gateway',
                icon: <RefreshCcw size={17} />
              },
              {
                id: 'audit',
                label: 'Audit Trail',
                icon: <History size={17} />
              }
            ]
          }
        ];

      case 1: // L1 Executive Project Director
        return [
          {
            title: 'EXECUTIVE COCKPIT',
            items: [
              {
                id: 'director-workspace',
                label: 'My Executive Cockpit',
                icon: <Crown size={17} />,
                badge: 'Live',
                badgeType: 'info'
              },
              {
                id: 'overview',
                label: 'Portfolio Overview',
                icon: <Gauge size={17} />
              },
              {
                id: 'memory',
                label: 'Project Memory & Benchmarks',
                icon: <Brain size={17} />
              }
            ]
          },
          {
            title: 'GOVERNANCE',
            items: [
              {
                id: 'analytics',
                label: 'Program Analytics',
                icon: <LineChart size={17} />
              },
              {
                id: 'audit',
                label: 'Audit Trail',
                icon: <History size={17} />
              }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const navGroups = getRoleNavGroups();

  // Role workspace config for the hero card at the top
  const roleConfig: Record<number, {
    title: string;
    subtitle: string;
    color: string;
    levelCode: string;
  }> = {
    5: { title: 'Supervisor', subtitle: 'Frontline Execution', color: '#D41414', levelCode: 'L5' },
    4: { title: 'Discipline Engineer', subtitle: 'Technical Validation', color: '#E19B8B', levelCode: 'L4' },
    3: { title: 'Lead Planner', subtitle: 'Schedule Intelligence', color: '#6C3AED', levelCode: 'L3' },
    2: { title: 'Project Controls', subtitle: 'Earned Value & Sync', color: '#8B5CF6', levelCode: 'L2' },
    1: { title: 'Project Director', subtitle: 'Executive Governance', color: '#310A69', levelCode: 'L1' }
  };

  const config = roleConfig[userLevel] || roleConfig[3];

  return (
    <nav style={{
      width: 'var(--nav-width)',
      height: 'calc(100vh - var(--topbar-height))',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '18px 12px',
      overflowY: 'auto'
    }}>
      <div>
        {/* Role Identity Card */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            background: `linear-gradient(135deg, ${config.color}18 0%, ${config.color}08 100%)`,
            border: `1.5px solid ${config.color}40`,
            borderRadius: '10px',
            padding: '14px 14px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative gradient line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'var(--brand-gradient)'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 800,
                letterSpacing: '1px',
                color: 'var(--text-muted)',
                textTransform: 'uppercase'
              }}>
                ACTIVE ROLE
              </span>
              <span style={{
                background: config.color,
                color: '#FFFFFF',
                fontSize: '9px',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {config.levelCode}
              </span>
            </div>

            <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '2px' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '11px', color: config.color, fontWeight: 600 }}>
              {config.title}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {config.subtitle}
            </div>

            {currentUser.reportsTo && (
              <div style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: `1px solid ${config.color}20`,
                fontSize: '10.5px',
                color: 'var(--text-secondary)'
              }}>
                Reports to: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.reportsTo}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Role-Specific Navigation Groups */}
        {navGroups.map(group => (
          <div key={group.title} style={{ marginBottom: '22px' }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 800,
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              padding: '0 10px 8px 10px',
              textTransform: 'uppercase'
            }}>
              {group.title}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {group.items.map(item => {
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: 'var(--btn-radius)',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive
                        ? 'var(--accent-primary-subtle)'
                        : 'transparent',
                      borderLeft: isActive
                        ? '3px solid var(--accent-primary)'
                        : '3px solid transparent',
                      borderTop: '1px solid transparent',
                      borderRight: '1px solid transparent',
                      borderBottom: '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--bg-surface-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`badge badge-${item.badgeType || 'neutral'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Settings + Engine Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => setActiveView('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: 'var(--btn-radius)',
            fontSize: '12px',
            fontWeight: 500,
            color: activeView === 'settings' ? 'var(--text-primary)' : 'var(--text-muted)',
            background: activeView === 'settings' ? 'var(--accent-primary-subtle)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%'
          }}
        >
          <Settings size={15} />
          <span>Settings & Dictionary</span>
        </button>

        <div style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--btn-radius)',
          padding: '10px 12px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '2px' }}>
            <Sparkles size={13} />
            <span>Deterministic Engine</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px', lineHeight: 1.35 }}>
            6-Signal Linking | Air-Gapped Operation
          </div>
        </div>
      </div>
    </nav>
  );
};
