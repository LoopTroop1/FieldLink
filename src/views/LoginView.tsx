import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, DEMO_USERS, AuthUser } from '../types';
import { 
  Layers, 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  CheckCircle2, 
  Briefcase, 
  HardHat, 
  Wrench, 
  BarChart3,
  Building2,
  KeyRound,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, project, theme, toggleTheme } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('Planner');
  const [emailOrId, setEmailOrId] = useState<string>(DEMO_USERS['Planner'].email);
  const [passcode, setPasscode] = useState<string>('••••••••••••');
  const [rememberSession, setRememberSession] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmailOrId(DEMO_USERS[role].email);
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      login(role);
      setIsAuthenticating(false);
    }, 450);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      const custom: Partial<AuthUser> = {
        email: emailOrId.includes('@') ? emailOrId : `${emailOrId.toLowerCase()}@fieldlink.io`,
        employeeId: emailOrId.toUpperCase()
      };
      login(selectedRole, custom);
      setIsAuthenticating(false);
    }, 450);
  };

  const roleMeta: Record<UserRole, {
    icon: React.ReactNode;
    color: string;
    bgGlow: string;
    badge: string;
    responsibilities: string;
    landingScreen: string;
  }> = {
    'Planner': {
      icon: <Briefcase size={20} color="#38BDF8" />,
      color: '#38BDF8',
      bgGlow: 'rgba(56, 189, 248, 0.12)',
      badge: 'Planning & Project Controls',
      responsibilities: 'Schedule mutation authority, fast-track gating, predecessor override, mock PMIS sync',
      landingScreen: 'Planner Review Queue & Gantt'
    },
    'Supervisor': {
      icon: <HardHat size={20} color="#34D399" />,
      color: '#34D399',
      bgGlow: 'rgba(52, 211, 153, 0.12)',
      badge: 'Piping & Field Execution',
      responsibilities: 'On-site voice logging, WhatsApp Time Agent, daily progress report (DPR) capture',
      landingScreen: 'Time Agent Conversational UI'
    },
    'Discipline Engineer': {
      icon: <Wrench size={20} color="#FBBF24" />,
      color: '#FBBF24',
      bgGlow: 'rgba(251, 191, 36, 0.12)',
      badge: 'Discipline Engineering (Piping / Civil)',
      responsibilities: 'Extraction workspace verification, phrase highlighting, quantity & UOM refinement',
      landingScreen: 'Extraction Workspace & Linker'
    },
    'Project Manager': {
      icon: <BarChart3 size={20} color="#A78BFA" />,
      color: '#A78BFA',
      bgGlow: 'rgba(167, 139, 250, 0.12)',
      badge: 'Directorate of Surface Projects',
      responsibilities: 'Executive KPI tracking, cumulative S-curves, delay risk analysis, audit surveillance',
      landingScreen: 'Operations Overview & Analytics'
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: theme === 'dark' 
        ? 'radial-gradient(ellipse at 50% 15%, #0F172A 0%, #080C16 100%)' 
        : 'radial-gradient(ellipse at 50% 15%, #FFFFFF 0%, #F1F5F9 100%)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Decorative Grids & Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '480px',
        background: theme === 'dark'
          ? 'radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.15), transparent 70%)'
          : 'radial-gradient(circle at 50% 20%, rgba(14, 165, 233, 0.08), transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Header Bar */}
      <header style={{
        height: '70px',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        background: theme === 'dark' ? 'rgba(11, 17, 32, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            color: '#fff',
            padding: '7px 14px',
            borderRadius: '9px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Layers size={16} color="#38BDF8" />
            <span>FIELDLINK PLATFORM</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Enterprise Capital Projects & Infrastructure Controls
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Intelligent Field Progress & Schedule Linking System
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={14} color="#FBBF24" /> : <Moon size={14} color="#0284C7" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <span className="badge badge-info" style={{ fontSize: '11px', padding: '4px 10px' }}>
            Baghewala Gateway: Enterprise Access
          </span>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        zIndex: 5
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          gap: '36px',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Quick Persona Cards (Judge Fast-Track) */}
          <div style={{
            background: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#FFFFFF',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '10px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: theme === 'dark' ? '0 12px 32px rgba(0, 0, 0, 0.4)' : '0 8px 24px rgba(0, 0, 0, 0.06)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="var(--teal-accent)" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--teal-accent)' }}>
                  Evaluator Fast-Track Access
                </span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Select a Project Persona to Sign In
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
                Test the planning-to-execution bridge through the distinct perspectives of site supervisors, discipline engineers, planners, or executives.
              </p>

              {/* Persona Cards Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(Object.keys(roleMeta) as UserRole[]).map((role) => {
                  const meta = roleMeta[role];
                  const user = DEMO_USERS[role];
                  const isSelected = selectedRole === role;

                  return (
                    <div
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      style={{
                        background: isSelected 
                          ? meta.bgGlow 
                          : (theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : '#F8FAFC'),
                        border: `1.5px solid ${isSelected ? meta.color : (theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')}`,
                        borderRadius: '12px',
                        padding: '16px 18px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${meta.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {meta.icon}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {user.name}
                            </span>
                            <span style={{
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: meta.color,
                              background: `${meta.color}18`,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              border: `1px solid ${meta.color}30`
                            }}>
                              {role}
                            </span>
                          </div>

                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            {meta.badge}, ID <code style={{ color: 'var(--teal-accent)' }}>{user.badgeNumber}</code>
                          </div>

                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {meta.responsibilities}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLogin(role);
                        }}
                        className="btn btn-primary"
                        style={{
                          padding: '7px 14px',
                          fontSize: '12px',
                          background: isSelected ? meta.color : (theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'),
                          color: isSelected ? '#0F172A' : 'var(--text-primary)',
                          border: `1px solid ${meta.color}`,
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                        disabled={isAuthenticating}
                      >
                        Sign In
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Anchor Note */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px',
              color: 'var(--text-muted)'
            }}>
              <span>Status Cutoff: <strong style={{ color: 'var(--text-primary)' }}>{project.dataDate}</strong></span>
              <span>Enterprise Progress Layer | Air-Gapped Architecture</span>
            </div>
          </div>

          {/* Right Column: Interactive Credential Authentication Form */}
          <div style={{
            background: theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
            border: `1px solid ${theme === 'dark' ? 'rgba(14, 165, 233, 0.25)' : 'rgba(14, 165, 233, 0.35)'}`,
            backdropFilter: 'blur(24px)',
            borderRadius: '10px',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: theme === 'dark' 
              ? '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(14, 165, 233, 0.1)' 
              : '0 12px 35px rgba(0, 0, 0, 0.08), 0 0 20px rgba(14, 165, 233, 0.08)'
          }}>
            <div>
              {/* Form Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(14, 165, 233, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lock size={16} color="var(--teal-accent)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC' }}>
                    Enterprise Gateway Sign In
                  </h3>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    Enterprise Active Directory SSO
                  </span>
                </div>
              </div>

              <div style={{
                background: 'rgba(14, 165, 233, 0.08)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                margin: '18px 0 24px 0',
                fontSize: '11.5px',
                color: '#BAE6FD',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span>
                  Authenticating as <strong>{DEMO_USERS[selectedRole].name}</strong> with role <strong>{selectedRole}</strong>.
                </span>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Corporate Email or Employee ID:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="input-field"
                      value={emailOrId}
                      onChange={(e) => setEmailOrId(e.target.value)}
                      placeholder="e.g. rajiv.sen@fieldlink.io or FL-PL-0482"
                      required
                      style={{ paddingLeft: '36px' }}
                    />
                    <UserCheck size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Password or Digital PIN:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="input-field"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter corporate secret key"
                      required
                      style={{ paddingLeft: '36px' }}
                    />
                    <KeyRound size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Assigned Project Role:
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                    className="input-field"
                    style={{ cursor: 'pointer' }}
                  >
                    {(Object.keys(roleMeta) as UserRole[]).map(r => (
                      <option key={r} value={r}>
                        {r} — {roleMeta[r].badge}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      style={{ accentColor: 'var(--teal-accent)' }}
                    />
                    <span>Remember session on this station</span>
                  </label>

                  <span style={{ color: 'var(--teal-accent)', cursor: 'pointer' }}>
                    Reset Credentials
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '11px 20px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)'
                  }}
                  disabled={isAuthenticating}
                >
                  <span>{isAuthenticating ? 'Validating Credentials...' : 'Authenticate & Enter Gateway'}</span>
                </button>
              </form>
            </div>

            {/* Security Disclaimer */}
            <div style={{
              marginTop: '24px',
              paddingTop: '18px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <ShieldCheck size={14} color="#10B981" />
                <span style={{ fontWeight: 600 }}>Enterprise Security Directive</span>
              </div>
              Access restricted to authorized project personnel and contractors. All operations are logged to the append-only audit trail.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '14px 40px',
        borderTop: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        background: theme === 'dark' ? 'rgba(11, 17, 32, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px',
        color: 'var(--text-muted)',
        zIndex: 10
      }}>
        <span>&copy; 2026 FieldLink Platform. Capital Projects & Schedule Linking System.</span>
        <span>Real-Time Actual Progress Tracking | Intelligent Planning-to-Execution Bridge</span>
      </footer>
    </div>
  );
};
