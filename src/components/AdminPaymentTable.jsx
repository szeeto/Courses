import React from 'react';

const dummyPayments = [
  {id: 1, user: 'User Satu', amount: 100000, status: 'pending'},
  {id: 2, user: 'User Dua', amount: 200000, status: 'confirmed'},
];

const AdminPaymentTable = () => {
  return (
    <div className="admin-table-box">
      <h2>Payment Confirmation</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dummyPayments.map(pay => (
            <tr key={pay.id}>
              <td>{pay.user}</td>
              <td>Rp {pay.amount.toLocaleString()}</td>
              <td>{pay.status}</td>
              <td>
                {pay.status === 'pending' ? <button>Confirm</button> : <span>✔️</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPaymentTable;
