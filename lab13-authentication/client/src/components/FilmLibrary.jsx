import 'dayjs';
import { Table, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router';

function FilmTable(props) {
  const { films } = props;

  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th className="text-center">Favorite</th>
          <th>Last seen</th>
          <th>Rating</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {films.map((film) => <FilmRow filmData={film} key={film.id} delete={props.delete}
           editFilm={props.editFilm} />)}
      </tbody>
    </Table>
  );
}

function FilmRow(props) {

  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }

  return (
    <tr>
      <td>
        <p className={props.filmData.favorite ? "favorite" : ""} >
          {props.filmData.title}
        </p>
      </td>
      <td className="text-center">
        {/* Note: the true/false value of the checkbox is in event.target.checked
            Instead, event.target.value contains "on" */}
        <Form.Check type="checkbox" checked={props.filmData.favorite ? true : false} 
          onChange={(event) => props.editFilm({...props.filmData, favorite: event.target.checked}) } />
      </td>
      <td>
        <small>{formatWatchDate(props.filmData.watchDate, 'MMMM D, YYYY')}</small>
      </td>
      <td>
        <Rating rating={props.filmData.rating} maxStars={5} 
          editRating={(newRating) => { if (newRating!==props.filmData.rating) props.editFilm({ ...props.filmData, rating: newRating })} } />
      </td>
      <td>
        <Button variant='danger'
          onClick={() => { props.delete(props.filmData.id) }} >
          <i className='bi bi-trash'></i>
        </Button>
        <Link to={`/edit/${props.filmData.id}`} >
          <Button className="mx-2" variant='warning'>
            <i className='bi bi-pencil'></i>
          </Button>
        </Link>
      </td>
    </tr>
  );
}

function Rating(props) {
  // Create an array with props.maxStars elements, then run map to create the JSX elements for the array 
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"}
      onClick={() => props.editRating(index+1)} />
  )
}

export { FilmTable };
