import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MemoryType } from '../types';
import { 
  Brain, 
  Search, 
  Sparkles, 
  Tag, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Clock, 
  Download, 
  ShieldCheck 
} from 'lucide-react';

export const ProjectMemoryView: React.FC = () => {
  const { memoryItems, delayPatterns } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const filteredItems = memoryItems.filter(item => {
    if (activeTab === 'delay-patterns') return false;
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (searchTerm) {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      if (!matchSearch) return false;
    }
    return true;
  });

  const filteredDelayPatterns = delayPatterns.filter(pattern => {
    if (activeTab !== 'all' && activeTab !== 'delay-patterns') return false;
    if (searchTerm) {
      const matchSearch =
        pattern.cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pattern.discipline.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
    }
    return true;
  });

  const getMemoryIcon = (type: MemoryType) => {
    switch (type) {
      case 'productivity': return <TrendingUp size={16} color="#10B981" />;
      case 'delay': return <AlertTriangle size={16} color="#EF4444" />;
      case 'duration': return <Clock size={16} color="#F59E0B" />;
      case 'bottleneck': return <Sparkles size={16} color="#A855F7" />;
      case 'lesson': return <Lightbulb size={16} color="var(--teal-accent)" />;
      default: return <Brain size={16} />;
    }
  };

  const handleExport = () => {
    const dataset = {
      exportedAt: new Date().toISOString(),
      platform: "FieldLink Institutional Memory Layer",
      totalMemoryArtifacts: memoryItems.length,
      totalRecurringDelayPatterns: delayPatterns.length,
      memoryItems,
      delayPatterns
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataset, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FieldLink_Institutional_Memory_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportFeedback("Exported verified execution patterns for future project planning.");
    setTimeout(() => setExportFeedback(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Institutional Project Memory
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Searchable institutional repository of real execution patterns, actual duration deltas, recurring bottleneck causes, and discipline-wise productivity benchmarks that future projects can learn from.
          </p>
        </div>

        <button 
          onClick={handleExport}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', fontSize: '12.5px' }}
        >
          <Download size={15} />
          <span>Export Planning Baseline Dataset</span>
        </button>
      </div>

      {/* Export Toast */}
      {exportFeedback && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10B981',
          borderRadius: '8px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#34D399',
          fontSize: '12.5px'
        }}>
          <ShieldCheck size={16} />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* Executive Metric Cards Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        <div className="oil-card" style={{ padding: '14px', borderLeft: '3px solid var(--teal-accent)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Verified Insights
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
            {memoryItems.length}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--teal-accent)' }}>
            Across 5 core disciplines
          </div>
        </div>

        <div className="oil-card" style={{ padding: '14px', borderLeft: '3px solid #10B981' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Productivity Benchmarks
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#10B981', margin: '4px 0' }}>
            6.0 joints/d
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Observed field velocity in North Rack
          </div>
        </div>

        <div className="oil-card" style={{ padding: '14px', borderLeft: '3px solid #F59E0B' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Duration Overrun Deltas
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B', margin: '4px 0' }}>
            +4.0 days
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Cable trench hard rock strata impact
          </div>
        </div>

        <div className="oil-card" style={{ padding: '14px', borderLeft: '3px solid #EF4444' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recurring Delay Patterns
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#EF4444', margin: '4px 0' }}>
            {delayPatterns.length} Causes
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Avg. impact: 1.8 days/occurrence
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Knowledge (${memoryItems.length + delayPatterns.length})` },
            { id: 'productivity', label: 'Productivity' },
            { id: 'duration', label: 'Duration Deltas' },
            { id: 'delay', label: 'Delays' },
            { id: 'delay-patterns', label: `Recurring Causes (${delayPatterns.length})` },
            { id: 'bottleneck', label: 'Bottlenecks' },
            { id: 'lesson', label: 'Lessons Learned' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '5px 12px', fontSize: '12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
          <input
            type="text"
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patterns, tags, equipment..."
            style={{ paddingLeft: '30px', width: '250px', fontSize: '12px' }}
          />
        </div>
      </div>

      {/* Recurring Delay Patterns Section (if all or delay-patterns) */}
      {(activeTab === 'all' || activeTab === 'delay-patterns') && filteredDelayPatterns.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="#EF4444" />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recurring Project Execution Bottlenecks & Delay Patterns
            </h2>
            <span className="badge badge-danger">{filteredDelayPatterns.length} Categorized</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {filteredDelayPatterns.map(pat => (
              <div 
                key={pat.id} 
                className="oil-card" 
                style={{ 
                  borderLeft: '4px solid #EF4444', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between' 
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-warning" style={{ textTransform: 'uppercase', fontSize: '10.5px' }}>
                      {pat.category} Category
                    </span>
                    <span className="badge badge-info">{pat.discipline}</span>
                  </div>

                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {pat.cause}
                  </h3>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Observed across <strong>{pat.occurrences} distinct execution events</strong> on site, resulting in an average schedule delay of <strong>{pat.averageImpactDays} days</strong> per incident.
                  </p>
                </div>

                <div style={{
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11.5px'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Occurrences: <strong style={{ color: '#EF4444' }}>{pat.occurrences}x</strong>
                  </span>
                  <span style={{ color: '#FBBF24', fontWeight: 600 }}>
                    Avg Impact: +{pat.averageImpactDays}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memory Items Section */}
      {filteredItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(activeTab === 'all') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <Brain size={16} color="var(--teal-accent)" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Field Intelligence, Productivity Benchmarks & Lessons
              </h2>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredItems.map(item => (
              <div key={item.id} className="oil-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {getMemoryIcon(item.type)}
                      </div>
                      <span className="badge badge-info">{item.discipline}</span>
                      <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{item.type}</span>
                    </div>

                    {item.metricValue && (
                      <span className="badge badge-success" style={{ fontSize: '12px' }}>
                        {item.metricValue}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {item.title}
                  </h3>

                  {/* Narrative Summary */}
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
                    {item.summary}
                  </p>
                </div>

                {/* Footer Tags & Date Range */}
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                    {item.tags.map(t => (
                      <span key={t} style={{
                        background: 'rgba(148, 163, 184, 0.08)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        color: 'var(--text-muted)'
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '8px'
                  }}>
                    <span>Observed: {item.dateRange}</span>
                    <span>Confidence: <strong>{item.confidence}%</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
