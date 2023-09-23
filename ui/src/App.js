import React from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';

export default function App() {

  return <div>
    <SearchForm />
    <SearchResults />
  </div>;
}
