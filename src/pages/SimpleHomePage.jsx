function SimpleHomePage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🎓 Ngoding - Home Page</h1>
      <p>If you see this, the app is working!</p>
      <p>If blank page appears, check browser console (F12) for errors.</p>
      
      <nav style={{ marginTop: '40px' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="/">Home</a></li>
          <li><a href="/kelas">Kelas</a></li>
          <li><a href="/testimoni">Testimoni</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
      </nav>
    </div>
  )
}

export default SimpleHomePage
