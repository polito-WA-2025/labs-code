import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}

/**
 * Getting from the server side and returning the list of films.
 * The list of films could be filtered in the server-side through the optional parameter: filter.
 */
const getFilms = async (filter) => {
  // film.watchDate could be null or a string in the format YYYY-MM-DD
  return getJson(
    filter 
      ? fetch(SERVER_URL + 'films?filter=' + filter, { credentials: 'include' })
      : fetch(SERVER_URL + 'films', { credentials: 'include' })
  ).then( json => {
    return json.map((film) => {
      const clientFilm = {
        id: film.id,
        title: film.title,
        favorite: film.favorite,
        rating: film.rating,
        user: film.user
      }
      if (film.watchDate != null)
        clientFilm.watchDate = dayjs(film.watchDate);
      return clientFilm;
    })
  })
}

/**
 * This function wants a film object as parameter. If the filmId exists, it updates the film in the server side.
 */
function updateFilm(film) {
  // the date must be transformed into a string for the JSON.stringify method
  if (film && film.watchDate && (film.watchDate instanceof dayjs))
      film.watchDate = film.watchDate.format("YYYY-MM-DD");
  return getJson(
    fetch(SERVER_URL + "films/" + film.id, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(film)
    })
  )
}

/**
 * This function wants a film id and a new value for favorite as parameter. If the filmId exists, it updates the film in the server side.
 */
function setFilmFavorite(id, value) {
  return getJson(
    fetch(SERVER_URL + "films/" + id + "/favorite", {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({favorite: value})
    })
  )
}

/**
 * This function wants a film id and a new value for rating as parameter. If the filmId exists, it updates the film in the server side.
 */
function setFilmRating(id, value) {
  return getJson(
    fetch(SERVER_URL + "films/" + id + "/rating", {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({rating: value})
    })
  )
}


/**
 * This function adds a new film in the back-end library.
 */
function addFilm(film) {
  // the date must be transformed into a string for the JSON.stringify method
  if (film && film.watchDate && (film.watchDate instanceof dayjs))
    film.watchDate = film.watchDate.format("YYYY-MM-DD");
  return getJson(
    fetch(SERVER_URL + "films/", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(film) 
    })
  )
}

/**
 * This function deletes a film from the back-end library.
 */
function deleteFilm(filmId) {
  return getJson(
    fetch(SERVER_URL + "films/" + filmId, {
      method: 'DELETE',
      credentials: 'include'
    })
  )
}


/*** Authentication functions ***/

/**
 * This function wants the TOTP code
 * It executes the 2FA.
 */
const totpVerify = async (totpCode) => {
  return getJson(fetch(SERVER_URL + 'login-totp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwarded
    body: JSON.stringify({code: totpCode}),
  })
  )
};


/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwarded
    body: JSON.stringify(credentials),
  })
  )
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    // this parameter specifies that authentication cookie must be forwarded
    credentials: 'include'
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'  // this parameter specifies that authentication cookie must be forwarded
  })
  )
}

const API = { getFilms, updateFilm, addFilm, deleteFilm, setFilmFavorite, setFilmRating,
              logIn, getUserInfo, logOut, totpVerify };
export default API;
