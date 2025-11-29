import React from 'react';

const dummyUsers = [
  {id: 1, name: 'Admin Manual', email: 'admin@ngoding.id', role: 'admin'},
  {id: 2, name: 'User Satu', email: 'user1@mail.com', role: 'user'},
  {id: 3, name: 'User Dua', email: 'user2@mail.com', role: 'user'},
];

const AdminUserTable = () => {
  return (
    <div className="admin-table-box">
      <h2>User List</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dummyUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button>Edit Role</button>
                <button style={{marginLeft:8, color:'red'}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
