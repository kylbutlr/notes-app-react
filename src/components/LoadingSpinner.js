import React from 'react';

export default ({ renderSpinner }) => (
  <div className='spinner-div'>
    {renderSpinner()}
  </div>
);
