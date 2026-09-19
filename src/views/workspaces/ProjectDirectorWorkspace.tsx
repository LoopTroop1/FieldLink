import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectMemoryView } from '../ProjectMemoryView';
import { OperationsOverviewView } from '../OperationsOverviewView';
import { AnalyticsView } from '../AnalyticsView';
import { 
  Crown, 
  Brain, 
  LayoutDashboard, 
  LineChart, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Award,
  Building2,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const ProjectDirectorWorkspace: React.FC = () => {
  const { currentUser, switchRole, activities, memoryItems, delayPatterns } = useApp();
  const [activeTab, setActiveTab] = useState<'memory' | 'macro-kpis' | 'analytics'>('memory');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
        border: '1.5px solid rgba(236, 72, 153, 0.35)',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: '#EC4899',
                color: '#fff',
                fontWeight: 800,
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.8px'
              }}>
                LEVEL 1 EXECUTIVE WORKSPACE
              </span>
              <span style={{ fontSize: '12px', color: '#F472B6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Crown size={14} />
                Executive Project Directorate (EPPM)
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
              Executive Portfolio Cockpit — Dr. Amitabh Roy
            </h1>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '820px', lineHeight: 1.5 }}>
              Capital program governance and institutional memory layer. Tracks Level 1/2 macro milestone commitments across EPC packages, adopts empirical duration overrun benchmarks into future planning baselines, and mitigates recurring delay patterns across capital infrastructure assets.
            </p>
          </div>

          {/* Coordination Channels Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '12px 16px',
            minWidth: '290px',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
              Executive Reporting Structure
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F472B6', marginBottom: '3px' }}>
              Reports To: <strong>Board & Capital Committee</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Directs: <strong>All Project Managers (L2) & Planners (L3)</strong>
            </div>

            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => switchRole('L2 Project Manager')}
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  color: '#C4B5FD',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={12} />
                <span>Switch to Project Controls Manager (L2)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive Metrics Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(236, 72, 153, 0.2)'
        }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Portfolio Completion</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>68.4% On Track</div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Forecast Milestone Variance</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8' }}>+1.0 Day (Controlled)</div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Delay Patterns Cataloged</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B' }}>{delayPatterns.length} Identified</div>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Institutional Memory Items</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#EC4899' }}>{memoryItems.length} Learned Lessons</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('memory')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'memory' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'memory' ? '#EC4899' : 'var(--text-secondary)',
            borderBottom: activeTab === 'memory' ? '3px solid #EC4899' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <Brain size={16} />
          <span>Project Memory & Empirical Duration Benchmarks</span>
        </button>

        <button
          onClick={() => setActiveTab('macro-kpis')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'macro-kpis' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'macro-kpis' ? '#EC4899' : 'var(--text-secondary)',
            borderBottom: activeTab === 'macro-kpis' ? '3px solid #EC4899' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <LayoutDashboard size={16} />
          <span>Macro Milestone Health & EVM</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'analytics' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'analytics' ? '#EC4899' : 'var(--text-secondary)',
            borderBottom: activeTab === 'analytics' ? '3px solid #EC4899' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <LineChart size={16} />
          <span>Portfolio Analytics & Forecast</span>
        </button>
      </div>

      {activeTab === 'memory' && <ProjectMemoryView />}
      {activeTab === 'macro-kpis' && <OperationsOverviewView />}
      {activeTab === 'analytics' && <AnalyticsView />}
    </div>
  );
};
