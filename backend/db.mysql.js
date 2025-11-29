import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { env } from 'process'

const DATA_JSON = path.resolve('./backend/data/data.json')

const DB_HOST = env.DB_HOST || '127.0.0.1'
const DB_PORT = env.DB_PORT ? Number(env.DB_PORT) : 3306
const DB_USER = env.DB_USER || 'root'
const DB_PASSWORD = env.DB_PASSWORD || ''
const DB_NAME = env.DB_NAME || 'courses_db'
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

  // create tables
  const createSql = `
  CREATE TABLE IF NOT EXISTS kelas (
    id INT PRIMARY KEY,
    title TEXT,
    image TEXT,
    price TEXT
  );
  CREATE TABLE IF NOT EXISTS testimonial (
    id INT PRIMARY KEY,
    name TEXT,
    skill TEXT,
    `desc` TEXT,
    image TEXT
  );
  CREATE TABLE IF NOT EXISTS faq (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT,
    `desc` TEXT
  );
  CREATE TABLE IF NOT EXISTS subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email TEXT UNIQUE,
    date TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    google_id VARCHAR(128) UNIQUE,
    email VARCHAR(128) UNIQUE,
    name VARCHAR(128),
    picture TEXT,
    password TEXT,
    role VARCHAR(32) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
  );

  CREATE TABLE IF NOT EXISTS login_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    ip_address VARCHAR(64),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `

  // execute multiple statements
  await pool.query(createSql)

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
  }catch(err){
    console.warn('DB seed skipped:', err.message)
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
    if (err && err.code === 'ER_DUP_ENTRY') return false
    throw err
  }
}

export default { initDB, getKelas, getTestimonial, getFaq, addSubscriber }
