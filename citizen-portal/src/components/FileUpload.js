
import React from 'react';

const FileUpload = ({ onChange }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <input type="file" onChange={onChange} />
    </div>
  );
};

export default FileUpload;
