import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MemoryType } from '../types';
import { Brain, Search, Sparkles, Tag, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export const ProjectMemoryView: React.FC = () => {
  const { memoryItems, delayPatterns } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = memoryItems.filter(item => {
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

  const getMemoryIcon = (type: MemoryType) => {
    switch (type) {
      case 'productivity': return <TrendingUp size={16} color="#10B981" />;
      case 'delay': return <AlertTriangle size={16} color="#EF4444" />;
      case 'bottleneck': return <Sparkles size={16} color="#F59E0B" />;
      case 'lesson': return <Lightbulb size={16} color="var(--teal-accent)" />;
      default: return <Brain size={16} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Institutional Project Memory
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Searchable institutional repository of execution benchmarks, recurring bottleneck patterns, and lessons learned.
        </p>
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
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'productivity', 'delay', 'bottleneck', 'lesson'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '5px 12px', fontSize: '12px', textTransform: 'capitalize' }}
            >
              {tab === 'all' ? `All Insights (${memoryItems.length})` : tab}
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
            placeholder="Search memory insights..."
            style={{ paddingLeft: '30px', width: '240px', fontSize: '12px' }}
          />
        </div>
      </div>

      {/* Cards Grid */}
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
  );
};
