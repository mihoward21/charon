import React from 'react';
import './App.css';

import LineGraph from './LineGraph';
import { logEvent } from '../utils/logger';

const amplitude = require('amplitude-js');


function App() {
  // Init amplitude
  let amplitudeApiKey = 'fae6173bbe1ab37e4aaf4a16f11e66d7'; // Dev key
  if (process.env.NODE_ENV === 'production') {
    amplitudeApiKey = '068c2dc952a0db9ba1e1023b1536a1db'; // Prod key
  }
  amplitude.getInstance().init(amplitudeApiKey);

  // Fire pageview
  logEvent('pageview: home', {});

  return (
    <div className="App">
      <header className="App-header">
        <LineGraph />
        <p className="support-text">Questions? Email <a href="mailto:support@charonapp.com">support@charonapp.com</a></p>
      </header>
    </div>
  );
}

export default App;
