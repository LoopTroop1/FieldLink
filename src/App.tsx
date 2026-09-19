import React, { useState } from 'react';
import { AppProvider, useApp, AppView } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { NavigationRail } from './components/layout/NavigationRail';
import { GuidedDemoBanner } from './components/layout/GuidedDemoBanner';

import { OperationsOverviewView } from './views/OperationsOverviewView';
import { DataIngestionView } from './views/DataIngestionView';
import { ExtractionWorkspaceView } from './views/ExtractionWorkspaceView';
import { ScheduleLinkerView } from './views/ScheduleLinkerView';
import { PlannerReviewQueueView } from './views/PlannerReviewQueueView';
import { TimeAgentView } from './views/TimeAgentView';
import { LiveScheduleGanttView } from './views/LiveScheduleGanttView';
import { AnalyticsView } from './views/AnalyticsView';
import { ProjectMemoryView } from './views/ProjectMemoryView';
import { AuditTrailView } from './views/AuditTrailView';
import { SettingsView } from './views/SettingsView';

import { P6PayloadDrawer } from './components/drawers/P6PayloadDrawer';
import { EvidenceTraceDrawer } from './components/drawers/EvidenceTraceDrawer';
import { LoginView } from './views/LoginView';

const AppContent: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    inspectingP6Activity, 
    setInspectingP6Activity,
    tracingEvidenceActivity,
    setTracingEvidenceActivity,
    isAuthenticated
  } = useApp();

  // If user is logged out, show enterprise login page
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const [isGuidedDemoActive, setIsGuidedDemoActive] = useState<boolean>(false);
  const [guidedStep, setGuidedStep] = useState<number>(0);

  const demoStepsViews: AppView[] = ['ingestion', 'linker', 'review', 'schedule', 'analytics'];

  const handleStartGuidedDemo = () => {
    setIsGuidedDemoActive(true);
    setGuidedStep(0);
    setActiveView('ingestion');
  };

  const handleNextDemoStep = () => {
    const next = guidedStep + 1;
    if (next < demoStepsViews.length) {
      setGuidedStep(next);
      setActiveView(demoStepsViews[next]);
    } else {
      setIsGuidedDemoActive(false);
    }
  };

  const handleExitDemo = () => {
    setIsGuidedDemoActive(false);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <OperationsOverviewView />;
      case 'ingestion':
        return <DataIngestionView />;
      case 'extraction':
        return <ExtractionWorkspaceView />;
      case 'linker':
        return <ScheduleLinkerView />;
      case 'review':
        return <PlannerReviewQueueView />;
      case 'time-agent':
        return <TimeAgentView />;
      case 'schedule':
        return <LiveScheduleGanttView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'memory':
        return <ProjectMemoryView />;
      case 'audit':
        return <AuditTrailView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OperationsOverviewView />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Persistent Global TopBar */}
      <TopBar onStartGuidedDemo={handleStartGuidedDemo} />

      {/* Guided Walkthrough Banner if active */}
      {isGuidedDemoActive && (
        <GuidedDemoBanner
          currentStep={guidedStep}
          onNextStep={handleNextDemoStep}
          onExit={handleExitDemo}
        />
      )}

      {/* Main Workspace Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Navigation Rail */}
        <NavigationRail />

        {/* Scrollable View Content Canvas */}
        <main style={{
          flex: 1,
          height: '100%',
          overflowY: 'auto',
          padding: '24px 32px',
          background: 'var(--bg-base)'
        }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Drawers */}
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

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
