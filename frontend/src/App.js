import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/navigation/Navigation';

function App() {
  return (
    <BrowserRouter>
      <MainNavigation></MainNavigation>
      <main className='content'>
      <Routes>
        <Route path="/" element={<Navigate replace to='/auth'/>}></Route>
        <Route path="/auth" element={<AuthPage/>} ></Route>
        <Route path="/events" element={<EventsPage/>} ></Route>
        <Route path="/bookings" element={<BookingsPage/>} ></Route>
      </Routes>
      </main>

    </BrowserRouter>
  );
}

export default App;
