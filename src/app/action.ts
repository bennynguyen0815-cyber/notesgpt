'use server'

import { createClient } from './auth/server'
import { prisma } from '../db/prisma'

export async function loginAction(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { errorMessage: error?.message }
}

export async function signUpAction(email: string, password: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (!error && data.user) {
    try {
      await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
        },
      })
    } catch (dbError) {
      console.error('Failed to create user in database:', dbError)
    }
  }
  
  return { errorMessage: error?.message }
}