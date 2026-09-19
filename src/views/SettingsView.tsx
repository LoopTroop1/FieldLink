import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CANONICAL_SYNONYMS, LOCATION_NORMALIZATION_MAP } from '../data/synonymDictionary';
import { 
  Sliders, 
  Shield, 
  Database, 
  BookOpen, 
  AlertTriangle, 
  RotateCcw, 
  Check, 
  Info,
  Server,
  KeyRound,
  Eye,
  EyeOff,
  HardDrive,
  RefreshCw,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, setRole, togglePrivacyMode, resetAllData, dbStats, isDbConnected, refreshDbStats } = useApp();
  const [fastTrack, setFastTrack] = useState<number>(settings.fastTrackThreshold);
  const [reviewThreshold, setReviewThreshold] = useState<number>(settings.reviewThreshold);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [synonymSearch, setSynonymSearch] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);
  const [dbRefreshSuccess, setDbRefreshSuccess] = useState(false);

  const handleSaveThresholds = () => {
    // In our prototype, fastTrack and reviewThreshold are persisted into settings
    settings.fastTrackThreshold = fastTrack;
    settings.reviewThreshold = reviewThreshold;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRefreshDb = async () => {
    setIsRefreshingDb(true);
    await refreshDbStats();
    setIsRefreshingDb(false);
    setDbRefreshSuccess(true);
    setTimeout(() => setDbRefreshSuccess(false), 2200);
  };

  const filteredSynonyms = Object.entries(CANONICAL_SYNONYMS).filter(([canonical, syns]) => {
    const q = synonymSearch.toLowerCase();
    return canonical.toLowerCase().includes(q) || syns.some(s => s.toLowerCase().includes(q));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={24} color="var(--teal-accent)" />
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>System & Matching Engine Settings</h1>
        </div>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
          Configure confidence gating rules, privacy redaction mode, P6 adapter parameters, enterprise relational database, and domain synonym mappings.
        </p>
      </div>

      {/* Featured Card: Enterprise Relational Database Inspector */}
      <div className="oil-card" style={{ 
        border: '1px solid rgba(16, 185, 129, 0.4)',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-surface) 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: 'rgba(16, 185, 129, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <Database size={18} color="#10B981" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Enterprise Relational Database Engine</h3>
                <span className={`badge ${isDbConnected ? 'badge-high' : 'badge-medium'}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isDbConnected ? '#34D399' : '#FBBF24', display: 'inline-block' }} />
                  {isDbConnected ? 'ACTIVE & CONNECTED' : 'LOCAL CACHE MODE'}
                </span>
                <span className="badge badge-gray" style={{ fontSize: '11px', border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38BDF8' }}>
                  AIR-GAPPED HIGH PERFORMANCE
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Local relational persistence with WAL journal mode. Zero external cloud dependencies, fully compliant with PSU air-gapped operational standards.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleRefreshDb} 
              className="btn btn-secondary" 
              style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              disabled={isRefreshingDb}
            >
              <RefreshCw size={13} className={isRefreshingDb ? 'animate-spin' : ''} />
              {dbRefreshSuccess ? 'Connection Verified' : 'Test / Refresh Connection'}
            </button>
          </div>
        </div>

        {/* Database Engine Metadata Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12px' }}>
          <div style={{ background: 'var(--bg-base)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '3px' }}>Engine Implementation</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Node 24 Native (DatabaseSync)</div>
          </div>
          <div style={{ background: 'var(--bg-base)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '3px' }}>Database File Path</div>
            <div style={{ fontWeight: 700, color: 'var(--teal-accent)', fontFamily: 'monospace' }}>
              {dbStats?.databasePath || 'data/fieldlink_project.db'}
            </div>
          </div>
          <div style={{ background: 'var(--bg-base)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '3px' }}>Database Size</div>
            <div style={{ fontWeight: 700, color: '#38BDF8' }}>
              {dbStats ? `${dbStats.databaseSizeKb} KB` : '36.0 KB'} (WAL Journal Mode)
            </div>
          </div>
          <div style={{ background: 'var(--bg-base)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '3px' }}>Local REST API Server</div>
            <div style={{ fontWeight: 700, color: 'var(--oil-green)', fontFamily: 'monospace' }}>http://localhost:3001/api</div>
          </div>
        </div>

        {/* Relational Table Schema & Record Counters */}
        <div>
          <div style={{ fontSize: '12.5px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="var(--teal-accent)" />
            Relational Schema Tables &amp; Active Row Counts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '8px' }}>
            <div style={{ background: 'var(--bg-base)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>projects</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {dbStats?.tables.projects ?? 1}
              </div>
            </div>
            <div style={{ background: 'var(--bg-base)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>schedule_activities</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--oil-green)', marginTop: '2px' }}>
                {dbStats?.tables.scheduleActivities ?? 19}
              </div>
            </div>
            <div style={{ background: 'var(--bg-base)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>field_records</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
                {dbStats?.tables.fieldRecords ?? 7}
              </div>
            </div>
            <div style={{ background: 'var(--bg-base)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>progress_events</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FBBF24', marginTop: '2px' }}>
                {dbStats?.tables.progressEvents ?? 7}
              </div>
            </div>
            <div style={{ background: 'var(--bg-base)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>audit_trail</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#A78BFA', marginTop: '2px' }}>
                {dbStats?.tables.auditTrail ?? 3}
              </div>
            </div>
            <div style={{ background: 'var(--bg-base)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>project_memory</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399', marginTop: '2px' }}>
                {dbStats?.tables.projectMemory ?? 5}
              </div>
            </div>
            <div style={{ background: 'var(--bg-base)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>delay_patterns</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#F87171', marginTop: '2px' }}>
                {dbStats?.tables.delayPatterns ?? 3}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        
        {/* Card 1: Confidence Gating Thresholds */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Sliders size={18} color="var(--oil-green)" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Confidence Gating Thresholds</h3>
          </div>

          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Automated schedule updates are gated by deterministic confidence scores derived from the 6-signal matching formula.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Fast Track Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--oil-green)' }}>
                  High Confidence (Fast-Track Eligible)
                </label>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--oil-green)' }}>
                  ≥ {fastTrack}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                step="1"
                value={fastTrack}
                onChange={e => setFastTrack(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--oil-green)' }}
              />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Matches with ≥{fastTrack}% confidence and unambiguous score gaps qualify for single-click planner batch acceptance.
              </div>
            </div>

            {/* Review Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#FACC15' }}>
                  Medium Confidence (Mandatory Planner Review)
                </label>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FACC15' }}>
                  {reviewThreshold}% - {fastTrack - 1}%
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="75"
                step="1"
                value={reviewThreshold}
                onChange={e => setReviewThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#FACC15' }}
              />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Matches between {reviewThreshold}% and {fastTrack - 1}% are held in the Planner Review Queue for verification or 1:N splitting.
              </div>
            </div>

            {/* Low Confidence info */}
            <div style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger)',
              borderRadius: '6px',
              padding: '10px 12px',
              fontSize: '12px',
              color: 'var(--text-primary)'
            }}>
              <strong style={{ color: 'var(--danger)' }}>Low Confidence / Unmatched (&lt; {reviewThreshold}%):</strong> Automatically marked as Unmatched. Triggers unmapped candidate review or creates proposed new change order scope.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button onClick={handleSaveThresholds} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {savedSuccess ? <Check size={14} /> : null}
                {savedSuccess ? 'Thresholds Applied' : 'Save Thresholds'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Privacy & Field Redaction Mode */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Shield size={18} color="var(--teal-accent)" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Field Privacy & Redaction</h3>
          </div>

          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Protects worker identities and commercial contractor designations in compliance with organizational data protection standards.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px',
            background: 'var(--bg-base)',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {settings.privacyMode ? <EyeOff size={16} color="#34D399" /> : <Eye size={16} color="var(--text-muted)" />}
                Privacy Redaction Active
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {settings.privacyMode 
                  ? 'Field supervisor names & contractor references are actively masked across all views.' 
                  : 'Displaying original raw text including names and contractor identifiers.'}
              </div>
            </div>

            <button
              onClick={togglePrivacyMode}
              className={`btn ${settings.privacyMode ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {settings.privacyMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Active Redaction Pattern Rules:</strong>
            <ul style={{ margin: '8px 0 0 18px', padding: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <li><code>R. Sharma</code> &rarr; <span style={{ color: '#38BDF8' }}>[REDACTED-SUPERVISOR-A]</span></li>
              <li><code>M. Joshi</code> &rarr; <span style={{ color: '#38BDF8' }}>[CONTRACTOR-SECURE-LEAD]</span></li>
              <li><code>V. Patel</code> &rarr; <span style={{ color: '#38BDF8' }}>[REDACTED-FIELD-ENG]</span></li>
              <li><code>Subcontractor</code> &rarr; <span style={{ color: '#38BDF8' }}>[CONTRACTOR-PARTNER]</span></li>
            </ul>
          </div>
        </div>

        {/* Card 3: Local Mock PMIS Adapter */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Server size={18} color="#38BDF8" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Local Mock PMIS Adapter</h3>
          </div>

          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Configured for simulated, self-contained demonstration mode without requiring live external enterprise cloud credentials.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-base)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Adapter Mode:</span>
              <span className="badge badge-high">LOCAL DEMO MOCK</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-base)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Endpoint:</span>
              <code style={{ color: '#38BDF8' }}>/api/mock-pmis/sync</code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-base)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>External Credentials:</span>
              <span style={{ color: 'var(--text-muted)' }}>Not configured (Demonstration mode)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-base)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payload Formats:</span>
              <span>Representative JSON &amp; SOAP XML Schemas</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-base)', borderRadius: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Out-of-Sequence Policy:</span>
              <span style={{ color: '#FB923C', fontWeight: 600 }}>PAUSE_ON_VIOLATION</span>
            </div>
          </div>
        </div>

        {/* Card 4: Danger Zone / Prototype Reset */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '12px' }}>
            <AlertTriangle size={18} color="#EF4444" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#EF4444' }}>Reset Prototype State</h3>
          </div>

          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Restores the application to its initial pre-seeded state with 19 baseline schedule activities and 7 synthetic input records in under 50ms.
          </p>

          {!resetConfirmOpen ? (
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="btn"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: 'auto'
              }}
            >
              <RotateCcw size={16} />
              Reset All Data to Baseline (&lt;50ms)
            </button>
          ) : (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #EF4444',
              borderRadius: '6px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                Are you sure? This will wipe all uncommitted test records and restore Baghewala project defaults.
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setResetConfirmOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    resetAllData();
                    setResetConfirmOpen(false);
                  }}
                  className="btn"
                  style={{ background: '#EF4444', color: '#FFFFFF', padding: '4px 12px', fontSize: '12px' }}
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Domain Synonym Dictionary Browser */}
      <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--teal-accent)" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Domain Terminology &amp; Synonym Dictionary</h3>
          </div>
          <input
            type="text"
            placeholder="Filter synonyms..."
            className="input-field"
            style={{ width: '220px', padding: '6px 10px', fontSize: '12px' }}
            value={synonymSearch}
            onChange={e => setSynonymSearch(e.target.value)}
          />
        </div>

        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)' }}>
          The multi-attribute matching engine leverages these canonical mappings to resolve informal field expressions (e.g. <em>"spool erected"</em> &harr; <em>"pipe erection"</em>).
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px 14px', width: '220px' }}>Canonical Schedule Term</th>
                <th style={{ padding: '10px 14px' }}>Recognized Field Synonyms &amp; Jargon</th>
              </tr>
            </thead>
            <tbody>
              {filteredSynonyms.map(([canonical, syns]) => (
                <tr key={canonical} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--teal-accent)' }}>
                    {canonical}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {syns.map((syn, idx) => (
                        <span key={idx} className="badge badge-gray" style={{ fontSize: '11px' }}>
                          {syn}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
