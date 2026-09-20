import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExtractionWorkspaceView } from '../ExtractionWorkspaceView';
import { ScheduleLinkerView } from '../ScheduleLinkerView';
import { 
  Wrench, 
  ScanText, 
  GitMerge, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck, 
  ShieldCheck, 
  Sparkles,
  Layers,
  FileCode
} from 'lucide-react';

export const DisciplineEngineerWorkspace: React.FC = () => {
  const { currentUser, progressEvents, fieldRecords, addRoleHandoff } = useApp();
  const [activeTab, setActiveTab] = useState<'extraction' | 'linker'>('extraction');
  const [endorsedSuccess, setEndorsedSuccess] = useState(false);

  const handleEndorseTechnicalSpec = () => {
    addRoleHandoff({
      fromRole: 'L4 Discipline Engineer',
      fromName: currentUser.name,
      toRole: 'L3 Planner',
      toName: 'Rajiv Sen',
      action: 'Endorsed Physical Quantities & P&ID Drawing Specs for Line 24-XX',
      activityCode: 'PIP-L6-024A',
      activityName: 'Erect Line 24-XX Segment B',
      status: 'endorsed',
      note: 'Verified drawing P&ID-2401 alignment; confirmed 75% physical progress is technically accurate.'
    });

    setEndorsedSuccess(true);
    setTimeout(() => setEndorsedSuccess(false), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: '#F59E0B',
                color: '#0F172A',
                fontWeight: 800,
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.8px'
              }}>
                LEVEL 4 WORKSPACE
              </span>
              <span style={{ fontSize: '12px', color: '#FCD34D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Wrench size={14} />
                Mechanical & Piping Discipline Engineering
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
              Discipline Engineering Console — Vikram Patel
            </h1>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, maxWidth: '820px', lineHeight: 1.5 }}>
              Technical validation and multi-attribute verification layer. Links raw unstructured text phrases to P&ID drawing specifications, calculates exact physical percentage completions from cumulative joint counts, and certifies engineering accuracy for the <strong>Lead Planner</strong>.
            </p>
          </div>

          {/* Coordination Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '12px 16px',
            minWidth: '280px',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
              Active Coordination Channels
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8', marginBottom: '3px' }}>
              Supplies Endorsement To: <strong>Rajiv Sen (L3 Planner)</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Validates Site Reports Of: <strong>Ramesh Sharma (L5)</strong>
            </div>

            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{
                background: 'rgba(225, 155, 139, 0.1)',
                border: '1px solid rgba(225, 155, 139, 0.25)',
                borderRadius: '5px',
                padding: '5px 10px',
                fontSize: '10.5px',
                fontWeight: 600,
                color: '#E19B8B',
                textAlign: 'center'
              }}>
                Endorsements route to Lead Planner automatically
              </div>
            </div>
          </div>
        </div>

        {/* Quick Endorsement Action Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <FileCheck size={16} color="#F59E0B" />
            <span>Ready for Technical Spec Endorsement: <strong>Line 24-XX (Area B) — 18/24 Joints (75%)</strong></span>
          </div>

          <button
            onClick={handleEndorseTechnicalSpec}
            className="btn btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              background: '#F59E0B',
              color: '#0F172A',
              border: 'none',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} />
            <span>Endorse Specs to Planner Rajiv Sen</span>
          </button>
        </div>

        {endorsedSuccess && (
          <div style={{
            marginTop: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#FCD34D',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={15} />
            <span>Engineering endorsement dispatched to Lead Planner Rajiv Sen for schedule linking!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('extraction')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'extraction' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'extraction' ? '#F59E0B' : 'var(--text-secondary)',
            borderBottom: activeTab === 'extraction' ? '3px solid #F59E0B' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <ScanText size={16} />
          <span>Extraction Workspace & Phrase Highlighting</span>
        </button>

        <button
          onClick={() => setActiveTab('linker')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'linker' ? 'var(--bg-surface)' : 'transparent',
            color: activeTab === 'linker' ? '#F59E0B' : 'var(--text-secondary)',
            borderBottom: activeTab === 'linker' ? '3px solid #F59E0B' : '3px solid transparent',
            cursor: 'pointer'
          }}
        >
          <GitMerge size={16} />
          <span>Technical Schedule Linker View</span>
        </button>
      </div>

      {activeTab === 'extraction' && <ExtractionWorkspaceView />}
      {activeTab === 'linker' && <ScheduleLinkerView />}
    </div>
  );
};
