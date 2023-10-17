import React from 'react';

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ text = '' }) => (
  <div
    className="helperText"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '20px',
    }}
  >
    <h3>{text}</h3>
  </div>
);
