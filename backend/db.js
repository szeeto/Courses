import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { env } from 'process'

// Load .env from parent directory (root)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const DATA_JSON = path.resolve('./backend/data/data.json')

const DB_HOST = env.DB_HOST || '127.0.0.1'
const DB_PORT = env.DB_PORT ? Number(env.DB_PORT) : 3306
const DB_USER = env.DB_USER || 'root'
const DB_PASSWORD = env.DB_PASSWORD || ''
const DB_NAME = env.DB_NAME || 'courses_db'

console.log('DB_HOST:', DB_HOST)
console.log('DB_USER:', DB_USER)
console.log('DB_PASSWORD:', DB_PASSWORD ? '***' : '(empty)')
console.log('DB_NAME:', DB_NAME)

let pool

export async function initDB(){
  // create database if not exists
  const tmpConn = await mysql.createConnection({host:DB_HOST, port:DB_PORT, user:DB_USER, password:DB_PASSWORD})
  await tmpConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``)
  await tmpConn.end()

  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  })

  // Create all tables
  const createStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      google_id VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE,
      name VARCHAR(255),
      password VARCHAR(255),
      picture TEXT,
      role VARCHAR(32) DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL
    )`,
    `CREATE TABLE IF NOT EXISTS login_history (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(64),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS kelas (
      id INT PRIMARY KEY,
      title TEXT,
      image TEXT,
      price TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS testimonial (
      id INT PRIMARY KEY,
      name TEXT,
      skill TEXT,
      \`desc\` TEXT,
      image TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS faq (
      id VARCHAR(64) PRIMARY KEY,
      title TEXT,
      \`desc\` TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS subscribers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE,
      date TEXT
    )`
  ]

  // execute each statement separately
  for (const sql of createStatements) {
    await pool.query(sql)
  }

  console.log('All tables created successfully')

  // seed from data.json if tables empty
  try{
    const raw = fs.readFileSync(DATA_JSON,'utf-8')
    const parsed = JSON.parse(raw)

    const [rowsK] = await pool.query('SELECT COUNT(1) as c FROM kelas')
    if(rowsK[0].c === 0 && Array.isArray(parsed.kelas)){
      const insert = 'INSERT INTO kelas (id,title,image,price) VALUES ?'
      const values = parsed.kelas.map(it=>[it.id,it.title,it.image,it.price])
      if(values.length) await pool.query(insert,[values])
    }

    const [rowsT] = await pool.query('SELECT COUNT(1) as c FROM testimonial')
    if(rowsT[0].c === 0 && Array.isArray(parsed.testimonial)){
      const insert = 'INSERT INTO testimonial (id,name,skill,`desc`,image) VALUES ?'
      const values = parsed.testimonial.map(it=>[it.id,it.name,it.skill,it.desc,it.image])
      if(values.length) await pool.query(insert,[values])
    }

    const [rowsF] = await pool.query('SELECT COUNT(1) as c FROM faq')
    if(rowsF[0].c === 0 && Array.isArray(parsed.faq)){
      const insert = 'INSERT INTO faq (id,title,`desc`) VALUES ?'
      const values = parsed.faq.map(it=>[it.id,it.title,it.desc])
      if(values.length) await pool.query(insert,[values])
    }
  }catch{
    console.warn('DB seed skipped')
  }
}

export async function getKelas(){
  const [rows] = await pool.query('SELECT * FROM kelas ORDER BY id')
  return rows
}

export async function getTestimonial(){
  const [rows] = await pool.query('SELECT * FROM testimonial ORDER BY id')
  return rows
}

export async function getFaq(){
  const [rows] = await pool.query('SELECT * FROM faq ORDER BY id')
  return rows
}

export async function addSubscriber(email){
  try{
    const [result] = await pool.query('INSERT INTO subscribers (email,date) VALUES (?,?)',[email,new Date().toISOString()])
    return result.affectedRows > 0
  }catch(err){
    // duplicate key will throw
    console.error('addSubscriber error', err)
    return false
  }
}

export async function getUserByGoogleId(googleId){
  const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId])
  return rows[0] || null
}

export async function createOrUpdateUser(googleId, email, name, picture){
  try{
    console.log('Creating or updating user:', { googleId, email, name })
    
    const existingUser = await getUserByGoogleId(googleId)
    
    if(existingUser){
      console.log('User already exists, updating:', { id: existingUser.id, email })
      // Update existing user and return updated data
      await pool.query('UPDATE users SET name = ?, picture = ?, updated_at = NOW() WHERE google_id = ?', [name, picture, googleId])
      const [updatedUser] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId])
      console.log('User updated successfully:', { id: updatedUser[0].id, updated_at: updatedUser[0].updated_at })
      return updatedUser[0]
    }
    
    // Create new user
    console.log('Creating new user:', { googleId, email, name })
    const [result] = await pool.query('INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)', [googleId, email, name, picture])
    const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId])
    console.log('New user created successfully:', { id: newUser[0].id, email: newUser[0].email, created_at: newUser[0].created_at })
    return newUser[0]
  }catch(err){
    console.error('createOrUpdateUser error:', err.message)
    return null
  }
}

export async function getUserById(userId){
  const [rows] = await pool.query('SELECT id, email, name, picture FROM users WHERE id = ?', [userId])
  return rows[0] || null
}

export { pool }
export default { initDB, getKelas, getTestimonial, getFaq, addSubscriber, getUserByGoogleId, createOrUpdateUser, getUserById, pool }