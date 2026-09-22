import React from 'react';
import { ArrowDown, Cpu, Network, Combine, Database, TerminalSquare } from 'lucide-react';

export const StoryArchitectureView: React.FC = () => {
  return (
    <div style={{ padding: '0 16px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
          Technical Architecture
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          The end-to-end data pipeline transforming raw execution reality into structured project control payloads.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        
        {/* Layer 1: Ingestion */}
        <div className="oil-card" style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '8px' }}>
            <TerminalSquare size={32} color="var(--accent-secondary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>1. Multi-Modal Ingestion Layer</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Accepts input from disparate sources including the <strong>Time Agent</strong> (Natural Language/Voice), tabular Excel uploads, and legacy PDF Daily Progress Reports.
            </p>
          </div>
        </div>

        <ArrowDown size={24} color="var(--border-medium)" style={{ margin: '8px 0' }} />

        {/* Layer 2: Extraction */}
        <div className="oil-card" style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '8px' }}>
            <Combine size={32} color="var(--info)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>2. NLP Extraction Engine</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Parses unstructured text into normalized entities: <strong>Action</strong> (e.g., "welded"), <strong>Quantity</strong> (e.g., "18"), <strong>Unit</strong> (e.g., "joints"), and <strong>Context</strong> (e.g., "Line 24-XX").
            </p>
          </div>
        </div>

        <ArrowDown size={24} color="var(--border-medium)" style={{ margin: '8px 0' }} />

        {/* Layer 3: Matching Engine */}
        <div className="oil-card" style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '24px', alignItems: 'center', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ background: 'var(--accent-primary-subtle)', padding: '16px', borderRadius: '8px' }}>
            <Cpu size={32} color="var(--accent-primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>3. The 6-Signal Schedule Matcher (Core IP)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
              Ranks millions of schedule activities against the extracted field event using a weighted heuristic algorithm.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div className="badge badge-neutral">Text Match (30%)</div>
              <div className="badge badge-neutral">Discipline (20%)</div>
              <div className="badge badge-neutral">Location (15%)</div>
              <div className="badge badge-neutral">WBS Fit (15%)</div>
              <div className="badge badge-neutral">Date Fit (10%)</div>
              <div className="badge badge-neutral">Synonyms (10%)</div>
            </div>
          </div>
        </div>

        <ArrowDown size={24} color="var(--border-medium)" style={{ margin: '8px 0' }} />

        {/* Layer 4: Integration */}
        <div className="oil-card" style={{ width: '100%', maxWidth: '800px', display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '8px' }}>
            <Database size={32} color="var(--success)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>4. P6 Sync & Audit Layer</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              Once approved by a human planner, the normalized data is structured into an XML/JSON payload compatible with Primavera P6 APIs. A cryptographic audit trail links the schedule update back to the original field evidence.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
