
import React from 'react';

const Input = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ padding: '8px', width: '100%', marginTop: '4px' }}
      />
    </div>
  );
};

export default Input;
