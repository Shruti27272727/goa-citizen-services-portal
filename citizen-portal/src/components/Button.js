
import React from 'react';

const Button = ({ text, onClick, type = "button" }) => {
  return (
    <button type={type} onClick={onClick} style={{ padding: '8px 16px', cursor: 'pointer' }}>
      {text}
    </button>
  );
};

export default Button;
