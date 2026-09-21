import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { TopNavigation } from './components/layout/TopNavigation';

import { DataIngestionView } from './views/DataIngestionView';
import { TimeAgentView } from './views/TimeAgentView';
import { ExtractionWorkspaceView } from './views/ExtractionWorkspaceView';
import { ScheduleLinkerView } from './views/ScheduleLinkerView';
import { PlannerReviewQueueView } from './views/PlannerReviewQueueView';
import { LiveScheduleGanttView } from './views/LiveScheduleGanttView';
import { AnalyticsView } from './views/AnalyticsView';

import { P6PayloadDrawer } from './components/drawers/P6PayloadDrawer';
import { EvidenceTraceDrawer } from './components/drawers/EvidenceTraceDrawer';

const AppContent: React.FC = () => {
  const { 
    activeView, 
    inspectingP6Activity, 
    setInspectingP6Activity,
    tracingEvidenceActivity,
    setTracingEvidenceActivity
  } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'capture':
        return <DataIngestionView />;
      case 'agent':
        return <TimeAgentView />;
      case 'extract':
        return <ExtractionWorkspaceView />;
      case 'link':
        return <ScheduleLinkerView />;
      case 'review':
        return <PlannerReviewQueueView />;
      case 'schedule':
        return <LiveScheduleGanttView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DataIngestionView />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      background: 'var(--bg-base)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      <TopBar />
      <TopNavigation />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '24px',
        position: 'relative'
      }}>
        {renderActiveView()}
      </main>

      {/* Global Application Drawers */}
      <P6PayloadDrawer 
        activity={inspectingP6Activity}
        onClose={() => setInspectingP6Activity(null)}
      />

      <EvidenceTraceDrawer
        activity={tracingEvidenceActivity}
        onClose={() => setTracingEvidenceActivity(null)}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
