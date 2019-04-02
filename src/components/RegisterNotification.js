import React from 'react';

export default function RegisterNotification(tabs, activeTab) {
  return (
    <div
      id='register-notification'
      className='notification'
      style={{
        display: activeTab === tabs.LOGIN ? 'block' : 'none',
      }}>
      <h2>Register Successful</h2>
    </div>
  );
}
