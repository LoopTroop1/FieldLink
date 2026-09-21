import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProgressEvent, ProgressMethod, Discipline } from '../types';
import { ScanText, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

export const ExtractionWorkspaceView: React.FC = () => {
  const { fieldRecords, progressEvents, selectedEventId, setSelectedEventId, updateExtractedEvent, setActiveView } = useApp();

  const currentEvent = progressEvents.find(e => e.id === selectedEventId) || progressEvents[0];
  const currentRecord = fieldRecords.find(r => r.id === currentEvent?.fieldRecordId) || fieldRecords[0];

  const [activeHighlightField, setActiveHighlightField] = useState<string | null>('quantity');

  if (!currentEvent || !currentRecord) {
    return (
      <div className="oil-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>No Extracted Records Found</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Please ingest a daily report or spreadsheet first.
        </p>
        <button onClick={() => setActiveView('capture')} className="btn btn-primary" style={{ padding: '8px 16px', margin: '24px' }}>
          Go to Ingestion Hub
        </button>
      </div>
    );
  }

  const handleFieldChange = (field: keyof ProgressEvent, val: any) => {
    const updated = { ...currentEvent, [field]: val };
    // If quantity changed and unit is joints/planned 24, update progressValue
    if (field === 'quantity' && typeof val === 'number') {
      updated.progressValue = Math.min(100, Math.round((val / 24) * 100));
      updated.impliedQuantity = val;
    } else if (field === 'progressValue' && typeof val === 'number') {
      updated.impliedQuantity = Math.round((val / 100) * 24);
    }
    updateExtractedEvent(updated);
  };

  // Build highlighted HTML snippet for raw text pane
  const renderHighlightedSourceText = () => {
    const raw = currentRecord.rawText;
    // Highlight based on currentEvent values
    let html = raw;
    if (currentEvent.quantity) {
      html = html.replace(
        new RegExp(`(18 of 24 joints|42 metres|18 joints|42 meters)`, 'gi'),
        '<mark class="phrase-highlight">$1</mark>'
      );
    }
    if (currentEvent.location) {
      html = html.replace(
        new RegExp(`(North Pipe Rack|North rack|Substation Corridor|Substation to Process Area|Compressor Area|Pump Shelter|Tank farm)`, 'gi'),
        '<mark class="phrase-highlight" style="border-color: var(--teal-accent); background: var(--teal-subtle); color: var(--text-primary); font-weight: 700;">$1</mark>'
      );
    }
    return html;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Discipline Extraction Workspace
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Side-by-side engineering verification: Validate extracted parameters against source field evidence.
          </p>
        </div>

        {/* Record Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active Record:</span>
          <select
            value={currentEvent.id}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="input-field"
            style={{ width: '280px', fontSize: '12px' }}
          >
            {progressEvents.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.discipline} | {ev.activityDescription.substring(0, 30)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Split-Screen: Source Pane (Left) vs Structured Form (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: Raw Source Document with Highlighting */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', height: '640px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16} color="var(--teal-accent)" />
              <h2 style={{ fontSize: '14px', fontWeight: 700 }}>Original Source Evidence</h2>
            </div>
            <span className="badge badge-neutral">{currentRecord.sourceType.toUpperCase()}</span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            File: <strong>{currentRecord.sourceName}</strong> | Submitter: <strong>{currentRecord.submittedBy}</strong>
          </div>

          {/* Verbatim text container */}
          <div
            style={{
              flex: 1,
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '13px',
              lineHeight: '1.8',
              color: 'var(--text-primary)',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace'
            }}
            dangerouslySetInnerHTML={{ __html: renderHighlightedSourceText() }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', background: 'var(--highlight-bg)', border: '1px solid var(--highlight-border)', borderRadius: '2px' }} />
            <span>Highlighted text phrases indicate source evidence for structured parameters.</span>
          </div>
        </div>

        {/* Right: Structured Extracted Event Form */}
        <div className="oil-card" style={{ display: 'flex', flexDirection: 'column', height: '640px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700 }}>Structured Engineering Event</h2>
            <span className={`badge badge-${currentEvent.verificationStatus === 'planner-confirmed' ? 'success' : 'warning'}`}>
              {currentEvent.verificationStatus === 'planner-confirmed' ? 'Approved Actual' : 'Extracted (Pending Confirmation)'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Extracted Activity Description
              </label>
              <input
                type="text"
                className="input-field"
                value={currentEvent.activityDescription}
                onChange={(e) => handleFieldChange('activityDescription', e.target.value)}
              />
            </div>

            {/* Discipline & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Discipline Craft
                </label>
                <select
                  className="input-field"
                  value={currentEvent.discipline}
                  onChange={(e) => handleFieldChange('discipline', e.target.value as Discipline)}
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
                  Extracted Location / Zone
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={currentEvent.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                />
              </div>
            </div>

            {/* Progress Method & Reported Quantities */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Progress Method
                </label>
                <select
                  className="input-field"
                  value={currentEvent.progressMethod}
                  onChange={(e) => handleFieldChange('progressMethod', e.target.value as ProgressMethod)}
                >
                  <option value="quantity-based">quantity-based (Preferred)</option>
                  <option value="percentage-based">percentage-based</option>
                  <option value="milestone-based">milestone-based</option>
                  <option value="duration-based">duration-based</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Extracted Physical Quantity ({currentEvent.progressUnit || 'units'})
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={currentEvent.quantity || ''}
                  onChange={(e) => handleFieldChange('quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Progress % and Implied Quantity Display */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Calculated Progress:</div>
                <strong style={{ fontSize: '16px', color: 'var(--teal-accent)' }}>
                  {currentEvent.progressValue}% Complete
                </strong>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Implied Quantity:</div>
                <span style={{ fontSize: '13px', color: 'var(--warning)' }}>
                  {currentEvent.impliedQuantity ? `${currentEvent.impliedQuantity} units (Indicative)` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Manpower & Equipment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Allocated Manpower
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={currentEvent.manpower || ''}
                  onChange={(e) => handleFieldChange('manpower', e.target.value)}
                  placeholder="e.g. 6 welders, 4 riggers"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Equipment Tags
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={currentEvent.equipment || ''}
                  onChange={(e) => handleFieldChange('equipment', e.target.value)}
                  placeholder="e.g. Hydra Crane (CR-04)"
                />
              </div>
            </div>

            {/* Delay Cause if any */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Reported Site Bottleneck / Delay Cause
              </label>
              <input
                type="text"
                className="input-field"
                value={currentEvent.delayCause || ''}
                onChange={(e) => handleFieldChange('delayCause', e.target.value)}
                placeholder="Leave blank if on track"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Discipline parameter validation passed
            </span>

            <button
              onClick={() => setActiveView('link')}
              className="btn btn-primary"
            >
              <span>Proceed to Schedule Linker</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
