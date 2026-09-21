import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuditEntry } from '../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  History,
  FileCheck2,
  GitBranch,
  RefreshCw,
  PlusCircle,
  Clock
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditTrail, activities, setTracingEvidenceActivity } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Filter audit entries
  const filteredEntries = auditTrail.filter(entry => {
    const matchesAction = selectedAction === 'ALL' || entry.action === selectedAction;
    const matchesSearch = 
      entry.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.evidenceSnippet && entry.evidenceSnippet.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  // Calculate statistics
  const totalEntries = auditTrail.length;
  const approvedCount = auditTrail.filter(e => e.action === 'APPROVE').length;
  const syncedCount = auditTrail.filter(e => e.action === 'SYNC').length;
  const splitCount = auditTrail.filter(e => e.action === 'SPLIT_1_TO_N').length;
  const proposedCount = auditTrail.filter(e => e.action === 'PROPOSE_NEW').length;

  const getActionBadge = (action: AuditEntry['action']) => {
    switch (action) {
      case 'APPROVE':
        return <span className="badge badge-high" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FileCheck2 size={12} /> APPROVE</span>;
      case 'SYNC':
        return <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><RefreshCw size={12} /> SYNC_P6</span>;
      case 'SPLIT_1_TO_N':
        return <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><GitBranch size={12} /> SPLIT_1:N</span>;
      case 'PROPOSE_NEW':
        return <span className="badge badge-orange" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><PlusCircle size={12} /> PROPOSE_NEW</span>;
      case 'EXTRACT':
        return <span className="badge badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>EXTRACT</span>;
      case 'MATCH':
        return <span className="badge badge-med" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>MATCH</span>;
      default:
        return <span className="badge badge-gray">{action}</span>;
    }
  };

  const handleOpenTrace = (entry: AuditEntry) => {
    // If entity is an activity, find it directly
    const directAct = activities.find(a => a.id === entry.entityId);
    if (directAct) {
      setTracingEvidenceActivity(directAct);
      return;
    }
    // If entity is in afterValue or beforeValue
    if (entry.afterValue?.activityId) {
      const act = activities.find(a => a.id === entry.afterValue.activityId);
      if (act) {
        setTracingEvidenceActivity(act);
        return;
      }
    }
    // Fallback: pick the first activity or show first relevant
    if (activities.length > 0) {
      setTracingEvidenceActivity(activities[0]);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditTrail, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit_trail_baghewala_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with Title & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="var(--oil-green)" />
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Append-Only Audit Trail (Prototype)</h1>
          </div>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
            Immutable chronological record of every progress update, match approval, 1:N split, and schedule sync.
          </p>
        </div>

        <button 
          onClick={handleExportJSON}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Download size={14} />
          Export Audit Log (JSON)
        </button>
      </div>

      {/* Compliance Notice Banner */}
      <div style={{
        background: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Clock size={20} color="var(--teal-accent)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Regulatory & Contractual Traceability Guarantee:</strong> Every progress mutation is captured with a non-repudiable ISO timestamp, actor signature, before/after attribute diff, and direct pointer to the originating field document snippet.
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <div className="oil-card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Total Audit Entries
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalEntries}
          </div>
        </div>

        <div className="oil-card" style={{ padding: '14px 18px', borderLeft: '3px solid var(--oil-green)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Approved Matches
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--oil-green)', marginTop: '4px' }}>
            {approvedCount}
          </div>
        </div>

        <div className="oil-card" style={{ padding: '14px 18px', borderLeft: '3px solid #38BDF8' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            PMIS Synchronizations
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>
            {syncedCount}
          </div>
        </div>

        <div className="oil-card" style={{ padding: '14px 18px', borderLeft: '3px solid #C084FC' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            1:N Split Allocations
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#C084FC', marginTop: '4px' }}>
            {splitCount}
          </div>
        </div>

        <div className="oil-card" style={{ padding: '14px 18px', borderLeft: '3px solid #FB923C' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Proposed New Scope
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FB923C', marginTop: '4px' }}>
            {proposedCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="oil-card" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search by entity, reason, actor, or snippet..."
            className="input-field"
            style={{ paddingLeft: '36px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Action:</span>
          <select
            className="input-field"
            style={{ width: 'auto', padding: '6px 12px' }}
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value)}
          >
            <option value="ALL">All Actions ({auditTrail.length})</option>
            <option value="APPROVE">APPROVE ({approvedCount})</option>
            <option value="SYNC">SYNC ({syncedCount})</option>
            <option value="SPLIT_1_TO_N">SPLIT_1:N ({splitCount})</option>
            <option value="PROPOSE_NEW">PROPOSE_NEW ({proposedCount})</option>
            <option value="EXTRACT">EXTRACT</option>
            <option value="MATCH">MATCH</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="oil-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px', width: '40px' }}></th>
                <th style={{ padding: '12px 16px' }}>Timestamp (UTC/IST)</th>
                <th style={{ padding: '12px 16px' }}>Action</th>
                <th style={{ padding: '12px 16px' }}>Actor</th>
                <th style={{ padding: '12px 16px' }}>Entity</th>
                <th style={{ padding: '12px 16px' }}>Justification / Reason</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Lineage Trace</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => {
                const isExpanded = expandedRowId === entry.id;
                const correspondingAct = activities.find(a => a.id === entry.entityId || (entry.afterValue && a.id === entry.afterValue.activityId));

                return (
                  <React.Fragment key={entry.id}>
                    <tr 
                      style={{ 
                        borderBottom: '1px solid var(--border-subtle)', 
                        background: isExpanded ? 'var(--bg-surface-hover)' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => setExpandedRowId(isExpanded ? null : entry.id)}
                    >
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                        {entry.timestamp.replace('T', ' ').slice(0, 19)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {getActionBadge(entry.action)}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {entry.actor}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontFamily: 'monospace', color: 'var(--teal-accent)', fontWeight: 600 }}>
                          {entry.entityType} : {entry.entityId}
                        </span>
                        {correspondingAct && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {correspondingAct.activityCode}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', maxWidth: '300px', color: 'var(--text-secondary)' }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {entry.reason}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleOpenTrace(entry)}
                          title="Open 6-point interactive evidence lineage"
                        >
                          <History size={12} />
                          Trace Lineage
                          <ExternalLink size={10} />
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible Diff / Details Panel */}
                    {isExpanded && (
                      <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <td colSpan={7} style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {/* Evidence Context */}
                            <div>
                              <div style={{ fontSize: '12px', color: 'var(--teal-accent)', fontWeight: 600, marginBottom: '6px' }}>
                                Originating Field Evidence
                              </div>
                              <div style={{ 
                                background: 'var(--highlight-bg)', 
                                borderLeft: '3px solid var(--highlight-border)', 
                                padding: '10px 12px', 
                                borderRadius: '0 4px 4px 0',
                                color: 'var(--text-primary)',
                                fontStyle: 'italic',
                                fontSize: '11.5px',
                                marginBottom: '10px'
                              }}>
                                "{entry.evidenceSnippet || 'No direct text snippet recorded for this system action'}"
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                Source Pointer: <code style={{ color: 'var(--teal-accent)' }}>{entry.source}</code>
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Full Reason: <span style={{ color: 'var(--text-primary)' }}>{entry.reason}</span>
                              </div>
                            </div>

                            {/* Attribute Mutation Diff */}
                            <div>
                              <div style={{ fontSize: '12px', color: 'var(--teal-accent)', fontWeight: 600, marginBottom: '6px' }}>
                                State Mutation Diff (Before vs After)
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div style={{ background: 'var(--bg-base)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                                  <div style={{ fontSize: '10px', color: '#F87171', fontWeight: 700, marginBottom: '4px' }}>
                                    BEFORE STATE
                                  </div>
                                  <pre style={{ margin: 0, fontSize: '10.5px', color: 'var(--text-muted)', overflowX: 'auto' }}>
                                    {entry.beforeValue ? JSON.stringify(entry.beforeValue, null, 2) : '(Initial State / Null)'}
                                  </pre>
                                </div>
                                <div style={{ background: 'var(--bg-base)', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                                  <div style={{ fontSize: '10px', color: 'var(--oil-green)', fontWeight: 700, marginBottom: '4px' }}>
                                    AFTER STATE
                                  </div>
                                  <pre style={{ margin: 0, fontSize: '10.5px', color: 'var(--text-primary)', overflowX: 'auto' }}>
                                    {JSON.stringify(entry.afterValue, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No audit records match the current filter or search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
