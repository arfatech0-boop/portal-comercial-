export type RoleId = 
  | 'admin'
  | 'senior_seller'
  | 'miniapp_payments'
  | 'junior_seller'
  | 'support';

export interface UserPermissions {
  canCreateSales: boolean;
  canManageClients: boolean;
  canManageMaintenance: boolean;
  canManageUsers: boolean;
  canViewLeaderboard: boolean;
  canAccessHub: boolean;
  canConsultArfi: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleId;
  roleTitle: string;
  avatar: string;
  permissions: UserPermissions;
  commissionRate: number; // e.g., 15 for 15%
  monthlyTarget: number; // en pesos ($)
  active: boolean;
  joinDate: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'miniapp' | 'pagos' | 'turnos' | 'gestion' | 'web';
  price: number;
  maintenanceFee: number;
  commissionPct: number;
  description: string;
  shortPitch: string;
  iconName: string;
  badge?: string;
  demoUrl?: string;
  features: string[];
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  businessName: string;
  businessType: string;
  city?: string;
  assignedSellerId: string;
  assignedSellerName: string;
  createdAt: string;
  notes?: string;
}

export type PaymentStatus = 'paid' | 'partial' | 'pending';
export type MaintenanceStatus = 'up_to_date' | 'due_soon' | 'overdue' | 'suspended';

export interface Sale {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientBusiness: string;
  sellerId: string;
  sellerName: string;
  productId: string;
  productName: string;
  amount: number;
  commissionAmount: number;
  date: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  maintenanceStatus: MaintenanceStatus;
  maintenanceFee: number;
  nextMaintenanceDate: string;
  lastPaymentDate?: string;
  notes?: string;
}

export interface CommercialShift {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string;
  sellerId: string;
  sellerName: string;
  date: string;
  time: string;
  type: 'demo_miniapp' | 'cierre_pagos' | 'onboarding' | 'soporte' | 'seguimiento';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  meetLink?: string;
  notes?: string;
}

export interface ResourceItem {
  id: string;
  category: 'scripts' | 'guias' | 'politicas' | 'marketing';
  title: string;
  description: string;
  readTime: string;
  tags: string[];
  content: string;
  updatedAt: string;
}

export interface ArfiMessage {
  id: string;
  sender: 'user' | 'arfi';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isStreaming?: boolean;
}
