/**
 * Cookie utility functions
 */

// Set cookie
export function setCookie(name, value, days = 30) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`
  console.log(`Cookie set: ${name}`)
}

// Get cookie
export function getCookie(name) {
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }
  return null
}

// Delete cookie
export function deleteCookie(name) {
  setCookie(name, '', -1)
  console.log(`Cookie deleted: ${name}`)
}

// Get all cookies
export function getAllCookies() {
  const cookies = {}
  document.cookie.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=')
    if (name) {
      cookies[name] = decodeURIComponent(value)
    }
  })
  return cookies
}

export default { setCookie, getCookie, deleteCookie, getAllCookies }
