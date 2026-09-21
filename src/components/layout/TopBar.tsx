import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  RotateCcw, 
  Layers, 
  PlayCircle,
  Sun,
  Moon
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { 
    project, 
    settings, 
    theme,
    toggleTheme,
    resetAllData
  } = useApp();

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


      </div>
    </header>
  );
};
