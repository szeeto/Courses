import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { env } from 'process'

// Load .env from parent directory (root)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const DATA_JSON = path.resolve(__dirname, 'data/data.json')

const SUPABASE_URL = env.SUPABASE_URL
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env')
}

console.log('SUPABASE_URL:', SUPABASE_URL)
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '***' : '(empty)')

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function initDB(){
  // Note: Tables should be created manually in Supabase dashboard or via SQL
  // For now, assuming tables exist

  console.log('Database initialized with Supabase')

  // seed from data.json if tables empty
  try{
    const raw = fs.readFileSync(DATA_JSON,'utf-8')
    const parsed = JSON.parse(raw)

    // Check and seed kelas
    const { data: kelasData, error: kelasError } = await supabase.from('kelas').select('id').limit(1)
    if (kelasError) {
      console.error('Error checking kelas:', kelasError)
    } else if (kelasData && kelasData.length === 0 && Array.isArray(parsed.kelas)){
      const { error } = await supabase.from('kelas').insert(parsed.kelas)
      if (error) console.error('Error seeding kelas:', error)
    }

    // Check and seed testimonial
    const { data: testimonialData, error: testimonialError } = await supabase.from('testimonial').select('id').limit(1)
    if (testimonialError) {
      console.error('Error checking testimonial:', testimonialError)
    } else if (testimonialData && testimonialData.length === 0 && Array.isArray(parsed.testimonial)){
      const { error } = await supabase.from('testimonial').insert(parsed.testimonial)
      if (error) console.error('Error seeding testimonial:', error)
    }

    // Check and seed faq
    const { data: faqData, error: faqError } = await supabase.from('faq').select('id').limit(1)
    if (faqError) {
      console.error('Error checking faq:', faqError)
    } else if (faqData && faqData.length === 0 && Array.isArray(parsed.faq)){
      const { error } = await supabase.from('faq').insert(parsed.faq)
      if (error) console.error('Error seeding faq:', error)
    }
  }catch(err){
    console.warn('DB seed skipped:', err.message)
  }
}

export async function getKelas(){
  const { data, error } = await supabase.from('kelas').select('*').order('id')
  if (error) throw error
  return data
}

export async function getTestimonial(){
  const { data, error } = await supabase.from('testimonial').select('*').order('id')
  if (error) throw error
  return data
}

export async function getFaq(){
  const { data, error } = await supabase.from('faq').select('*').order('id')
  if (error) throw error
  return data
}

export async function addSubscriber(email){
  try{
    const { error } = await supabase.from('subscribers').insert({ email, date: new Date().toISOString() })
    return !error
  }catch(err){
    console.error('addSubscriber error', err)
    return false
  }
}

export async function getUserByGoogleId(googleId){
  const { data, error } = await supabase.from('users').select('*').eq('google_id', googleId).single()
  if (error && error.code !== 'PGRST116') throw error // PGRST116 is not found
  return data || null
}

export async function createOrUpdateUser(googleId, email, name, picture){
  try{
    console.log('Creating or updating user:', { googleId, email, name })
    
    const existingUser = await getUserByGoogleId(googleId)
    
    if(existingUser){
      console.log('User already exists, updating:', { id: existingUser.id, email })
      const { data, error } = await supabase.from('users').update({ name, picture, updated_at: new Date().toISOString() }).eq('google_id', googleId).select().single()
      if (error) throw error
      console.log('User updated successfully:', { id: data.id, updated_at: data.updated_at })
      return data
    }
    
    // Create new user
    console.log('Creating new user:', { googleId, email, name })
    const { data, error } = await supabase.from('users').insert({ google_id: googleId, email, name, picture }).select().single()
    if (error) throw error
    console.log('New user created successfully:', { id: data.id, email: data.email, created_at: data.created_at })
    return data
  }catch(err){
    console.error('createOrUpdateUser error:', err.message)
    return null
  }
}

export async function getUserById(userId){
  const { data, error } = await supabase.from('users').select('id, email, name, picture').eq('id', userId).single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

export { supabase }
export default { initDB, getKelas, getTestimonial, getFaq, addSubscriber, getUserByGoogleId, createOrUpdateUser, getUserById, supabase }