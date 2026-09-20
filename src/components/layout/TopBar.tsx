import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  RotateCcw, 
  Layers, 
  PlayCircle,
  LogOut,
  Sun,
  Moon,
  Workflow
} from 'lucide-react';

export const TopBar: React.FC<{ onStartGuidedDemo: () => void }> = ({ onStartGuidedDemo }) => {
  const { 
    project, 
    settings, 
    currentUser,
    logout,
    theme,
    toggleTheme,
    isRoleCoordinationOpen,
    toggleRoleCoordination,
    roleHandoffs,
    resetAllData
  } = useApp();

  const levelColors: Record<number, string> = {
    5: '#D41414',
    4: '#E19B8B',
    3: '#6C3AED',
    2: '#8B5CF6',
    1: '#310A69'
  };

  const levelColor = levelColors[currentUser.level || 3] || '#6C3AED';

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'var(--bg-surface)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 50,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      position: 'relative'
    }}>
      {/* Decorative brand gradient line at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'var(--brand-gradient)',
        opacity: 0.6
      }} />

      {/* Left: Project Branding & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #D41414 0%, #310A69 100%)',
          color: '#fff',
          padding: '5px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 12px rgba(212, 20, 20, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <Layers size={14} color="#E19B8B" />
          <span>FIELDLINK</span>
        </div>

        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.1px' }}>
            {project.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{project.location}</span>
          </div>
        </div>
      </div>

      {/* Right: Controls & User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{
            padding: '5px 11px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={13} color="#FBBF24" /> : <Moon size={13} color="#6C3AED" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Role Coordination & Hierarchy Toggle */}
        <button
          onClick={toggleRoleCoordination}
          className="btn btn-secondary"
          style={{
            padding: '5px 11px',
            fontSize: '12px',
            borderColor: isRoleCoordinationOpen ? 'var(--accent-primary)' : 'var(--border-subtle)',
            background: isRoleCoordinationOpen ? 'var(--accent-primary-subtle)' : 'transparent',
            color: isRoleCoordinationOpen ? 'var(--accent-primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Toggle 5-Tier Role Coordination Pipeline (L1 - L5)"
        >
          <Workflow size={13} color={isRoleCoordinationOpen ? 'var(--accent-primary)' : 'currentColor'} />
          <span>Hierarchy (L1-L5)</span>
          <span style={{
            background: isRoleCoordinationOpen ? 'var(--accent-primary)' : 'var(--border-subtle)',
            color: isRoleCoordinationOpen ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '9.5px',
            fontWeight: 800,
            padding: '1px 5px',
            borderRadius: '10px'
          }}>
            {roleHandoffs.length}
          </span>
        </button>

        {/* Guided Demo Button */}
        <button
          onClick={onStartGuidedDemo}
          className="btn btn-primary"
          style={{ padding: '6px 13px', fontSize: '12px' }}
          title="Run 5-Act Judge Walkthrough"
        >
          <PlayCircle size={15} />
          <span>Guided Demo</span>
        </button>

        {/* Data Date Cutoff Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          padding: '5px 10px',
          borderRadius: 'var(--btn-radius)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <Calendar size={13} color="var(--accent-primary)" />
          <span>Cutoff:</span>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{settings.dataDate}</strong>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={resetAllData}
          className="btn btn-secondary"
          style={{ padding: '5px 11px', fontSize: '12px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          title="Instant reset to pure baseline"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>

        {/* Logged-in User Profile & Sign Out */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            padding: '4px 8px 4px 10px',
            borderRadius: 'var(--btn-radius)',
            fontSize: '12px',
            marginLeft: '4px'
          }}
          title={`Reports to: ${currentUser.reportsTo || 'N/A'} | Supervises: ${currentUser.supervises || 'N/A'}`}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${levelColor} 0%, ${levelColor}90 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 800,
            color: '#FFFFFF',
            boxShadow: `0 0 8px ${levelColor}40`
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</span>
              <span style={{
                fontSize: '9px',
                fontWeight: 800,
                color: '#FFFFFF',
                background: levelColor,
                padding: '0 5px',
                borderRadius: '3px'
              }}>
                L{currentUser.level || 3}
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{currentUser.role}</span>
          </div>
          <button
            onClick={logout}
            className="btn btn-secondary"
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              marginLeft: '4px',
              color: '#EF4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'var(--danger-bg)'
            }}
            title="Sign out to enterprise login screen"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
