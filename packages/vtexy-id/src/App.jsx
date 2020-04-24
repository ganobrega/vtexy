import { h, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import './App.css';

export default () => {
  const [value, setValue] = useState(3);

  useEffect(() => {
    value > 0 && setTimeout(() => setValue(value - 1), 1000);
  }, [value]);

  useEffect(() => {
    setTimeout(() => window.location.reload(), 3000);
  });

  return (
    <main style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
      <h1>VTEXY 🚀</h1>
      <p>Loading Cookie Authentication to use in VTEX API</p>
      <p>Don't worry, we don't save the cookie anywhere, we just use it at run time.</p>
      {value > 0 ? (
        <strong style={{ marginTop: '20px' }}>Redirecting in {value}s</strong>
      ) : (
        <strong style={{ marginTop: '20px' }}>
          If you have not been redirected,{' '}
          <a href="javascript: void()" onClick={() => window.location.reload()}>
            click here
          </a>
        </strong>
      )}
    </main>
  );
};
