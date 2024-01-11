import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Home from "./views/Home";
// import {Route} from "react-router-dom";
import Router from "./router";

function App() {
  const [authentificated, setAuthentificated] = useState()

  useEffect(() => {
    const token = localStorage.setItem('token');
    if(token){
      setAuthentificated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthentificated(false);
  };
  return (
      <Router>
        <Switch>
          <Route path="/login">
            {/* Si l'utilisateur est déjà connecté, redirigez-le vers la page d'accueil */}
            {authentificated ? <Redirect to="/home" /> : <Login />}
          </Route>
          <Route path="/home">
            {/* Page d'accueil */}
            {authentificated ? <Home /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
