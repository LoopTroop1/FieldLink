import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp,
  FileCheck,
  Database
} from 'lucide-react';

export const OperationsOverviewView: React.FC = () => {
  const { 
    activities, 
    progressEvents, 
    fieldRecords, 
    setActiveView, 
    setSelectedEventId, 
    maskText,
    dbStats,
    isDbConnected
  } = useApp();

  // Compute KPIs
  const totalActivities = activities.length;
  const inProgressOrComplete = activities.filter(a => a.percentComplete > 0).length;
  const pendingReviews = progressEvents.filter(e => e.validationStatus === 'pending');
  const unmatchedEvents = progressEvents.filter(e => e.confidenceLevel === 'UNMATCHED');

  // Discipline Progress Stats
  const disciplines = ['CIVIL', 'PIPING', 'STATIC_EQUIP', 'ROTATING_EQUIP', 'ELECTRICAL', 'INSTRUMENTATION', 'HSE'] as const;
  const disciplineStats = disciplines.map(d => {
    const dActivities = activities.filter(a => a.discipline === d);
    const avgPct = dActivities.length > 0
      ? Math.round(dActivities.reduce((acc, a) => acc + a.percentComplete, 0) / dActivities.length)
      : 0;
    return { discipline: d, percent: avgPct, count: dActivities.length };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Operations Command Center
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time planning-to-execution telemetry for Baghewala Surface Facilities Expansion.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveView('ingestion')} className="btn btn-primary">
            <span>Ingest Field Data</span>
          </button>
          <button onClick={() => setActiveView('schedule')} className="btn btn-secondary">
            <span>Live Schedule Gantt</span>
          </button>
        </div>
      </div>

      {/* Enterprise Database Telemetry Ribbon */}
      <div 
        onClick={() => setActiveView('settings')}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(56, 189, 248, 0.06) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '8px',
          padding: '10px 16px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'var(--success-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={15} color="var(--oil-green)" />
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
            <strong>Enterprise Relational Repository:</strong>{' '}
            <code style={{ color: 'var(--teal-accent)', fontSize: '12px' }}>data/oil_india_baghewala.db</code>
            <span style={{ color: 'var(--text-secondary)', marginLeft: '12px' }}>
              {dbStats?.databaseSizeKb ? `${dbStats.databaseSizeKb} KB` : 'Active'} | Air-Gapped High-Performance Persistence
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${isDbConnected ? 'badge-high' : 'badge-medium'}`} style={{ fontSize: '11px' }}>
            {isDbConnected ? 'SYNCHRONIZED (PORT 3001)' : 'LOCAL PERSISTENCE'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--teal-accent)', fontWeight: 600 }}>
            Inspect Schema
          </span>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        <div className="oil-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Progress Captured</span>
            <Activity size={17} color="var(--teal-accent)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
            18 <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>joints / 42 m</span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} />
            <span>+75% Daily Target Achieved</span>
          </div>
        </div>

        <div className="oil-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Schedule Linked</span>
            <FileCheck size={17} color="#10B981" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {inProgressOrComplete} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>/ {totalActivities}</span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Level 5/6 baseline execution
          </div>
        </div>

        <div className="oil-card" style={{ cursor: 'pointer' }} onClick={() => setActiveView('review')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Planner Review Queue</span>
            <Clock size={17} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: pendingReviews.length > 0 ? '#FBBF24' : 'var(--text-primary)' }}>
            {pendingReviews.length} <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Pending</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#FBBF24', marginTop: '4px' }}>
            Requires planner review
          </div>
        </div>

        <div className="oil-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Unmatched / New Scope</span>
            <AlertTriangle size={17} color="#EF4444" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: unmatchedEvents.length > 0 ? '#F87171' : 'var(--text-primary)' }}>
            {unmatchedEvents.length} <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>Items</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#F87171', marginTop: '4px' }}>
            Zero silent drops | Proposed scope
          </div>
        </div>

        <div className="oil-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Data Quality Score</span>
            <Sparkles size={17} color="var(--teal-accent)" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--teal-accent)' }}>
            92.4%
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            High evidence and confidence index
          </div>
        </div>
      </div>

      {/* Main Grid: Discipline Progress + Recent Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '20px' }}>
        {/* Left: Discipline Progress Breakdown */}
        <div className="oil-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Discipline Execution Velocities</h2>
            <span className="badge badge-info">7 Disciplines Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {disciplineStats.map(stat => (
              <div key={stat.discipline}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{stat.discipline}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <strong>{stat.percent}%</strong> ({stat.count} activities)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${stat.percent}%`,
                    height: '100%',
                    background: stat.percent >= 80 ? 'var(--oil-green)' : stat.percent >= 40 ? 'var(--teal-accent)' : 'var(--warning)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-time Ingested Activity Feed */}
        <div className="oil-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Recent Field Ingestion Feed</h2>
            <button onClick={() => setActiveView('ingestion')} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '11px' }}>
              View All ({fieldRecords.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {progressEvents.slice(0, 5).map(ev => {
              const matchedAct = activities.find(a => a.id === ev.candidateActivityId);
              return (
                <div
                  key={ev.id}
                  onClick={() => {
                    setSelectedEventId(ev.id);
                    setActiveView('linker');
                  }}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--teal-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
                      {ev.activityDescription.substring(0, 36)}...
                    </strong>
                    <span className={`badge badge-${ev.confidenceLevel === 'HIGH' ? 'success' : ev.confidenceLevel === 'MEDIUM' ? 'warning' : 'danger'}`}>
                      {ev.confidenceScore}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>Candidate: {matchedAct ? matchedAct.activityCode : 'Unmatched'}</span>
                    <span>{ev.discipline} | {ev.actualStart}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
