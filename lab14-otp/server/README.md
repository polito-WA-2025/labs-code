# Lab WA

## Registered Users

Here you can find a list of the users already registered inside the provided database.

| emai       |   name | plain-text password |
|------------|--------|---------------------|
| u1@p.it    | John   | pwd                 |
| u2@p.it    | Alice  | pwd                 |
| u3@p.it    | George | pwd                 |

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

### Film Management

#### Get all films

* `GET /api/films`
* Description: Get the full list of films or the films that match the optional query filter parameter `?filter=`
* Request body: _None_
* Request query parameter: _filter_ name of the filter to apply (all, favorite, best, lastmonth, unseen)
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one film. Note that absence of values is represented as null value in json.

``` json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": 1,
    "watchDate": "2023-03-11",
    "rating": null,
  },
  {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": null,
    "rating": 4,
  },
  ...
]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get film by id

* `GET /api/films/:id`
* Description: Get the film corresponding to the id 
* Request body: _None_
* Response: `200 OK` (success)
* Response body: One object describing the required film:

``` JSON
[
  {
    "id": 2,
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": "2023-03-17",
    "rating": 4,
  }
]
```

* Error responses:  `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

#### Create a new film

* `POST /api/films`
* Description: Create a new film
* Request body: description of the object to add (film id value is not required and it is ignored)

``` JSON
{
    "title": "21 Grams",
    "favorite": 1,
    "watchDate": "2023-03-17",
    "rating": 4,
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database, including the unique id assigned by the database.

* Error responses: `503 Service Unavailable` (database error), `422 Unprocessable Content` (errors in request body)

#### Update an existing film

* `PUT /api/films/:id`
* Description: Update all values of an existing film, except the id.
* Request body: description of the object to update. The "id" property, if present in body, must match the one in the URL.

``` JSON
{
    "title": "The Matrix",
    "favorite": 1,
    "watchDate": "2023-03-31",
    "rating": 5,
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses: `503 Service Unavailable` (database error), `422 Unprocessable Content` (errors in request body)

#### Delete an existing film

* `DELETE /api/films/:id`
* Description: Delete an existing film
* Request body: _None_

* Response: `200 OK` (success)
* Response body: _None_ 

* Error responses:  `503 Service Unavailable` (database error)

#### Change the rating of an existing film 

* `POST /api/films/change-rating`
* Description: Change the rating value of an existing film. If the provided delta yields a result <1 or >5, the value is clipped to 1 or 5. If the rating is not yet set, the API will return an error.
* Request body: desired variation of the rating

``` JSON
{
    "id": 2,
    "deltaRating": -1,
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database after the operation

* Error responses: `503 Service Unavailable` (database error), `422 Unprocessable Content` (errors in request body)

#### Mark a film as favorite or unfavorite
* `PUT /api/films/:id/favorite`
* Description: Update (i.e., overwrite) the property values of an existing film (except the id which cannot be modified)
* Request body: new values of the properties

``` JSON
{
    "id": 2,
    "rating": 5,
    "favorite": 0,
    ...
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database after the operation

* Error responses: `503 Service Unavailable` (database error)



### User management

#### Login

* `POST /api/sessions`
* Description: authenticate the user who is trying to login
* Request body: credentials of the user who is trying to login

``` JSON
{
    "username": "username",
    "password": "password"
}
```

* Response: `200 OK` (success)
* Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "u1@p.it", 
    "name": "John"
}
```

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

#### Check if user is logged in / get current user

* `GET /api/sessions/current`
* Description: check if current user is logged in and get his/her data
* Request body: _None_
* Response: `200 OK` (success)

* Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "u1@p.it", 
    "name": "John"
}
```

* Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)

#### Logout

* `DELETE /api/sessions/current`
* Description: logout current user
* Request body: _None_

* Response: `200 OK` (success)
* Response body: _None_

* Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)


#### TOTP

* HTTP method: `POST`  URL: `/api/login-totp`
* Description: perform 2FA through a TOTP code
* Request body: TOTP code

``` JSON
{
    "code": "123456"
}
```

* Response: `200 OK` (success)
* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (2FA failed)
* Response body: generic JSON


