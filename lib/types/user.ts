// User Role Types
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  TOURIST = 'tourist'
}

// User Status Types
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

// Base User Interface
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  createdBy?: string // ID of admin who created the user (for staff/admin users)
}

// Registration Data for Tourists (public registration)
export interface TouristRegistrationData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  password: string
  confirmPassword: string
}

// Admin User Creation Data (for creating staff/admin users)
export interface AdminUserCreationData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole.ADMIN | UserRole.STAFF
  temporaryPassword?: string
  sendWelcomeEmail?: boolean
}

// User Update Data
export interface UserUpdateData {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  status?: UserStatus
  role?: UserRole
}

// Login Data
export interface LoginData {
  email: string
  password: string
}

// Revenue/Payment Interface
export interface PaymentRecord {
  id: string
  userId: string
  user: Pick<User, 'firstName' | 'lastName' | 'email'>
  tourId?: string
  tourName?: string
  amount: number
  currency: string
  paymentMethod: 'pesapal' | 'bank_transfer' | 'cash' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  createdAt: Date
  completedAt?: Date
  description?: string
}

// Revenue Summary Interface
export interface RevenueSummary {
  totalRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  pendingPayments: number
  completedPayments: number
  recentPayments: PaymentRecord[]
  monthlyTrends: {
    month: string
    revenue: number
    bookings: number
  }[]
}

// Tourist Inquiry Interface (for staff to view)
export interface TouristInquiry {
  id: string
  userId: string
  user: Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>
  tourType: string
  numberOfPeople: number
  preferredDate: Date
  budget?: number
  specialRequests?: string
  status: 'new' | 'in_progress' | 'responded' | 'completed' | 'cancelled'
  assignedStaffId?: string
  createdAt: Date
  updatedAt: Date
  notes?: string
}

// Dashboard Stats Interface
export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  touristCount: number
  staffCount: number
  adminCount: number
  totalInquiries: number
  pendingInquiries: number
  totalRevenue: number
  monthlyRevenue: number
}

// Auth Context Interface
export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: TouristRegistrationData) => Promise<void>
  isAdmin: boolean
  isStaff: boolean
  isTourist: boolean
}

// Permission helpers
export const hasPermission = (user: User | null, requiredRole: UserRole): boolean => {
  if (!user || user.status !== UserStatus.ACTIVE) return false
  
  // Admin has access to everything
  if (user.role === UserRole.ADMIN) return true
  
  // Staff can access staff-level permissions
  if (requiredRole === UserRole.STAFF && user.role === UserRole.STAFF) return true
  
  // Tourist can only access tourist-level permissions
  if (requiredRole === UserRole.TOURIST && user.role === UserRole.TOURIST) return true
  
  return false
}

// Role display helpers
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrator'
    case UserRole.STAFF:
      return 'Staff Member'
    case UserRole.TOURIST:
      return 'Tourist'
    default:
      return 'Unknown'
  }
}

export const getStatusDisplayName = (status: UserStatus): string => {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'Active'
    case UserStatus.INACTIVE:
      return 'Inactive'
    case UserStatus.PENDING:
      return 'Pending'
    default:
      return 'Unknown'
  }
}