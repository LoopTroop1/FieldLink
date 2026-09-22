import React from 'react';
import { AlertCircle, ArrowRight, Database, FileSpreadsheet, Mic, ShieldAlert, Cpu } from 'lucide-react';

export const StoryProblemView: React.FC = () => {
  return (
    <div style={{ padding: '0 16px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
          Why Field Pulse?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          The critical disconnect between dynamic field execution and rigid project planning models.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* The Problem */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)' }}>
            <AlertCircle size={24} />
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>The Problem (Status Quo)</h2>
          </div>
          
          <div className="oil-card" style={{ borderLeft: '4px solid var(--danger)' }}>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Infrastructure projects generate massive amounts of daily progress data, but it is <strong>highly fragmented and unstructured</strong>. 
            </p>
            
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '8px', borderRadius: '8px' }}>
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Siloed Formats</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progress is trapped in PDFs, Excel sheets, and handwritten diaries.</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '8px', borderRadius: '8px' }}>
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>The "Translation" Bottleneck</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Planners spend 60% of their time manually mapping raw field reports to specific Primavera P6 WBS activities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-primary)' }}>
            <Cpu size={24} />
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>The Solution (Field Pulse)</h2>
          </div>

          <div className="oil-card" style={{ borderLeft: '4px solid var(--accent-primary)', background: 'var(--bg-surface-elevated)' }}>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-primary)' }}>
              Field Pulse acts as an <strong>Intelligent Schedule-Linking Layer</strong>. It automatically ingests messy data and reconciles it against the baseline.
            </p>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)', padding: '8px', borderRadius: '8px' }}>
                  <Mic size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Frictionless Capture</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Supervisors log progress via natural language voice notes or text; AI handles the structure.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--accent-primary-subtle)', color: 'var(--accent-primary)', padding: '8px', borderRadius: '8px' }}>
                  <Database size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Algorithmic P6 Linking</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>A 6-signal matching engine automatically links field events to L5/L6 schedule activities with a confidence score.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '16px', 
          background: 'var(--bg-surface)', padding: '16px 32px', 
          borderRadius: '100px', border: '1px solid var(--border-subtle)'
        }}>
          <span style={{ fontWeight: 600 }}>Unstructured Site Data</span>
          <ArrowRight color="var(--accent-primary)" />
          <div className="badge badge-info" style={{ fontSize: '13px', padding: '6px 12px' }}>Field Pulse Engine</div>
          <ArrowRight color="var(--accent-primary)" />
          <span style={{ fontWeight: 600, color: 'var(--success)' }}>Schedule-Linked Progress</span>
        </div>
      </div>

    </div>
  );
};
