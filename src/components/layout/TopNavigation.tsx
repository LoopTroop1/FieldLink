import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { Upload, Bot, Cpu, Link, CheckSquare, Calendar, FileText, BarChart2, Brain, LayoutDashboard, Lightbulb, Workflow, Target, Award } from 'lucide-react';

interface TabItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  step: number;
}

const TABS: TabItem[] = [
  { id: 'dashboard',          label: '00 Dashboard',       icon: LayoutDashboard, step: 0 },
  { id: 'capture',            label: '01 Capture',         icon: Upload,      step: 1 },
  { id: 'agent',              label: '02 Time Agent',      icon: Bot,         step: 2 },
  { id: 'extract',            label: '03 Extract',         icon: Cpu,         step: 3 },
  { id: 'link',               label: '04 Link',            icon: Link,        step: 4 },
  { id: 'review',             label: '05 Review',          icon: CheckSquare, step: 5 },
  { id: 'schedule',           label: '06 Schedule',        icon: Calendar,    step: 6 },
  { id: 'audit',              label: '07 Audit',           icon: FileText,    step: 7 },
  { id: 'analytics',          label: '08 Analytics',       icon: BarChart2,   step: 8 },
  { id: 'memory',             label: '09 Memory',          icon: Brain,       step: 9 },
  { id: 'story-problem',      label: 'Why Field Pulse?',   icon: Lightbulb,   step: 10 },
  { id: 'story-architecture', label: 'Architecture',       icon: Workflow,    step: 11 },
  { id: 'story-feasibility',  label: 'Feasibility',        icon: Target,      step: 12 },
  { id: 'story-impact',       label: 'Impact & Benefits',  icon: Award,       step: 13 },
];

export const TopNavigation: React.FC = () => {
  const { activeView, setActiveView, progressEvents, fieldRecords, auditTrail } = useApp();

  // Compute badge counts for relevant tabs
  const badgeCounts: Partial<Record<AppView, number>> = {
    capture: fieldRecords.filter(r => r.processingStatus === 'received').length,
    extract: fieldRecords.filter(r => r.processingStatus === 'ready_for_extraction').length,
    review: progressEvents.filter(e => e.validationStatus === 'pending').length,
    audit: auditTrail.length,
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 12px',
      overflowX: 'auto',
      height: '52px',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        gap: '2px',
        alignItems: 'stretch',
      }}>
        {TABS.map((tab, idx) => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;
          const badge = badgeCounts[tab.id];
          const activeIdx = TABS.findIndex(t => t.id === activeView);
          const isCompleted = idx < activeIdx;

          return (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => setActiveView(tab.id)}
                aria-label={`Step ${tab.step}: ${tab.label}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  border: 'none',
                  background: isActive ? 'var(--accent-primary-subtle)' : 'transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  color: isActive ? 'var(--text-primary)' : isCompleted ? 'var(--success)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '12.5px',
                  fontFamily: 'inherit',
                  borderRadius: '6px',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-surface-hover)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isCompleted ? 'var(--success)' : 'var(--text-muted)';
                  }
                }}
              >


                <Icon size={14} style={{
                  color: isActive ? 'var(--accent-primary)' : 'currentColor',
                  flexShrink: 0,
                }} />

                <span>{tab.label}</span>

                {/* Badge */}
                {badge !== undefined && badge > 0 && (
                  <span style={{
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    background: tab.id === 'review' ? 'var(--warning)' : 'var(--accent-violet)',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}>
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}

                {/* Active Indicator Line */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 4,
                    right: 4,
                    height: '2px',
                    background: 'var(--accent-primary)',
                    borderTopLeftRadius: '2px',
                    borderTopRightRadius: '2px',
                  }} />
                )}
              </button>

              {/* Connector Arrow */}
              {idx < TABS.length - 1 && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isCompleted ? 'var(--success)' : 'var(--text-muted)',
                  fontSize: '10px',
                  opacity: 0.4,
                  padding: '0 1px',
                  userSelect: 'none',
                }}>
                  ›
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
