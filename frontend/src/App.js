
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import Navigation from './components/Navigation/Navigation';

import AuthContext from "./contexts/auth-context";

import './App.css';

class App extends Component {
  state = {
    token: null,
    userId: null,
  }
  login = (userId, token, tokenExpiration) => {
    this.setState({token, userId})
  };
  logout = () => this.setState({token: null, userId: null});

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{ 
          token: this.state.token, 
          userId: this.state.userId, 
          login: this.login, 
          logout: this.logout 
          }}>
          <Navigation />
          <main className="app-main-content">
            <Switch>
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/signup" to="/events" exact />}
              {!this.state.token && <Route path="/signup" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {this.state.token && <Route path="/bookings" component={BookingsPage} />}
              {!this.state.token && <Redirect to="/signup" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;