import React from 'react';

export default ({ renderSpinner }) => (
  <div className='login spinner'>
    {renderSpinner()}
  </div>
);
