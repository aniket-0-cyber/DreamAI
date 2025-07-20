import React from 'react';
import './App.css';
import { AddDreamForm } from './components/add-dream-form';
import { DreamList } from './components/dream-list';
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>DreamAI Journal</h1>
      </header>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <AddDreamForm />
          </div>
          <div className="md:col-span-2">
            <DreamList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;