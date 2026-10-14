import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Product, 
  Client, 
  Sale, 
  CommercialShift, 
  ResourceItem, 
  ArfiMessage, 
  MaintenanceStatus,
  UserPermissions
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PRODUCTS, 
  INITIAL_CLIENTS, 
  INITIAL_SALES, 
  INITIAL_SHIFTS, 
  INITIAL_RESOURCES 
} from '../data/initialData';

interface AppContextType {
  // Current user & Users
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  addUser: (userData: Omit<User, 'id' | 'joinDate'>) => void;
  updateUserPermissions: (userId: string, permissions: UserPermissions) => void;
  updateUserRole: (userId: string, roleTitle: string, permissions: UserPermissions, commissionRate: number) => void;
  
  // Products
  products: Product[];
  
  // Clients
  clients: Client[];
  addClient: (clientData: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, clientData: Partial<Client>) => void;
  
  // Sales
  sales: Sale[];
  addSale: (saleData: {
    clientId: string;
    productId: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
    maintenanceFee?: number;
    sellerId?: string;
  }) => void;
  updateSaleStatus: (saleId: string, status: Sale['paymentStatus']) => void;
  registerMaintenancePayment: (saleId: string, nextMonths?: number) => void;

  // Shifts / Turnos
  shifts: CommercialShift[];
  addShift: (shiftData: Omit<CommercialShift, 'id'>) => void;
  updateShiftStatus: (id: string, status: CommercialShift['status']) => void;

  // Resources
  resources: ResourceItem[];

  // Arfi AI
  arfiMessages: ArfiMessage[];
  isArfiLoading: boolean;
  sendArfiMessage: (text: string) => Promise<void>;
  getArfiRecommendations: () => Promise<string>;
  clearArfiChat: () => void;

