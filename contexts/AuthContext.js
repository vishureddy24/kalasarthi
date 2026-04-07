'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken()
      const res = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUserProfile(data.profile)
        return data.profile
      }
      setUserProfile(null)
      return null
    } catch (err) {
      console.error('Failed to fetch profile:', err)
      setUserProfile(null)
      return null
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      if (firebaseUser) {
        setUser(firebaseUser)
        await fetchProfile(firebaseUser)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [fetchProfile])

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result
  }

  const register = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(result.user, { displayName })
    }
    return result
  }

  const demoLogin = async () => {
    const email = 'demo@kalasarthi.com'
    const password = 'Demo@123456'
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: 'Demo User' })
        return result
      }
      throw err
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setUserProfile(null)
  }

  const refreshProfile = useCallback(async () => {
    if (user) {
      return fetchProfile(user)
    }
    return null
  }, [user, fetchProfile])

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      login,
      register,
      demoLogin,
      logout,
      refreshProfile,
      isAuthenticated: !!user,
      isOnboarded: userProfile?.isOnboarded || false,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
