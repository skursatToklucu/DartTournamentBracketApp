import React, { ReactNode } from 'react';
import { Target, Users, Settings, Info } from 'lucide-react';

type Tab = 'bracket' | 'players' | 'settings' | 'info';

interface LayoutProps {
  children: ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Dart Tournament Bracket</h1>
          </div>
          <nav className="hidden md:flex space-x-4">
            <NavItem 
              label="Bracket" 
              active={activeTab === 'bracket'} 
              onClick={() => setActiveTab('bracket')}
              icon={<Target className="w-5 h-5" />}
            />
            <NavItem 
              label="Players" 
              active={activeTab === 'players'} 
              onClick={() => setActiveTab('players')}
              icon={<Users className="w-5 h-5" />}
            />
            <NavItem 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
              icon={<Settings className="w-5 h-5" />}
            />
            <NavItem 
              label="Info" 
              active={activeTab === 'info'} 
              onClick={() => setActiveTab('info')}
              icon={<Info className="w-5 h-5" />}
            />
          </nav>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Mobile Navigation */}
        <div className="md:hidden bg-gray-800 text-white">
          <div className="flex justify-between px-2">
            <button 
              className={`py-3 px-4 flex items-center space-x-2 ${activeTab === 'bracket' ? 'bg-green-700' : ''}`}
              onClick={() => setActiveTab('bracket')}
            >
              <Target className="w-5 h-5" />
              <span>Bracket</span>
            </button>
            <button 
              className={`py-3 px-4 flex items-center space-x-2 ${activeTab === 'players' ? 'bg-green-700' : ''}`}
              onClick={() => setActiveTab('players')}
            >
              <Users className="w-5 h-5" />
              <span>Players</span>
            </button>
            <button 
              className={`py-3 px-4 flex items-center space-x-2 ${activeTab === 'settings' ? 'bg-green-700' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button 
              className={`py-3 px-4 flex items-center space-x-2 ${activeTab === 'info' ? 'bg-green-700' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <Info className="w-5 h-5" />
              <span>Info</span>
            </button>
          </div>
        </div>

        {/* Sidebar - Desktop Only */}
        <aside className="hidden md:block w-64 bg-gray-800 text-white">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Tournament</h2>
            <nav className="space-y-2">
              <SidebarItem 
                label="Bracket" 
                active={activeTab === 'bracket'} 
                onClick={() => setActiveTab('bracket')}
                icon={<Target className="w-5 h-5" />}
              />
              <SidebarItem 
                label="Players" 
                active={activeTab === 'players'} 
                onClick={() => setActiveTab('players')}
                icon={<Users className="w-5 h-5" />}
              />
              <SidebarItem 
                label="Settings" 
                active={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
                icon={<Settings className="w-5 h-5" />}
              />
              <SidebarItem 
                label="Info" 
                active={activeTab === 'info'} 
                onClick={() => setActiveTab('info')}
                icon={<Info className="w-5 h-5" />}
              />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ label, active, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
        active ? 'bg-green-800' : 'hover:bg-green-800/60'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

interface SidebarItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, active, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
        active ? 'bg-green-700' : 'hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};