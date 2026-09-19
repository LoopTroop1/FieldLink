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
  Workflow,
  ArrowUpRight,
  HardHat,
  Wrench,
  Briefcase,
  BarChart3,
  Crown
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
  group: 'OPERATIONS' | 'SCHEDULE INTELLIGENCE' | 'INSIGHTS & GOVERNANCE';
  badge?: string | number;
  badgeType?: 'warning' | 'danger' | 'info' | 'neutral' | 'primary';
}

export const NavigationRail: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    progressEvents, 
    fieldRecords, 
    currentUser,
    toggleRoleCoordination
  } = useApp();

  // Count pending reviews
  const pendingReviewCount = progressEvents.filter(e => e.validationStatus === 'pending').length;
  const unmatchedCount = progressEvents.filter(e => e.confidenceLevel === 'UNMATCHED').length;

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Operations Overview',
      icon: <LayoutDashboard size={17} />,
      group: 'OPERATIONS'
    },
    {
      id: 'ingestion',
      label: 'Data Ingestion Hub',
      icon: <FileInput size={17} />,
      group: 'OPERATIONS',
      badge: fieldRecords.length,
      badgeType: 'neutral'
    },
    {
      id: 'extraction',
      label: 'Extraction Workspace',
      icon: <ScanText size={17} />,
      group: 'OPERATIONS'
    },
    {
      id: 'linker',
      label: 'Schedule Linker',
      icon: <GitMerge size={17} />,
      group: 'SCHEDULE INTELLIGENCE',
      badge: '6-Signal',
      badgeType: 'info'
    },
    {
      id: 'review',
      label: 'Planner Review Queue',
      icon: <Inbox size={17} />,
      group: 'SCHEDULE INTELLIGENCE',
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
      badgeType: unmatchedCount > 0 ? 'danger' : 'warning'
    },
    {
      id: 'time-agent',
      label: 'Time Agent (Supervisor)',
      icon: <Bot size={17} />,
      group: 'SCHEDULE INTELLIGENCE',
      badge: 'Live',
      badgeType: 'info'
    },
    {
      id: 'schedule',
      label: 'Live Schedule & Gantt',
      icon: <CalendarDays size={17} />,
      group: 'SCHEDULE INTELLIGENCE'
    },
    {
      id: 'analytics',
      label: 'Analytics & Forecast',
      icon: <LineChart size={17} />,
      group: 'INSIGHTS & GOVERNANCE'
    },
    {
      id: 'memory',
      label: 'Project Memory',
      icon: <Brain size={17} />,
      group: 'INSIGHTS & GOVERNANCE'
    },
    {
      id: 'audit',
      label: 'Append-Only Audit Trail',
      icon: <History size={17} />,
      group: 'INSIGHTS & GOVERNANCE'
    },
    {
      id: 'settings',
      label: 'Settings & Dictionary',
      icon: <Settings size={17} />,
      group: 'INSIGHTS & GOVERNANCE'
    }
  ];

  const groups: Array<'OPERATIONS' | 'SCHEDULE INTELLIGENCE' | 'INSIGHTS & GOVERNANCE'> = [
    'OPERATIONS',
    'SCHEDULE INTELLIGENCE',
    'INSIGHTS & GOVERNANCE'
  ];

  const rolePrimaryViews: Record<number, AppView[]> = {
    5: ['time-agent', 'ingestion'],
    4: ['extraction', 'linker'],
    3: ['review', 'linker', 'schedule'],
    2: ['overview', 'analytics', 'audit'],
    1: ['memory', 'overview', 'analytics']
  };

  const userLevel = currentUser.level || 3;
  const primaryForCurrent = rolePrimaryViews[userLevel] || [];
  const roleWorkspaceConfig: Record<number, {
    viewId: AppView;
    title: string;
    icon: React.ReactNode;
    color: string;
    levelCode: string;
  }> = {
    5: {
      viewId: 'supervisor-workspace',
      title: 'Supervisor Field Console',
      icon: <HardHat size={17} color="#10B981" />,
      color: '#10B981',
      levelCode: 'L5'
    },
    4: {
      viewId: 'engineer-workspace',
      title: 'Discipline Engineering Console',
      icon: <Wrench size={17} color="#F59E0B" />,
      color: '#F59E0B',
      levelCode: 'L4'
    },
    3: {
      viewId: 'planner-workspace',
      title: 'Lead Planner Console',
      icon: <Briefcase size={17} color="#0EA5E9" />,
      color: '#0EA5E9',
      levelCode: 'L3'
    },
    2: {
      viewId: 'pm-workspace',
      title: 'Project Controls Console',
      icon: <BarChart3 size={17} color="#8B5CF6" />,
      color: '#8B5CF6',
      levelCode: 'L2'
    },
    1: {
      viewId: 'director-workspace',
      title: 'Executive Portfolio Cockpit',
      icon: <Crown size={17} color="#EC4899" />,
      color: '#EC4899',
      levelCode: 'L1'
    }
  };

  const currentWorkspace = roleWorkspaceConfig[userLevel] || roleWorkspaceConfig[3];
  const isWorkspaceActive = activeView === currentWorkspace.viewId;

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
        {/* Top: Active Assigned Role Workspace */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: '0.9px',
            padding: '0 10px 6px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>ASSIGNED ROLE WORKSPACE</span>
            <span style={{
              background: currentWorkspace.color,
              color: '#0F172A',
              fontSize: '9px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '3px'
            }}>
              {currentWorkspace.levelCode}
            </span>
          </div>

          <button
            onClick={() => setActiveView(currentWorkspace.viewId)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              color: isWorkspaceActive ? '#fff' : 'var(--text-primary)',
              background: isWorkspaceActive 
                ? `linear-gradient(135deg, ${currentWorkspace.color}30 0%, ${currentWorkspace.color}15 100%)` 
                : 'var(--bg-base)',
              border: `1.5px solid ${isWorkspaceActive ? currentWorkspace.color : 'var(--border-subtle)'}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
              boxShadow: isWorkspaceActive ? `0 0 12px ${currentWorkspace.color}25` : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {currentWorkspace.icon}
              </span>
              <span>{currentWorkspace.title}</span>
            </div>

            <span style={{
              fontSize: '9px',
              fontWeight: 800,
              color: currentWorkspace.color,
              background: `${currentWorkspace.color}20`,
              padding: '2px 5px',
              borderRadius: '4px',
              border: `1px solid ${currentWorkspace.color}40`
            }}>
              LIVE
            </span>
          </button>
        </div>

        {groups.map(grp => (
          <div key={grp} style={{ marginBottom: '22px' }}>
            <div style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.9px',
              padding: '0 10px 8px 10px'
            }}>
              {grp}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {navItems.filter(i => i.group === grp).map(item => {
                const isActive = activeView === item.id;
                const isPrimaryForRole = primaryForCurrent.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--btn-radius)',
                      fontSize: '12.5px',
                      fontWeight: isActive ? 600 : (isPrimaryForRole ? 600 : 500),
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive 
                        ? 'var(--teal-subtle)' 
                        : (isPrimaryForRole ? 'rgba(14, 165, 233, 0.04)' : 'transparent'),
                      borderLeft: isActive 
                        ? '3px solid var(--teal-accent)' 
                        : (isPrimaryForRole ? '3px solid rgba(14, 165, 233, 0.4)' : '3px solid transparent'),
                      borderTop: '1px solid transparent',
                      borderRight: '1px solid transparent',
                      borderBottom: '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.12s ease, color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'var(--bg-surface-hover)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = isPrimaryForRole ? 'rgba(14, 165, 233, 0.04)' : 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        color: isActive ? 'var(--teal-accent)' : (isPrimaryForRole ? 'var(--teal-accent)' : 'var(--text-muted)'),
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {isPrimaryForRole && !item.badge && (
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          color: 'var(--teal-accent)',
                          background: 'var(--teal-subtle)',
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}>
                          L{userLevel}
                        </span>
                      )}

                      {item.badge !== undefined && (
                        <span className={`badge badge-${item.badgeType || 'neutral'}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Role Coordination & Status Footer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Active Role Hierarchy Card */}
        <div style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--btn-radius)',
          padding: '10px 12px',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{
              fontSize: '9.5px',
              fontWeight: 800,
              background: 'var(--teal-accent)',
              padding: '1px 5px',
              borderRadius: '3px',
              color: '#0F172A'
            }}>
              L{userLevel} Persona
            </span>
            <button
              onClick={toggleRoleCoordination}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--teal-accent)',
                cursor: 'pointer',
                fontSize: '10.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: 0
              }}
              title="Toggle L1-L5 Role Pipeline"
            >
              <Workflow size={11} />
              <span>Pipeline</span>
            </button>
          </div>

          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
            {currentUser.name}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '10.5px', lineHeight: 1.3 }}>
            Reports to: <strong style={{ color: '#38BDF8' }}>{currentUser.reportsTo || 'Executive Board'}</strong>
          </div>
        </div>

        {/* Deterministic Matching Engine Card */}
        <div style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--btn-radius)',
          padding: '10px 12px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--teal-accent)', fontWeight: 700, marginBottom: '2px' }}>
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
