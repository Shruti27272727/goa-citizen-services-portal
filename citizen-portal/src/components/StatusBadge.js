
import React from 'react';

const StatusBadge = ({ status }) => {
  let color = 'gray';
  if(status === 'Pending') color = 'orange';
  if(status === 'Approved') color = 'green';
  if(status === 'Rejected') color = 'red';

  return (
    <span style={{ padding: '4px 8px', background: color, color: '#fff', borderRadius: '4px' }}>
      {status}
    </span>
  );
};

export default StatusBadge;
