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
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
  group: 'OPERATIONS' | 'SCHEDULE INTELLIGENCE' | 'INSIGHTS & GOVERNANCE';
  badge?: string | number;
  badgeType?: 'warning' | 'danger' | 'info' | 'neutral';
}

export const NavigationRail: React.FC = () => {
  const { activeView, setActiveView, progressEvents, fieldRecords } = useApp();

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
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive 
                        ? 'var(--teal-subtle)' 
                        : 'transparent',
                      borderLeft: isActive 
                        ? '3px solid var(--teal-accent)' 
                        : '3px solid transparent',
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
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        color: isActive ? 'var(--teal-accent)' : 'var(--text-muted)',
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

      {/* Engineering Engine Status Footer */}
      <div style={{
        background: 'var(--bg-base)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--btn-radius)',
        padding: '12px 14px',
        fontSize: '11.5px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--teal-accent)', fontWeight: 700, marginBottom: '3px' }}>
          <Sparkles size={14} />
          <span>Deterministic Matching Engine</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.4 }}>
          6-Signal Traceable Architecture | Air-Gapped Operation
        </div>
      </div>
    </nav>
  );
};
