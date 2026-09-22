import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Clock, AlertTriangle, CheckCircle, ArrowRight, BarChart2, TrendingUp, Users } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { project, progressEvents, fieldRecords, settings } = useApp();

  const metrics = {
    totalRecords: fieldRecords.length,
    processedEvents: progressEvents.length,
    pendingReview: progressEvents.filter(e => e.validationStatus === 'pending').length,
    highConfidence: progressEvents.filter(e => e.confidenceScore >= settings.fastTrackThreshold).length
  };

  const activeTasks = [
    { id: '1', title: 'Review Piping Progress', description: '3 events require planner review.', priority: 'HIGH', dueTime: 'Today', actionLabel: 'Review Queue' }
  ];

  return (
    <div style={{ padding: '0 16px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Project Control Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {project.name} • Live Execution Telemetry
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="badge badge-info" style={{ padding: '6px 12px', fontSize: '12px' }}>
            <Activity size={14} /> Data Date: {project.dataDate}
          </div>
          <div className="badge badge-success" style={{ padding: '6px 12px', fontSize: '12px' }}>
            <CheckCircle size={14} /> System Active
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Field Inputs</span>
            <div style={{ background: 'var(--info-bg)', color: 'var(--info)', padding: '6px', borderRadius: '6px' }}>
              <Clock size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {metrics.totalRecords}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '6px', fontWeight: 500 }}>
              +14 today
            </div>
          </div>
        </div>

        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Progress Events</span>
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '6px', borderRadius: '6px' }}>
              <BarChart2 size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {metrics.processedEvents}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Extracted from field data
            </div>
          </div>
        </div>

        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>High Confidence</span>
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '6px', borderRadius: '6px' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {metrics.processedEvents > 0 ? Math.round((metrics.highConfidence / metrics.processedEvents) * 100) : 0}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Ready for Fast-Track
            </div>
          </div>
        </div>

        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Review</span>
            <div style={{ background: 'var(--warning-bg)', color: 'var(--warning)', padding: '6px', borderRadius: '6px' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {metrics.pendingReview}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--warning)', marginTop: '6px', fontWeight: 500 }}>
              Requires planner action
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="oil-card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Execution Trajectory</h3>
              <div className="badge badge-neutral">Cumulative Progress</div>
            </div>
            <div style={{ 
              flex: 1, 
              background: 'var(--bg-base)', 
              borderRadius: '8px', 
              border: '1px dashed var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'var(--text-muted)'
            }}>
              <BarChart2 size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
              <p>Live S-Curve visualization connects to P6 baseline payload.</p>
              <p style={{ fontSize: '11px', marginTop: '4px' }}>Navigate to "Live Schedule" for granular details.</p>
            </div>
          </div>

          <div className="oil-card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Recent Pipeline Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {progressEvents.slice(0, 3).map(event => (
                <div key={event.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--bg-base)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', height: '32px', borderRadius: '50%', 
                      background: 'var(--accent-primary-subtle)', 
                      color: 'var(--accent-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <Activity size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{event.activityDescription}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Source: {event.fieldRecordId} • {event.discipline}
                      </div>
                    </div>
                  </div>
                  <div>
                    {event.validationStatus === 'approved' ? (
                      <span className="badge badge-success">Approved</span>
                    ) : (
                      <span className="badge badge-warning">Pending Review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="oil-card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--accent-primary)" />
              My Action Queue
            </h3>
            
            {activeTasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeTasks.map(task => (
                  <div key={task.id} style={{
                    padding: '12px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    background: 'var(--bg-base)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className={`badge ${task.priority === 'CRITICAL' ? 'badge-danger' : task.priority === 'HIGH' ? 'badge-warning' : 'badge-neutral'}`}>
                        {task.priority}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{task.dueTime}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{task.title}</div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                      {task.description}
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', fontSize: '11px', padding: '6px' }}>
                      {task.actionLabel} <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={24} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                <p>No pending tasks for your role.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
