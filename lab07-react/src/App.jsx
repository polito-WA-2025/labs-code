/*
 * Web Applications
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import FILMS from './films';

import { Navigation } from './components/Navigation';
import { Filters } from './components/Filters';
import { FilmTable } from './components/FilmLibrary';

function App() {

  const activeFilter = 'filter-all';

  /**
   * Defining a structure for Filters
   * Each filter is identified by a unique name and is composed by the following fields:
   * - A label to be shown in the GUI
   * - An ID (equal to the unique name), used as key during the table generation
   * - A filter function applied before passing the films to the FilmTable component
   */
  const filters = {
    'filter-all': { label: 'All', id: 'filter-all', filterFunction: () => true },
    'filter-favorite': { label: 'Favorites', id: 'filter-favorite', filterFunction: film => film.favorite },
    'filter-best': { label: 'Best Rated', id: 'filter-best', filterFunction: film => film.rating >= 5 },
    'filter-lastmonth': { label: 'Seen Last Month', id: 'filter-lastmonth', filterFunction: film => isSeenLastMonth(film) },
    'filter-unseen': { label: 'Unseen', id: 'filter-unseen', filterFunction: film => film.watchDate ? false : true }
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
  const filterArray = filtersToArray.map( e => ({filterName: e[0], label: e[1].label}) );
  // alternative with destructuring directly in the parameter of the callback 
  //const filterArray = filtersToArray.map(([filterName, { label }]) => ({ filterName: filterName, label: label }));
  // or even without explicit property names, since they are the same as the name of the variable
  //const filterArray = filtersToArray.map(([filterName, { label }]) => ({ filterName, label }));

  return (
    <Container fluid>
      <Row>
        <Col>
          <Navigation />
        </Col>
      </Row>

      <Row>
        <Col xs={3}>
          <Filters items={filterArray} selected={activeFilter} />
        </Col>

        <Col xs={9}>
          <div className="d-flex flex-row justify-content-between">
            <h1 className="my-2">Filter: <span>{filters[activeFilter].label}</span></h1>
            <Button variant="primary" className="my-2">&#43;</Button>
          </div>
          <FilmTable activeFilter={filters[activeFilter].label}
            films={FILMS.filter(filters[activeFilter].filterFunction)} />
        </Col>
      </Row>
    </Container>

  );
}

export default App;
