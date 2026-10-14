import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { SalesView } from './views/SalesView';
import { ClientsView } from './views/ClientsView';
import { MaintenanceView } from './views/MaintenanceView';
import { RankingView } from './views/RankingView';
import { HubView } from './views/HubView';
import { UsersRolesView } from './views/UsersRolesView';
import { NewSaleModal } from './components/NewSaleModal';
import { NewClientModal } from './components/NewClientModal';
import { NewUserModal } from './components/NewUserModal';
import { ArfiAssistantModal } from './components/ArfiAssistantModal';
import { 
  Bot, 
  PlusCircle, 
  LayoutDashboard, 
  BadgePercent, 
  Users, 
  AlertTriangle, 
  Trophy, 
  Compass, 
  Sparkles 
} from 'lucide-react';

function MainLayout() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [isArfiOpen, setIsArfiOpen] = useState(false);
  const [preselectedProductId, setPreselectedProductId] = useState<string | undefined>(undefined);

  const { sales, currentUser } = useApp();
  const overdueCount = sales.filter(s => s.maintenanceStatus === 'overdue').length;

  const handleOpenSaleWithProduct = (productId: string) => {
    setPreselectedProductId(productId);
    setIsNewSaleOpen(true);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNewSale={() => {
              setPreselectedProductId(undefined);
              setIsNewSaleOpen(true);
            }}
            onOpenNewClient={() => setIsNewClientOpen(true)}
            onOpenArfi={() => setIsArfiOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        );
      case 'sales':
        return (
          <SalesView
            onOpenNewSale={() => {
              setPreselectedProductId(undefined);
              setIsNewSaleOpen(true);
            }}
            onOpenNewClient={() => setIsNewClientOpen(true)}
          />
        );
      case 'clients':
        return (
          <ClientsView
            onOpenNewClient={() => setIsNewClientOpen(true)}
            onOpenNewSale={() => {
              setPreselectedProductId(undefined);
              setIsNewSaleOpen(true);
            }}
          />
        );
      case 'maintenance':
        return <MaintenanceView />;
      case 'ranking':
        return <RankingView />;
      case 'hub':
        return (
          <HubView
            onOpenNewSaleWithProduct={handleOpenSaleWithProduct}
          />
        );
      case 'users':
        return <UsersRolesView onOpenNewUser={() => setIsNewUserOpen(true)} />;
      default:
        return (
          <DashboardView
            onOpenNewSale={() => setIsNewSaleOpen(true)}
            onOpenNewClient={() => setIsNewClientOpen(true)}
            onOpenArfi={() => setIsArfiOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewSale={() => {
          setPreselectedProductId(undefined);
          setIsNewSaleOpen(true);
        }}
        onOpenNewClient={() => setIsNewClientOpen(true)}
        onOpenArfi={() => setIsArfiOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {renderActiveView()}
      </main>

      {/* Floating Arfi Assistant Bubble */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsArfiOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 text-white shadow-xl shadow-purple-900/40 hover:shadow-purple-700/60 transition-all hover:scale-105 active:scale-95 border border-purple-400/30"
          title="Hablar con Arfi (Coach de Ventas)"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-none">Arfi IA</p>
            <p className="text-[10px] text-purple-200 leading-tight mt-0.5">Asistente Comercial</p>
          </div>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => setCurrentTab('sales')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'sales' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BadgePercent className="w-4 h-4 mb-0.5" />
          <span>Ventas</span>
        </button>

        <button
          onClick={() => {
            setPreselectedProductId(undefined);
            setIsNewSaleOpen(true);
          }}
          className="flex flex-col items-center justify-center w-10 h-10 -mt-4 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/40"
          title="Cargar venta"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentTab('maintenance')}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'maintenance' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <AlertTriangle className="w-4 h-4 mb-0.5" />
          <span>Manten.</span>
          {overdueCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setCurrentTab('hub')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
            currentTab === 'hub' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Hub</span>
        </button>
      </div>

      {/* Modals */}
      <NewSaleModal
        isOpen={isNewSaleOpen}
        onClose={() => setIsNewSaleOpen(false)}
        preselectedProductId={preselectedProductId}
      />

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
      />

      <NewUserModal
        isOpen={isNewUserOpen}
        onClose={() => setIsNewUserOpen(false)}
      />

      <ArfiAssistantModal
        isOpen={isArfiOpen}
        onClose={() => setIsArfiOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