  // Utilities
  triggerCelebration: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'arfa_sales_portal_users',
  CURRENT_USER_ID: 'arfa_sales_portal_curr_user',
  CLIENTS: 'arfa_sales_portal_clients',
  SALES: 'arfa_sales_portal_sales',
  SHIFTS: 'arfa_sales_portal_shifts',
  ARFI: 'arfa_sales_portal_arfi_chat',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or default seed
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || INITIAL_USERS[0].id;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SALES);
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [shifts, setShifts] = useState<CommercialShift[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const products = INITIAL_PRODUCTS;
  const resources = INITIAL_RESOURCES;

  const [arfiMessages, setArfiMessages] = useState<ArfiMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ARFI);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg-welcome',
        sender: 'arfi',
        text: `¡Hola equipo comercial! Soy **Arfi**, tu asistente y coach de ventas inteligente.

Estoy entrenado con todo el catálogo de aplicaciones de la empresa (Miniapp Starter, Miniapp Pro, Arfa Pagos, TurnosYa y más), las políticas de mantenimiento y los mejores scripts de cierre.

¿En qué puedo ayudarte hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '💡 Recomendaciones de última hora',
          '📱 ¿Cómo vendo Miniapp Starter?',
          '🛡️ Rebatir objeción: "Me parece caro"',
          '🚨 Script para reclamar mantenimiento',
        ],
      },
    ];
  });

  const [isArfiLoading, setIsArfiLoading] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARFI, JSON.stringify(arfiMessages));
  }, [arfiMessages]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0] || INITIAL_USERS[0];

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    } catch {
      // safe fallback
    }
  };

  const addUser = (userData: Omit<User, 'id' | 'joinDate'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserPermissions = (userId: string, permissions: UserPermissions) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions } : u));
  };

  const updateUserRole = (
    userId: string, 
    roleTitle: string, 
    permissions: UserPermissions, 
    commissionRate: number
  ) => {
    setUsers(prev => prev.map(u => u.id === userId ? { 
      ...u, 
      roleTitle, 
      permissions, 
      commissionRate 
    } : u));
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData } : c));
  };

  const addSale = ({
    clientId,
    productId,
    amount,
    paymentMethod,
    notes,
    maintenanceFee,
    sellerId,
  }: {
    clientId: string;
    productId: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
    maintenanceFee?: number;
    sellerId?: string;
  }) => {
    const activeSellerId = sellerId || currentUser.id;
    const seller = users.find(u => u.id === activeSellerId) || currentUser;
    const client = clients.find(c => c.id === clientId);
    const product = products.find(p => p.id === productId);

    if (!client || !product) return;

    const commissionRate = seller.commissionRate || 15;
    const commissionAmount = Number(((amount * commissionRate) / 100).toFixed(2));
    const effectiveMaintFee = maintenanceFee !== undefined ? maintenanceFee : product.maintenanceFee;

    // Next maintenance date is 1 month from today
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextMaintenanceDate = nextDate.toISOString().split('T')[0];

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      code: `VNT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`.trim(),
      clientPhone: client.phone,
      clientBusiness: client.businessName,
      sellerId: seller.id,
      sellerName: seller.name,
      productId: product.id,
      productName: product.name,
      amount,
      commissionAmount,
      date: new Date().toISOString().split('T')[0],
      paymentStatus: 'paid',
      paymentMethod,
      maintenanceStatus: 'up_to_date',
      maintenanceFee: effectiveMaintFee,
      nextMaintenanceDate,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      notes: notes || `Venta registrada por ${seller.name}`,
    };

    setSales(prev => [newSale, ...prev]);
    triggerCelebration();
  };

  const updateSaleStatus = (saleId: string, status: Sale['paymentStatus']) => {
    setSales(prev => prev.map(s => s.id === saleId ? { ...s, paymentStatus: status } : s));
  };

  const registerMaintenancePayment = (saleId: string, nextMonths = 1) => {
    setSales(prev => prev.map(s => {
      if (s.id !== saleId) return s;
      const base = new Date();
      base.setMonth(base.getMonth() + nextMonths);
      const nextDate = base.toISOString().split('T')[0];
      return {
        ...s,
        maintenanceStatus: 'up_to_date',
        nextMaintenanceDate: nextDate,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        notes: `${s.notes ? s.notes + '. ' : ''}Cuota de mantenimiento abonada el ${new Date().toLocaleDateString()}.`,
      };
    }));
    triggerCelebration();
  };

  const addShift = (shiftData: Omit<CommercialShift, 'id'>) => {
    const newShift: CommercialShift = {
      ...shiftData,
      id: `shift-${Date.now()}`,
    };
    setShifts(prev => [...prev, newShift]);
  };

  const updateShiftStatus = (id: string, status: CommercialShift['status']) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const sendArfiMessage = async (text: string) => {
    const userMsg: ArfiMessage = {
      id: `msg-u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setArfiMessages(prev => [...prev, userMsg]);
    setIsArfiLoading(true);

    try {
      // Collect seller context
      const sellerSales = sales.filter(s => s.sellerId === currentUser.id);
      const overdueCount = sales.filter(s => s.sellerId === currentUser.id && s.maintenanceStatus === 'overdue').length;
      const totalVolume = sellerSales.reduce((acc, s) => acc + s.amount, 0);

      const res = await fetch('/api/arfi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            sellerName: currentUser.name,
            sellerRole: currentUser.roleTitle,
            salesCount: sellerSales.length,
            totalVolume: `$${totalVolume.toLocaleString()}`,
            overdueCount,
          },
        }),
      });

      const data = await res.json();
      const arfiMsg: ArfiMessage = {
        id: `msg-a-${Date.now()}`,
        sender: 'arfi',
        text: data.reply || 'Aquí estoy para asesorarte.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '¿Cómo mejorar mi tasa de cierre?',
          'Darme un tip de prospección',
          'Simular objeción de tiempo',
        ],
      };
      setArfiMessages(prev => [...prev, arfiMsg]);
    } catch (err) {
      console.error('Error fetching Arfi response:', err);
      const fallbackMsg: ArfiMessage = {
        id: `msg-a-err-${Date.now()}`,
        sender: 'arfi',
        text: `¡Estoy con vos, ${currentUser.name}! Para optimizar tu día de ventas, te recomiendo enfocarte en los clientes con cuotas por vencer y ofrecer la demo de Miniapp en tus llamadas.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setArfiMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsArfiLoading(false);
    }
  };

  const getArfiRecommendations = async (): Promise<string> => {
    try {
      const sellerSales = sales.filter(s => s.sellerId === currentUser.id);
      const overdue = sales
        .filter(s => s.sellerId === currentUser.id && (s.maintenanceStatus === 'overdue' || s.maintenanceStatus === 'due_soon'))
        .map(s => ({ client: s.clientName, product: s.productName, fee: s.maintenanceFee, due: s.nextMaintenanceDate }));

      const res = await fetch('/api/arfi/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerName: currentUser.name,
          currentSales: sellerSales.length,
          overdueClients: overdue,
        }),
      });
      const data = await res.json();
      return data.recommendation;
    } catch {
      return `🎯 **Recomendación Directa:**
1. Cierra las 2 propuestas enviadas esta semana ofreciendo activación prioritaria en 24hs.
2. Contáctate con clientes morosos con el script empático de cobro.
3. Practica el pitch de Miniapp Pro para elevar tu ticket promedio.`;
    }
  };

  const clearArfiChat = () => {
    setArfiMessages([
      {
        id: 'msg-welcome-new',
        sender: 'arfi',
        text: `Chat reiniciado. ¿Qué consulta o estrategia comercial quieres revisar hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '💡 Recomendaciones de última hora',
          '📱 ¿Cómo vendo Miniapp Starter?',
          '🛡️ Rebatir objeción: "Me parece caro"',
        ],
      },
    ]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setClients(INITIAL_CLIENTS);
    setSales(INITIAL_SALES);
    setShifts(INITIAL_SHIFTS);
    clearArfiChat();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        addUser,
        updateUserPermissions,
        updateUserRole,
        products,
        clients,
        addClient,
        updateClient,
        sales,
        addSale,
        updateSaleStatus,
        registerMaintenancePayment,
        shifts,
        addShift,
        updateShiftStatus,
        resources,
        arfiMessages,
        isArfiLoading,
        sendArfiMessage,
        getArfiRecommendations,
        clearArfiChat,
        triggerCelebration,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
