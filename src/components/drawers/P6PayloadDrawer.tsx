import React, { useState } from 'react';
import { ScheduleActivity } from '../../types';
import { MockP6Adapter, MockPayload } from '../../services/mockP6Adapter';
import { useApp } from '../../context/AppContext';
import { X, Copy, Check, Server, ShieldAlert, Send } from 'lucide-react';

interface P6PayloadDrawerProps {
  activity: ScheduleActivity | null;
  onClose: () => void;
}

export const P6PayloadDrawer: React.FC<P6PayloadDrawerProps> = ({ activity, onClose }) => {
  const { syncWithPMIS } = useApp();
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  if (!activity) return null;

  const payload: MockPayload = MockP6Adapter.previewPayload(activity);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncWithPMIS(activity.id);
    setIsSyncing(false);
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 3000);
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="var(--teal-accent)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Representative PMIS Payload</h3>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Disclaimer Note */}
        <div style={{
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '11.5px',
          color: 'var(--text-primary)',
          display: 'flex',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <ShieldAlert size={16} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: 'var(--warning)' }}>Demonstration Payload — Local Mock PMIS Architecture:</strong>
            <div style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>
              This payload illustrates standard P6-compatible activity update structures via the Local Mock PMIS Adapter (<code>/api/mock-pmis/sync</code>) without requiring live enterprise cloud credentials or external write locks.
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div style={{ marginBottom: '16px', fontSize: '13px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Target Activity:</div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {activity.activityCode}: {activity.description}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Physical % Complete: {activity.percentComplete}% | Status: {activity.status}
          </div>
        </div>

        {/* Action Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            HTTP Request Contract: {payload.httpMethod} {payload.endpoint.substring(0, 42)}...
          </span>
          <button onClick={handleCopy} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}>
            {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        {/* JSON Code Viewer */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          background: '#0B0F19',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px',
          fontSize: '11.5px',
          lineHeight: '1.6'
        }}>
          <pre className="font-mono" style={{ color: '#E2E8F0', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>

        {/* Action Button: Sync to Mock PMIS */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleSync} 
            className="btn btn-primary"
            style={{ width: '100%', padding: '9px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={isSyncing}
          >
            {syncDone ? <Check size={16} color="#34D399" /> : <Send size={15} />}
            <span>{syncDone ? 'Synchronized to Mock PMIS!' : isSyncing ? 'Syncing...' : 'Sync to Mock PMIS'}</span>
          </button>
        </div>

        {/* Simulated Response */}
        <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Local Mock PMIS Adapter Status:
          </div>
          <div style={{
            background: syncDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.08)',
            border: `1px solid ${syncDone ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.25)'}`,
            padding: '9px 13px',
            borderRadius: '6px',
            fontSize: '12px',
            color: syncDone ? '#34D399' : '#38BDF8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{syncDone ? 'HTTP 200 OK — Activity Actuals Synchronized' : 'Ready to Dispatch via /api/mock-pmis/sync'}</span>
            <span className="font-mono" style={{ fontSize: '11px' }}>
              {syncDone ? 'TX-DEMO-COMMITTED' : 'ROUTE: MOCK-PMIS'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
