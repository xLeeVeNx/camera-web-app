import {Navbar} from './components/Navbar/Navbar';
import React from 'react';
import {Layout} from './components/Layout/Layout.jsx';

export const App = () => {
  const [ActiveScreen, setActiveScreen] = React.useState(null);

  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };

  return (
    <div className="app">
      <Navbar isActive={!ActiveScreen} isApp={!ActiveScreen} onItemClick={handleScreenChange}/>
      {ActiveScreen && <Layout handleScreenChange={handleScreenChange}>{ActiveScreen}</Layout>}
    </div>
  );
};
