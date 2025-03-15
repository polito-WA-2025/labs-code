/* 
 * [2024/2025]
 * Web Applications
 * Lab 2 - Exercise 1
 */

'use strict';

/* 
-- DB STRUCTURE
CREATE TABLE "films" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"favorite"  INTEGER NOT NULL DEFAULT (0),  -- sqlite does not support boolean, but SQL can use keywords TRUE and FALSE which maps to 0 and 1 respectively
	"watchdate" TEXT,  -- sqlite does not support DATETIME type, use text ISO format YYYY-MM-DD so comparing can be done in SQL
	"rating"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
*/

const sqlite = require('sqlite3');
const dayjs = require('dayjs');


function Film(id, title, isFavorite = false, watchDate, rating) {
  // NOTE: watchDate is always passed as a string
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
  const db = new sqlite.Database('films.db', (err) => { if (err) throw err; });

  this.closeDB = () => {
    try {
      db.close();
    }
    catch (error) {
      console.log(`Impossible to close the database! ${error}`);
    }
  }

  this.getAll = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films' ;
      db.all(query, [], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.getFavorites = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE favorite = True';
      db.all(query, [], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.getToday = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE watchdate = ?';
      const today = dayjs().format('YYYY-MM-DD');  // match the format used in SQL to represent the date
      db.all(query, [today], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
   });
  }

  this.getBeforeDate = (watchdate) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE watchdate < ?';
      db.all(query, [watchdate.format('YYYY-MM-DD')], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.getRated = (rating) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE rating >= ?';
      db.all(query, [rating], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

  this.getWithWord = (word) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM films WHERE title LIKE ?';
      db.all(query, ["%" + word + "%"], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const films = rows.map(record => new Film(record.id, record.title, record.favorite == 1, record.watchdate, record.rating));
          resolve(films);
        }
      });
    });
  };

}

/* TESTING */
async function main() {

  const filmLibrary = new FilmLibrary();
  
  try {
    // get all the movies
    console.log('\n****** All the movies in the database: ******');
    const films = await filmLibrary.getAll();
    if(films.length === 0) {
      // If there are not movies in the database it is useless to execute other queries.
      console.log('No movies yet, try later.');
      filmLibrary.closeDB();
      return;
    }
    else
      films.forEach( (film) => console.log(`${film}`) );

    // get all favorite movies
    console.log('\n****** All favorite movies in the database: ******');
    const favoriteFilms = await filmLibrary.getFavorites();
    if(favoriteFilms.length === 0)
      console.log('No favorite movies yet, try later.');
    else
      favoriteFilms.forEach( (film) => console.log(`${film}`) );

    // retrieving movies watched today
    console.log('\n****** Movies watched today ******');
    const watchedToday = await filmLibrary.getToday();
    if(watchedToday.length === 0)
      console.log('No movies watched today, time to watch one?');
    else
      watchedToday.forEach( (film) => console.log(`${film}`) );

    // get films before a certain date
    const watchdate = dayjs('2023-03-19');
    console.log('\n****** Movies watched before ' + watchdate.format('YYYY-MM-DD') + ': ******');
    const watchedFilms = await filmLibrary.getBeforeDate(watchdate);
    if(watchedFilms.length === 0)
      console.log("No movies in this period, sorry.");
    else
      watchedFilms.forEach( (film) => console.log(`${film}`) );

    // get movies with a minimum score of 4
    const rating = 4
    console.log('\n****** Movies with a minimum rate of ' + rating + ': ******');
    const ratedFilms = await filmLibrary.getRated(rating);
    if(ratedFilms.length === 0)
      console.log('No movies with this rating, yet.');
    else
      ratedFilms.forEach( (film) => console.log(`${film}`) );

    // get films with a the word "war" in the title
    const word = 'war';
    console.log(`\n****** Movies containing '${word}' in the title: ******`);
    const filteredFilms = await filmLibrary.getWithWord(word);
    if(filteredFilms.length === 0)
      console.log(`No movies with the word ${word} in the title...`);
    else
      filteredFilms.forEach( (film) => console.log(`${film}`) );

  } catch (error) {
    console.error(`Impossible to retrieve movies! ${error}`);
    return;
  } finally {
    filmLibrary.closeDB();
  }
}

main();
