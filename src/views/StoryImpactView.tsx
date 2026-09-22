import React from 'react';
import { Target, TrendingDown, Clock, Link, Globe2, ShieldCheck } from 'lucide-react';

export const StoryImpactView: React.FC = () => {
  return (
    <div style={{ padding: '0 16px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
          Impact & Benefits
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
          The measurable outcomes of deploying Field Pulse across a capital project lifecycle.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Quantitative Impact */}
        <div className="oil-card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingDown size={20} />
            Quantitative Improvements
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)', minWidth: '80px' }}>-80%</div>
              <div>
                <h4 style={{ fontWeight: 600 }}>Manual Data Entry</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Reduction in planner hours spent transcribing and mapping field reports to P6.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)', minWidth: '80px' }}>+5x</div>
              <div>
                <h4 style={{ fontWeight: 600 }}>Update Frequency</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Moving from weekly batch updates to near real-time daily execution tracking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Qualitative Impact */}
        <div className="oil-card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px', color: 'var(--info)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} />
            Qualitative Benefits
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'var(--info-bg)', padding: '12px', borderRadius: '50%', color: 'var(--info)' }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600 }}>Proactive vs Reactive</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Shift from reporting on delays after they happen, to predicting slippage before it impacts the critical path.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'var(--info-bg)', padding: '12px', borderRadius: '50%', color: 'var(--info)' }}>
                <Link size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600 }}>Single Source of Truth</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Eliminates arguments between field and office by maintaining a cryptographically verifiable audit trail.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SDG Alignment */}
      <div className="oil-card" style={{ borderLeft: '4px solid var(--success)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe2 size={20} color="var(--success)" />
          UN Sustainable Development Goals (SDG) Alignment
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--success)' }}>9</div>
            <div>
              <h4 style={{ fontWeight: 700 }}>Industry, Innovation, & Infrastructure</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Modernizes the execution of massive capital infrastructure projects through digital innovation, reducing cost overruns and delays in building critical national assets.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--warning)' }}>12</div>
            <div>
              <h4 style={{ fontWeight: 700 }}>Responsible Consumption & Production</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                By tightly controlling the schedule and reducing out-of-sequence work, Field Pulse minimizes physical rework, thereby reducing material waste and carbon emissions.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
