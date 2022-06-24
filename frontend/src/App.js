import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/navigation/Navigation';
import Context from './context/auth-context';

class App extends Component {
  state = {
    token: null,
    userId: null
  }

  login = (token,userId,tokenExporation) => {
    this.setState({token: token, userId: userId})
  };
  logout = () => {
    this.setState({token: null, userId: null})
  };
  render() {
  return (
    <BrowserRouter>
      <Context.Provider value={{token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout}}>
      <MainNavigation></MainNavigation>
      <main className='content'>
      <Routes>

        {this.state.token && <Route path="/" element={<Navigate replace to='/events'/>}></Route>}
        {this.state.token && <Route path="/auth" element={<Navigate replace to='/events'/>}></Route>}
        {!this.state.token && <Route path="/auth" element={<AuthPage/>} ></Route>}
        <Route path="/events" element={<EventsPage/>} ></Route>
        {this.state.token && <Route path="/bookings" element={<BookingsPage/>} ></Route>}
        {!this.state.token && <Route path="/" element={<Navigate replace to='/auth'/>}></Route>}
        {!this.state.token && <Route path="/bookings" element={<Navigate replace to='/auth'/>}></Route>}
      </Routes>
      </main>
      </Context.Provider>
    </BrowserRouter>
  );
  }
}

export default App;
