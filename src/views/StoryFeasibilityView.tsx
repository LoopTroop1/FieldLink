import React from 'react';
import { Settings, Banknote, Rocket } from 'lucide-react';

export const StoryFeasibilityView: React.FC = () => {
  return (
    <div style={{ padding: '0 16px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
          Feasibility & Viability
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          Why Field Pulse is technically realistic to build and commercially scalable for the enterprise.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Technical Feasibility */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-primary)' }}>
            <Settings size={24} />
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Technical Feasibility</h2>
          </div>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>Non-Disruptive Overlay:</strong> Field Pulse does not attempt to replace Primavera P6 or SAP. It acts as a lightweight middleware layer via APIs.
            </li>
            <li>
              <strong>Standard Web Stack:</strong> Built on reliable, proven technologies (React, Node.js, standard SQL/NoSQL).
            </li>
            <li>
              <strong>Modular AI:</strong> The NLP engine can be swapped or fine-tuned without rebuilding the core matching logic.
            </li>
          </ul>
        </div>

        {/* Commercial Viability */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--success)' }}>
            <Banknote size={24} />
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Commercial Viability</h2>
          </div>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>Massive TAM:</strong> Targets the $10T+ global infrastructure market where schedule delays cost millions daily.
            </li>
            <li>
              <strong>Clear ROI:</strong> Planners save up to 20 hours per week on manual data entry, enabling them to focus on forward-looking risk mitigation.
            </li>
            <li>
              <strong>B2B SaaS Model:</strong> Tiered pricing based on Total Installed Cost (TIC) of the project or per-seat enterprise licensing.
            </li>
          </ul>
        </div>

        {/* Adoption Strategy */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--warning)' }}>
            <Rocket size={24} />
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Adoption Strategy</h2>
          </div>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>Zero-Training Frontline:</strong> The "Time Agent" allows field supervisors to submit progress using natural language voice notes on WhatsApp/SMS—no new apps to learn.
            </li>
            <li>
              <strong>Top-Down Mandate:</strong> Sold directly to the Project Management Office (PMO) who mandates its use for contractor reporting.
            </li>
            <li>
              <strong>Legacy Compatibility:</strong> Supports uploading legacy Excel and PDF formats to bridge the gap during digital transformation.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
