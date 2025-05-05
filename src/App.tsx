import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TournamentProvider } from './context/TournamentContext';
import { BracketView } from './components/BracketView';
import { PlayerManagement } from './components/PlayerManagement';
import { TournamentSettings } from './components/TournamentSettings';
import { TournamentInfo } from './components/TournamentInfo';
import { SaveLoad } from './components/SaveLoad';

// Define the tab interface
type Tab = 'bracket' | 'players' | 'settings' | 'info';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('bracket');

  return (
    <TournamentProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'bracket' && <BracketView />}
        {activeTab === 'players' && <PlayerManagement />}
        {activeTab === 'settings' && <TournamentSettings />}
        {activeTab === 'info' && <TournamentInfo />}
        <SaveLoad />
      </Layout>
    </TournamentProvider>
  );
}

export default App;