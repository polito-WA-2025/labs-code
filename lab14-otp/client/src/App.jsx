/*
 * Web Applications
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Routes, Route, Outlet, Link, useParams, Navigate, useNavigate } from 'react-router';

//import FILMS from './films';

import { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout, LoginLayout, TotpLayout } from './components/Layout';
import API from './API.js';

function App() {

  const navigate = useNavigate();  // To be able to call useNavigate, the component must already be in BrowserRouter, done in main.jsx

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);
  // This state contains the user's info.
  const [user, setUser] = useState(null);
  const [loggedInTotp, setLoggedInTotp] = useState(false);


  const [filmList, setFilmList] = useState([]);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(true);

  // If an error occurs, the error message will be shown using a state.
  const handleErrors = (err) => {
    //console.log('DEBUG: err: '+JSON.stringify(err));
    let msg = '';
    if (err.error)
      msg = err.error;
    else if (err.errors) {
      if (err.errors[0].msg)
        msg = err.errors[0].msg + " : " + err.errors[0].path;
    } else if (Array.isArray(err))
      msg = err[0].msg + " : " + err[0].path;
    else if (typeof err === "string") msg = String(err);
    else msg = "Unknown Error";

    setMessage(msg); // WARNING: a more complex application requires a queue of messages. In this example only the last error is shown.

    if (msg === 'Not authenticated')
      setTimeout(() => {  // do logout in the app state
        setUser(undefined); setLoggedIn(false); setLoggedInTotp(false); setDirty(true);
      }, 2000);
    else
      setTimeout(()=>setDirty(true), 2000);  // Fetch the current version from server, after a while
  }

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
        if (user.isTotp)
          setLoggedInTotp(true);
      } catch(err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);  // The useEffect callback is called only the first time the component is mounted.


  /**
   * Defining a structure for Filters
   * Each filter is identified by a unique name and is composed by the following fields:
   * - A label to be shown in the GUI
   * - A URL for the router
   * - A filter function applied before passing the films to the FilmTable component
   */
  const filters = {
    'all': { label: 'All', url: '/', filterFunction: () => true },
    'favorite': { label: 'Favorites', url: '/filter/favorite', filterFunction: film => film.favorite },
    'best': { label: 'Best Rated', url: '/filter/best', filterFunction: film => film.rating >= 5 },
    'lastmonth': { label: 'Seen Last Month', url: '/filter/lastmonth', filterFunction: film => isSeenLastMonth(film) },
    'unseen': { label: 'Unseen', url: '/filter/unseen', filterFunction: film => film.watchDate ? false : true }
  };

  const isSeenLastMonth = (film) => {
    if ('watchDate' in film) {  // Accessing watchDate only if defined
      const diff = film.watchDate.diff(dayjs(), 'month')
      const isLastMonth = diff <= 0 && diff > -1;      // last month
      return isLastMonth;
    }
  }

  const filtersToArray = Object.entries(filters);
  //console.log(JSON.stringify(filtersToArray));

  // NB: to implicitly return an object in an arrow function, use () around the object {}
  // const filterArray = filtersToArray.map( e => ({filterName: e[0], ...e[1]}) );
  // alternative with destructuring directly in the parameter of the callback 
  const filterArray = filtersToArray.map(([filterName, obj ]) =>
     ({ filterName: filterName, ...obj }));

  /**
   * This function handles the login process.
   * It requires a username and a password inside a "credentials" object.
   */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  /**
   * This function handles the logout process.
   */ 
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setLoggedInTotp(false);
    // clean up everything
    setUser(null);
    setFilmList([]);
  };



  function deleteFilm(filmId) {
    API.deleteFilm(filmId)
      .then(()=> setDirty(true))
      .catch(err=>handleErrors(err));
  }

  function editFilm(film) {
    API.updateFilm(film)
      .then(()=>{setDirty(true); navigate('/');})
      .catch(err=>handleErrors(err));
  }

  function setFilmFavorite(id, favorite) {
    API.setFilmFavorite(id, favorite)
      .then(()=>{setDirty(true); navigate('/');})
      .catch(err=>handleErrors(err));
  }

  function setFilmRating(id, favorite) {
    API.setFilmRating(id, favorite)
      .then(()=>{setDirty(true); navigate('/');})
      .catch(err=>handleErrors(err));
  }

  function addFilm(film) {
    API.addFilm(film)
      .then(()=>{setDirty(true); navigate('/');})
      .catch(err=>handleErrors(err));
  }

  return (
      <Container fluid>
        <Routes>
          <Route path="/" element={loggedIn? <GenericLayout filterArray={filterArray} 
                                    message={message} setMessage={setMessage}
                                    loggedIn={loggedIn} user={user} loggedInTotp={loggedInTotp} 
                                    logout={handleLogout} /> : <Navigate replace to='/login' />} >
            <Route index element={loggedIn? <TableLayout 
                 filmList={filmList} setFilmList={setFilmList} filters={filters} 
                 deleteFilm={deleteFilm} editFilm={editFilm}
                 setFilmFavorite={setFilmFavorite} setFilmRating={setFilmRating}
                 disableActions={!loggedInTotp}
                 handleErrors={handleErrors}
                 dirty={dirty} setDirty={setDirty} /> : <Navigate replace to='/' />} />
            <Route path="add" element={loggedInTotp? <AddLayout addFilm={addFilm} /> : <Navigate replace to='/' />} />
            <Route path="edit/:filmId" element={loggedInTotp? <EditLayout films={filmList} editFilm={editFilm} /> : <Navigate replace to='/' />} />
            <Route path="filter/:filterId" element={loggedIn? <TableLayout 
                 filmList={filmList} setFilmList={setFilmList}
                 filters={filters} deleteFilm={deleteFilm} editFilm={editFilm}
                 setFilmFavorite={setFilmFavorite} setFilmRating={setFilmRating}
                 disableActions={!loggedInTotp}
                 dirty={dirty} setDirty={setDirty} handleErrors={handleErrors} />
                 : <Navigate replace to='/' />} />
            <Route path="*" element={<NotFoundLayout />} />
          </Route>
          <Route path='/login' element={ <LoginWithTotp loggedIn={loggedIn} login={handleLogin}
                                        user={user} setLoggedInTotp={setLoggedInTotp} /> } />
        </Routes>
      </Container>
  );
}

function LoginWithTotp(props) {
  if (props.loggedIn) {
    if (props.user.canDoTotp) {
      if (props.loggedInTotp) {
        return <Navigate replace to='/' />;
      } else {
        return <TotpLayout totpSuccessful={() => props.setLoggedInTotp(true)} />;
      }
    } else {
      return <Navigate replace to='/' />;
    }
  } else {
    return <LoginLayout login={props.login} />;
  }
}

export default App;
