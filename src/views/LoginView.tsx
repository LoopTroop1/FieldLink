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
  Moon,
  Crown,
  Workflow
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, project, theme, toggleTheme } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('L3 Planner');
  const [emailOrId, setEmailOrId] = useState<string>(DEMO_USERS['L3 Planner'].email);
  const [passcode, setPasscode] = useState<string>('••••••••••••');
  const [rememberSession, setRememberSession] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const primaryRoles: UserRole[] = [
    'L5 Supervisor',
    'L4 Discipline Engineer',
    'L3 Planner',
    'L2 Project Manager',
    'L1 Project Director'
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmailOrId(DEMO_USERS[role]?.email || DEMO_USERS['L3 Planner'].email);
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
    levelCode: 'L5' | 'L4' | 'L3' | 'L2' | 'L1';
    icon: React.ReactNode;
    color: string;
    bgGlow: string;
    badge: string;
    responsibilities: string;
    landingScreen: string;
  }> = {
    'L5 Supervisor': {
      levelCode: 'L5',
      icon: <HardHat size={20} color="#10B981" />,
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      badge: 'Level 5 — Piping & Field Execution Lead',
      responsibilities: 'On-site voice logging, WhatsApp Time Agent, daily progress report (DPR) capture, shift handovers',
      landingScreen: 'Time Agent & Data Ingestion Hub'
    },
    'L4 Discipline Engineer': {
      levelCode: 'L4',
      icon: <Wrench size={20} color="#F59E0B" />,
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      badge: 'Level 4 — Field Discipline Engineer',
      responsibilities: 'Extraction workspace verification, drawing/P&ID linking, quantity & UOM technical validation',
      landingScreen: 'Extraction Workspace & Quality Hub'
    },
    'L3 Planner': {
      levelCode: 'L3',
      icon: <Briefcase size={20} color="#0EA5E9" />,
      color: '#0EA5E9',
      bgGlow: 'rgba(14, 165, 233, 0.12)',
      badge: 'Level 3 — Lead Planning Engineer',
      responsibilities: '6-signal schedule linking, out-of-sequence safety gating, 1:N splitting, activity mapping approval',
      landingScreen: 'Schedule Linker & Planner Review Queue'
    },
    'L2 Project Manager': {
      levelCode: 'L2',
      icon: <BarChart3 size={20} color="#8B5CF6" />,
      color: '#8B5CF6',
      bgGlow: 'rgba(139, 92, 246, 0.12)',
      badge: 'Level 2 — Project Controls Manager',
      responsibilities: 'Real-time S-curves, What-If delay ripple simulation, contractor claims, Oracle P6 sync authorization',
      landingScreen: 'Operations Overview & What-If Analytics'
    },
    'L1 Project Director': {
      levelCode: 'L1',
      icon: <Crown size={20} color="#EC4899" />,
      color: '#EC4899',
      bgGlow: 'rgba(236, 72, 153, 0.12)',
      badge: 'Level 1 — Executive Project Director',
      responsibilities: 'Executive portfolio health, macro milestone governance (L1/L2), institutional memory benchmarks',
      landingScreen: 'Executive Portfolio Cockpit & Project Memory'
    },
    // Backward-compatible aliases
    'Supervisor': {
      levelCode: 'L5',
      icon: <HardHat size={20} color="#10B981" />,
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      badge: 'Level 5 — Piping & Field Execution Lead',
      responsibilities: 'On-site voice logging, WhatsApp Time Agent, daily progress report (DPR) capture',
      landingScreen: 'Time Agent Conversational UI'
    },
    'Discipline Engineer': {
      levelCode: 'L4',
      icon: <Wrench size={20} color="#F59E0B" />,
      color: '#F59E0B',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      badge: 'Level 4 — Field Discipline Engineer',
      responsibilities: 'Extraction workspace verification, phrase highlighting, quantity & UOM refinement',
      landingScreen: 'Extraction Workspace & Linker'
    },
    'Planner': {
      levelCode: 'L3',
      icon: <Briefcase size={20} color="#0EA5E9" />,
      color: '#0EA5E9',
      bgGlow: 'rgba(14, 165, 233, 0.12)',
      badge: 'Level 3 — Lead Planning Engineer',
      responsibilities: 'Schedule mutation authority, fast-track gating, predecessor override, mock PMIS sync',
      landingScreen: 'Planner Review Queue & Gantt'
    },
    'Project Manager': {
      levelCode: 'L2',
      icon: <BarChart3 size={20} color="#8B5CF6" />,
      color: '#8B5CF6',
      bgGlow: 'rgba(139, 92, 246, 0.12)',
      badge: 'Level 2 — Project Controls Manager',
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

              {/* Persona Cards Grid (L5 down to L1) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {primaryRoles.map((role) => {
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
                        borderRadius: '10px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, marginRight: '12px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${meta.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {meta.icon}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              color: '#fff',
                              background: meta.color,
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}>
                              {meta.levelCode}
                            </span>
                            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {user.name}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: meta.color,
                              background: `${meta.color}18`,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              border: `1px solid ${meta.color}30`
                            }}>
                              {role}
                            </span>
                          </div>

                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                            {meta.badge} • ID <code style={{ color: 'var(--teal-accent)' }}>{user.badgeNumber}</code>
                          </div>

                          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: 1.35, marginBottom: '4px' }}>
                            {meta.responsibilities}
                          </div>

                          {/* Role Coordination & Hierarchy Connection */}
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                            fontSize: '10px',
                            color: 'var(--text-secondary)',
                            background: 'rgba(0, 0, 0, 0.15)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            marginTop: '2px'
                          }}>
                            <span>Upstream: <strong style={{ color: '#38BDF8' }}>{user.reportsTo || 'Executive Board'}</strong></span>
                            <span>Directs: <strong style={{ color: '#34D399' }}>{user.supervises || 'Field Personnel'}</strong></span>
                            <span>Target: <strong style={{ color: meta.color }}>{meta.landingScreen}</strong></span>
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
                          padding: '6px 12px',
                          fontSize: '11.5px',
                          background: isSelected ? meta.color : (theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'),
                          color: isSelected ? '#0F172A' : 'var(--text-primary)',
                          border: `1px solid ${meta.color}`,
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                        disabled={isAuthenticating}
                      >
                        Sign In {meta.levelCode}
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
                    {primaryRoles.map(r => (
                      <option key={r} value={r}>
                        {roleMeta[r]?.levelCode} — {r} ({DEMO_USERS[r]?.name})
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
