/*
 * Web Applications
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Routes, Route, Outlet, Link, useParams, Navigate } from 'react-router';

//import FILMS from './films';

import { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout } from './components/Layout';
import API from './API.js';

function App() {

  const [filmList, setFilmList] = useState([]);
/*
  useEffect(() => {
    API.getFilms()
    .then(films => {
      setFilmList(films);
    })
    .catch(e => { console.log(e); } ); 

  }, []);
*/

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

  function deleteFilm(filmId) {
    // changes the state by passing a callback that will compute, from the old Array,
    // a new Array where the filmId is not present anymore
    setFilmList(filmList => filmList.filter(e => e.id!==filmId));
  }

  function editFilm(film) {
    setFilmList( (films) => films.map( e=> {
      if (e.id === film.id)
        return Object.assign({}, film);  // Alternative:  return {...film}
      else
        return e;
    }))
  }

  function addFilm(film) {
    setFilmList( (films) => {
      // In the complete application, the newFilmId value should come from the backend server.
      // NB: This is NOT to be used in a real application: the new id MUST NOT be generated on the client.
      // However, we need it now to make everything work smoothly
      const newFilmId = Math.max( ...(films.map(e => e.id)))+1;
      return [...films, {"id": newFilmId, ...film}];
      });
  }

  return (
      <Container fluid>
        <Routes>
          <Route path="/" element={<GenericLayout filterArray={filterArray} />} >
            <Route index element={<TableLayout 
                 filmList={filmList} setFilmList={setFilmList} filters={filters} 
                 deleteFilm={deleteFilm} editFilm={editFilm} />} />
            <Route path="add" element={<AddLayout addFilm={addFilm} />} />
            <Route path="edit/:filmId" element={<EditLayout films={filmList} editFilm={editFilm} />} />
            <Route path="filter/:filterId" element={<TableLayout 
                 filmList={filmList} setFilmList={setFilmList}
                 filters={filters} deleteFilm={deleteFilm} editFilm={editFilm} />} />
            <Route path="*" element={<NotFoundLayout />} />
          </Route>
        </Routes>
      </Container>
  );
}

export default App;
