import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { Upload, Bot, Cpu, Link, CheckSquare, Calendar, BarChart2 } from 'lucide-react';

interface TabItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'capture', label: 'Batch Upload', icon: Upload },
  { id: 'agent', label: 'Time Agent', icon: Bot },
  { id: 'extract', label: 'Extract', icon: Cpu },
  { id: 'link', label: 'Link', icon: Link },
  { id: 'review', label: 'Review', icon: CheckSquare },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

export const TopNavigation: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px',
      overflowX: 'auto',
      height: '56px'
    }}>
      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        {TABS.map(tab => {
          const isActive = activeView === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                position: 'relative',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <Icon size={18} style={{ 
                color: isActive ? 'var(--accent-primary)' : 'currentColor',
                filter: isActive ? 'drop-shadow(0 0 8px rgba(108, 58, 237, 0.4))' : 'none'
              }} />
              <span style={{ fontSize: '14px' }}>{tab.label}</span>
              
              {/* Active Indicator Line */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'var(--brand-gradient)',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px'
                }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
