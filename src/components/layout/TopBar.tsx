import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Calendar, 
  Shield, 
  RotateCcw, 
  UserCheck, 
  Flame, 
  PlayCircle,
  Eye,
  EyeOff,
  LogOut,
  User,
  Sun,
  Moon
} from 'lucide-react';

export const TopBar: React.FC<{ onStartGuidedDemo: () => void }> = ({ onStartGuidedDemo }) => {
  const { 
    project, 
    settings, 
    setRole, 
    togglePrivacyMode, 
    resetAllData, 
    currentUser,
    logout,
    theme,
    toggleTheme
  } = useApp();

  const roles: UserRole[] = ['Supervisor', 'Discipline Engineer', 'Planner', 'Project Manager'];

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
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      {/* Left: Project Branding & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          color: '#fff',
          padding: '5px 11px',
          borderRadius: '7px',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <Flame size={14} color="#FBBF24" />
          <span>OIL INDIA LIMITED</span>
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

      {/* Right: Engineering Controls & Actions */}
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
          {theme === 'dark' ? <Sun size={13} color="#FBBF24" /> : <Moon size={13} color="#0284C7" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Guided Demo Button */}
        <button
          onClick={onStartGuidedDemo}
          className="btn btn-primary"
          style={{ padding: '6px 13px', fontSize: '12px' }}
          title="Run 5-Act Judge Walkthrough"
        >
          <PlayCircle size={15} />
          <span>Guided Demo (4m)</span>
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
          <Calendar size={13} color="var(--teal-accent)" />
          <span>Cutoff:</span>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{settings.dataDate}</strong>
        </div>

        {/* Active Role Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <select
            value={settings.currentRole}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="input-field"
            style={{ width: 'auto', padding: '5px 10px', fontSize: '12px', cursor: 'pointer', borderRadius: 'var(--btn-radius)' }}
          >
            {roles.map(r => (
              <option key={r} value={r}>Role: {r}</option>
            ))}
          </select>
        </div>

        {/* Privacy Redaction Toggle */}
        <button
          onClick={togglePrivacyMode}
          className="btn btn-secondary"
          style={{
            padding: '5px 11px',
            fontSize: '12px',
            borderColor: settings.privacyMode ? 'rgba(16, 185, 129, 0.5)' : 'var(--border-subtle)',
            color: settings.privacyMode ? 'var(--oil-green)' : 'var(--text-secondary)',
            background: settings.privacyMode ? 'var(--success-bg)' : 'transparent'
          }}
          title="Mask worker and contractor names"
        >
          {settings.privacyMode ? <EyeOff size={13} /> : <Eye size={13} />}
          <span>Privacy: {settings.privacyMode ? 'ON' : 'OFF'}</span>
        </button>

        {/* Reset Demo Button */}
        <button
          onClick={resetAllData}
          className="btn btn-secondary"
          style={{ padding: '5px 11px', fontSize: '12px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          title="Instant reset to pure Baghewala synthetic baseline"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>

        {/* Logged-in User Profile & Sign Out */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          padding: '4px 6px 4px 10px',
          borderRadius: 'var(--btn-radius)',
          fontSize: '12px',
          marginLeft: '4px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: currentUser.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 800,
            color: '#0F172A'
          }}>
            {currentUser.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</span>
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
