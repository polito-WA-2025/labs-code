/* 
 * [2024/2025]
 * Web Applications
 * Lab 1 - Exercise 1
 */

'use strict';
const dayjs = require("dayjs");


function Film(id, title, isFavorite = false, watchDate, rating) {
  this.id = id;
  this.title = title;
  this.favorite = isFavorite;
  this.rating = rating;
  // saved as dayjs object only if watchDate is truthy
  this.watchDate = watchDate && dayjs(watchDate);

  this.toString = () => {
    return `Id: ${this.id}, ` +
    `Title: ${this.title}, Favorite: ${this.favorite}, ` +
    `Watch date: ${this.formatWatchDate('MMMM D, YYYY')}, ` +
    `Score: ${this.formatRating()}` ;
  }

  this.formatWatchDate = (format) => {
    return this.watchDate ? this.watchDate.format(format) : '<not defined>';
  }

  this.formatRating = () => {
    return this.rating ? this.rating : '<not assigned>';
  }
}

function FilmLibrary() {
  this.list = [];

  this.addNewFilm = (film) => {
    if(!this.list.some(f => f.id == film.id))
      this.list.push(film);
    else
      throw new Error('Duplicated id');
  };

  this.print = () => {
    console.log("***** List of films *****");
    this.list.forEach((item) => console.log(item.toString()));
  }
}


function main() {
  // Creating some film entries
  const f1 = new Film(1, "Pulp Fiction", true, "2023-03-10", 5);
  const f2 = new Film(2, "21 Grams", true, "2023-03-17", 4);
  const f3 = new Film(3, "Star Wars", false);
  const f4 = new Film(4, "Matrix");
  const f5 = new Film(5, "Shrek", false, "2023-03-21", 3);

  // Adding the films to the FilmLibrary
  const library = new FilmLibrary();
  library.addNewFilm(f1);
  library.addNewFilm(f2);
  library.addNewFilm(f3);
  library.addNewFilm(f4);
  library.addNewFilm(f5);

  // Print Films
  library.print();

  // Additional instruction to enable debug 
  debugger;
}

main();
