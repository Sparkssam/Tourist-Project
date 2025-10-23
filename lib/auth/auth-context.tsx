"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { UserRole, UserStatus } from '@/lib/types/user'

export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: UserRole
  status: UserStatus
  created_by?: string
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface AuthUser extends SupabaseUser {
  profile?: Profile
}

interface AuthContextType {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  isAdmin: boolean
  isStaff: boolean
  isTourist: boolean
  hasRole: (requiredRole: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await fetchUserProfile(session.user)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching profile for user:', supabaseUser.id, supabaseUser.email)
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        console.log('User email from auth:', supabaseUser.email)
        console.log('User metadata:', supabaseUser.user_metadata)
        return
      }

      console.log('Profile data fetched:', profileData)

      const userWithProfile: AuthUser = {
        ...supabaseUser,
        profile: profileData
      }

      setUser(userWithProfile)
      setProfile(profileData)
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (data.user && !error) {
      await fetchUserProfile(data.user)
    }
    
    return { error }
  }

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phone?: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          role: 'tourist' // Default role for public registration
        }
      }
    })

    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setProfile(null)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
      setUser({ ...user, profile: data })
    }

    return { error }
  }

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!profile) return false
    
    // Admin has access to everything
    if (profile.role === UserRole.ADMIN) return true
    
    // Staff has access to staff-level permissions
    if (requiredRole === UserRole.STAFF && profile.role === UserRole.STAFF) return true
    
    // Tourist can only access tourist-level permissions
    if (requiredRole === UserRole.TOURIST && profile.role === UserRole.TOURIST) return true
    
    return false
  }

  const isAdmin = profile?.role === UserRole.ADMIN
  const isStaff = profile?.role === UserRole.STAFF
  const isTourist = profile?.role === UserRole.TOURIST

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    isStaff,
    isTourist,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}