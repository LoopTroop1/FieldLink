import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OperationsOverviewView } from '../OperationsOverviewView';
import { AnalyticsView } from '../AnalyticsView';
import { AuditTrailView } from '../AuditTrailView';
import { 
  BarChart3, 
  LineChart, 
  LayoutDashboard, 
  History, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';

export const ProjectManagerWorkspace: React.FC = () => {
  const { currentUser, activities, addRoleHandoff, syncWithPMIS } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'pmis-sync' | 'audit'>('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleAuthorizeP6Sync = async () => {
    setIsSyncing(true);
    try {
      await syncWithPMIS('act-pip-024a');
      addRoleHandoff({
        fromRole: 'L2 Project Manager',
        fromName: currentUser.name,
        toRole: 'L1 Project Director',
        toName: 'Dr. Amitabh Roy',
        action: 'Authorized Enterprise PMIS Synchronization for Tx-DEMO-864607',
        activityCode: 'PIP-L6-024A',
        activityName: 'Erect Line 24-XX Segment B',
        status: 'synced',
        note: 'Dispatched Oracle Primavera P6 sync package. Schedule baseline intact; milestone variance held at +1.0d.'
      });
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
        border: '1.5px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: '#8B5CF6',
                color: '#fff',
                fontWeight: 800,
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.8px'
              }}>
                LEVEL 2 WORKSPACE
              </span>
              <span style={{ fontSize: '12px', color: '#C4B5FD', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <BarChart3 size={14} />
                Project Controls & Construction Directorate
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
              Project Controls Console — S. Banerjee
            </h1>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '820px', lineHeight: 1.5 }}>
              Enterprise controls and governance layer. Evaluates cumulative earned value S-curves, runs zero-risk What-If delay ripple simulations across critical path dependencies, adjudicates contractor delay claims, and authorizes sync payloads into Primavera P6 EPPM.
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
              Active Coordination Channels
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#EC4899', marginBottom: '3px' }}>
              Reports Upstream To: <strong>Dr. Amitabh Roy (L1 Director)</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Supervises Planning Layer: <strong>Rajiv Sen (L3 Lead Planner)</strong>
            </div>

            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '5px',
                padding: '5px 10px',
                fontSize: '10.5px',
                fontWeight: 600,
                color: '#A78BFA',
                textAlign: 'center'
              }}>
                PMIS sync reports upstream to Director Dr. Roy
              </div>
            </div>
          </div>
        </div>

        {/* Quick Sync Authorization Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} color="#8B5CF6" />
            <span>P6 PMIS Sync Payload Ready: <strong>Line 24-XX Segment B (75% Approved by Planner Rajiv Sen)</strong></span>
          </div>

          <button
            onClick={handleAuthorizeP6Sync}
            disabled={isSyncing}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              background: '#8B5CF6',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={13} />
            <span>{isSyncing ? 'Dispatching to P6...' : 'Authorize Primavera P6 Sync'}</span>
          </button>
        </div>

        {syncSuccess && (
          <div style={{
            marginTop: '10px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#DDD6FE',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={15} color="#A78BFA" />
            <span>PMIS Synchronization Dispatched! P6 REST & SOAP payloads generated and executive milestone updated.</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'overview' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'overview' ? '#8B5CF6' : 'var(--text-secondary)',
            borderBottom: activeTab === 'overview' ? '3px solid #8B5CF6' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <LayoutDashboard size={16} />
          <span>Operations Overview & EVM</span>
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
            color: activeTab === 'analytics' ? '#8B5CF6' : 'var(--text-secondary)',
            borderBottom: activeTab === 'analytics' ? '3px solid #8B5CF6' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <LineChart size={16} />
          <span>Cumulative S-Curves & What-If Ripple Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'audit' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'audit' ? '#8B5CF6' : 'var(--text-secondary)',
            borderBottom: activeTab === 'audit' ? '3px solid #8B5CF6' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <History size={16} />
          <span>Append-Only Audit Trail</span>
        </button>
      </div>

      {activeTab === 'overview' && <OperationsOverviewView />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'audit' && <AuditTrailView />}
    </div>
  );
};
