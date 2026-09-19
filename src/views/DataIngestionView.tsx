import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Discipline, SourceType } from '../types';
import { FileText, Table, Image, Mic, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const DataIngestionView: React.FC = () => {
  const { ingestNewRecord, setActiveView, maskText } = useApp();

  const [sourceType, setSourceType] = useState<SourceType>('report');
  const [sourceName, setSourceName] = useState('Daily_Progress_Report_Piping_12Sep.pdf');
  const [submittedBy, setSubmittedBy] = useState('R. Sharma (Site Supervisor - Piping)');
  const [discipline, setDiscipline] = useState<Discipline>('PIPING');
  const [dateHint, setDateHint] = useState('12 Sep 2026');
  const [rawText, setRawText] = useState(
    `Daily Progress Report - Baghewala Surface Facilities Expansion\nDate: 12-Sep-2026 | Shift: Day | Discipline: Piping\nLocation: North Pipe Rack (Bay 3 to 7)\nCrew: 6 welders, 4 riggers, 1 supervisor | Equipment: Hydra Crane 14T (CR-04)\nNotes:\nPiping crew erected spool for Line 24-XX in the north pipe rack. Work started on 12 Sep 2026 and 18 of 24 joints completed. Quality inspection clearance obtained for joints J-01 to J-18.`
  );
  const [processingState, setProcessingState] = useState<'idle' | 'parsing' | 'normalized' | 'ready'>('ready');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick Preset Samples
  const loadPreset = (type: 'piping' | 'csv' | 'diary' | 'voice' | 'p6' | 'civil' | 'hse') => {
    if (type === 'piping') {
      setSourceType('report');
      setSourceName('Daily_Progress_Report_Piping_12Sep.pdf');
      setSubmittedBy('R. Sharma (Site Supervisor - Piping)');
      setDiscipline('PIPING');
      setDateHint('12 Sep 2026');
      setRawText(
        `Daily Progress Report - Baghewala Surface Facilities Expansion\nDate: 12-Sep-2026 | Shift: Day | Discipline: Piping\nLocation: North Pipe Rack (Bay 3 to 7)\nCrew: 6 welders, 4 riggers, 1 supervisor | Equipment: Hydra Crane 14T (CR-04)\nNotes:\nPiping crew erected spool for Line 24-XX in the north pipe rack. Work started on 12 Sep 2026 and 18 of 24 joints completed. Quality inspection clearance obtained for joints J-01 to J-18.`
      );
    } else if (type === 'csv') {
      setSourceType('spreadsheet');
      setSourceName('Discipline_Progress_Piping_12Sep.csv');
      setSubmittedBy('M. Joshi (Contractor Lead)');
      setDiscipline('PIPING');
      setDateHint('12-09-2026');
      setRawText(`Activity Description,Line / Tag,Discipline,Execution Date,Quantity,Unit,Progress %,Location\nSpool erected,Line 24-XX,Piping,12-09-2026,18,joints,75%,North rack`);
    } else if (type === 'diary') {
      setSourceType('diary');
      setSourceName('Site_Diary_Scan_Patel_14Sep.jpg');
      setSubmittedBy('V. Patel (Electrical Field Engineer)');
      setDiscipline('ELECTRICAL');
      setDateHint('14 Sep 2026');
      setRawText(
        `[Site Diary Entry #E-44 - Date: 14/09/2026]\nSubstation to Process corridor:\nCable tray installation completed in substation corridor. Approx. 42 metres installed on 14 Sep 2026. Supports aligned; tray earthing jumpers pending.`
      );
    } else if (type === 'voice') {
      setSourceType('voice');
      setSourceName('TimeAgent_Audio_Singh_15Sep.m4a');
      setSubmittedBy('K. Singh (Mechanical Supervisor)');
      setDiscipline('ROTATING_EQUIP');
      setDateHint('15 Sep 2026');
      setRawText(`Pump P-204 alignment completed today; final shimming is pending.`);
    } else if (type === 'p6') {
      setSourceType('report');
      setSourceName('Primavera_P6_Export_Instruments_15Sep.xml');
      setSubmittedBy('P6 Scheduling Interface (Export)');
      setDiscipline('INSTRUMENTATION');
      setDateHint('15 Sep 2026');
      setRawText(
        `<ActivityExport Project="BAGHEWALA-01" ExportDate="2026-09-15">\n  <Activity ActivityID="INS-L5-051" WBS="BAGH.SURF.INST.JB" Discipline="INSTRUMENTATION">\n    <TaskName>Junction Box Installation</TaskName>\n    <Status>In Progress</Status>\n    <ActualStart>2026-09-11</ActualStart>\n    <PhysicalPercentComplete>25%</PhysicalPercentComplete>\n    <FieldQuantityActual>4</FieldQuantityActual>\n    <FieldQuantityTarget>16</FieldQuantityTarget>\n    <Location>Process Area - Local Racks</Location>\n  </Activity>\n</ActivityExport>`
      );
    } else if (type === 'civil') {
      setSourceType('spreadsheet');
      setSourceName('Civil_Foundations_PourLog_12Sep.csv');
      setSubmittedBy('A. Kulkarni (Civil Lead)');
      setDiscipline('CIVIL');
      setDateHint('12-09-2026');
      setRawText(`Activity Description,Structure / Bay,Discipline,Execution Date,Quantity,Unit,Progress %,Location\nEquipment Foundation,Compressor Bay A,Civil,12-09-2026,160,m³,50%,Compressor Area - Bay A\nCable Trench,Substation corridor,Civil,12-09-2026,225,meters,50%,Substation to Process Area`);
    } else if (type === 'hse') {
      setSourceType('report');
      setSourceName('HSE_Daily_Permit_Inspection_14Sep.pdf');
      setSubmittedBy('S. Das (HSE Manager)');
      setDiscipline('HSE');
      setDateHint('14 Sep 2026');
      setRawText(
        `HSE Daily Safety Inspection & Permit Verification Report\nDate: 14-Sep-2026 | Location: Plant Wide Facilities\nInspections: 32 of 40 active work scaffolds verified and tagged GREEN.\nPermits: 98 permits closed and safe isolation restored in Separator Area.\nZero reportable lost-time injuries (LTI) or environmental spills.`
      );
    }
    setProcessingState('ready');
    setSuccessMessage(null);
  };

  const handleProcess = () => {
    setProcessingState('parsing');
    setTimeout(() => {
      setProcessingState('normalized');
      setTimeout(() => {
        setProcessingState('ready');
        const record = ingestNewRecord({
          sourceType,
          sourceName,
          submittedBy,
          discipline,
          sourceDateText: dateHint,
          rawText
        });
        setSuccessMessage(`Successfully ingested '${record.sourceName}'. Progress event generated and ready for extraction.`);
      }, 300);
    }, 200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Data Ingestion Hub
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Multi-channel intake gateway for unstructured daily reports, spreadsheets, diary scans, and supervisor audio notes.
        </p>
      </div>

      {/* Preset Chips Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 600 }}>
          <Sparkles size={15} color="var(--teal-accent)" />
          <span>Quick Preset Demo Samples:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => loadPreset('piping')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>
            <FileText size={13} color="var(--teal-accent)" />
            <span>Piping DPR (Line 24-XX)</span>
          </button>
          <button onClick={() => loadPreset('csv')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>
            <Table size={13} color="#10B981" />
            <span>CSV Spreadsheet (Piping)</span>
          </button>
          <button onClick={() => loadPreset('civil')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>
            <Table size={13} color="#38BDF8" />
            <span>Civil Pour Log (CSV)</span>
          </button>
          <button onClick={() => loadPreset('diary')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>
            <Image size={13} color="#F59E0B" />
            <span>Scanned Diary (Electrical OCR)</span>
          </button>
          <button onClick={() => loadPreset('p6')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>
            <FileText size={13} color="#EC4899" />
            <span>Primavera P6 Export (XML)</span>
          </button>
          <button onClick={() => loadPreset('hse')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>
            <FileText size={13} color="#F87171" />
            <span>HSE Safety Inspection</span>
          </button>
          <button onClick={() => loadPreset('voice')} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '12px' }}>
            <Mic size={13} color="#A78BFA" />
            <span>Time Agent Audio (Pump P-204)</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Ingestion Form & Processing Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '20px' }}>
        {/* Left: Input Form */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Field Data Input Workspace</h2>
            <span className="badge badge-info">{sourceType.toUpperCase()} MODE</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Document / Source Name
              </label>
              <input
                type="text"
                className="input-field"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Field Submitter
              </label>
              <input
                type="text"
                className="input-field"
                value={maskText(submittedBy)}
                onChange={(e) => setSubmittedBy(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Discipline Category
              </label>
              <select
                className="input-field"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value as Discipline)}
              >
                <option value="PIPING">PIPING</option>
                <option value="CIVIL">CIVIL</option>
                <option value="STATIC_EQUIP">STATIC EQUIPMENT</option>
                <option value="ROTATING_EQUIP">ROTATING EQUIPMENT</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="INSTRUMENTATION">INSTRUMENTATION</option>
                <option value="HSE">HSE</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Source Date Hint (Normalized)
              </label>
              <input
                type="text"
                className="input-field"
                value={dateHint}
                onChange={(e) => setDateHint(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Raw Text / Document Payload
            </label>
            <textarea
              className="input-field font-mono"
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste raw daily report, spreadsheet text, or transcription..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              {rawText.length} characters | UTF-8 Normalized
            </span>

            <button onClick={handleProcess} className="btn btn-primary">
              <span>Ingest and Process for Review</span>
            </button>
          </div>

          {successMessage && (
            <div style={{
              background: 'var(--success-bg)',
              border: '1px solid var(--success)',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '12.5px',
              color: 'var(--oil-green)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
              <button
                onClick={() => setActiveView('extraction')}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--teal-accent)', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
              >
                Go to Extraction Workspace
              </button>
            </div>
          )}
        </div>

        {/* Right: Real-time Ingestion Stepper & Preview */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Processing Pipeline Status</h2>

          {/* Stepper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: '1. Received & Format Detected', status: 'done', detail: `${sourceType.toUpperCase()} format detected` },
              { label: '2. Text Parsing & Tokenization', status: 'done', detail: 'Token extraction & noise stop words filtered' },
              { label: '3. ISO Date Normalization', status: 'done', detail: 'Date normalized to 2026-09-12 (98% confidence)' },
              { label: '4. Ready for Activity Extraction', status: 'done', detail: 'Entity extraction pipeline unlocked' }
            ].map((step, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '10px 12px',
                background: 'var(--bg-surface-elevated)',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }}>
                <CheckCircle2 size={16} color="var(--oil-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{step.label}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{step.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Scanned Diary Bounding Box Preview */}
          {sourceType === 'diary' && (
            <div style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '11.5px'
            }}>
              <div style={{ color: 'var(--teal-accent)', fontWeight: 600, marginBottom: '6px' }}>
                Simulated OCR Bounding Box Preview
              </div>
              <div style={{
                border: '1px dashed var(--teal-accent)',
                background: 'var(--teal-subtle)',
                padding: '10px',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                fontFamily: 'monospace'
              }}>
                [OCR CONFIDENCE: 92%] Cable tray installation completed in substation corridor (42m).
              </div>
            </div>
          )}

          <div style={{
            background: 'rgba(14, 165, 233, 0.06)',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '11.5px',
            color: 'var(--text-secondary)'
          }}>
            <strong>Automatic Governance:</strong> Every ingested record is assigned an immutable cryptographic timestamp and retained permanently in the audit trail.
          </div>
        </div>
      </div>
    </div>
  );
};
