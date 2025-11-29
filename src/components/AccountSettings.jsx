import React from 'react';
import './AccountSettings.css';

const AccountSettings = ({ user }) => {
  return (
    <div className="account-settings-container">
      <h2>Account Settings</h2>
      <div className="account-info">
        <div><strong>Name:</strong> {user?.name || '-'}</div>
        <div><strong>Email:</strong> {user?.email || '-'}</div>
      </div>
      {/* Tambahkan form update password, dsb jika perlu */}
    </div>
  );
};

export default AccountSettings;
