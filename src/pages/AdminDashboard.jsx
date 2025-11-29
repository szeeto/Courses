import React, { useState } from 'react';
import AdminUserTable from '../components/AdminUserTable';
import AdminPaymentTable from '../components/AdminPaymentTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [tab, setTab] = useState('users');
  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <span className="admin-dashboard-icon">🛡️</span>
        <h1>Admin Dashboard</h1>
        <p className="admin-dashboard-desc">Kelola user, pembayaran, dan data website dengan mudah dan aman.</p>
      </div>
      <div className="admin-tabs">
        <button className={tab==='users' ? 'active' : ''} onClick={()=>setTab('users')}>
          <span className="tab-icon">👥</span> User Management
        </button>
        <button className={tab==='payments' ? 'active' : ''} onClick={()=>setTab('payments')}>
          <span className="tab-icon">💳</span> Payment Confirmation
        </button>
      </div>
      <div className="admin-tab-content">
        {tab==='users' && <AdminUserTable />}
        {tab==='payments' && <AdminPaymentTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;
