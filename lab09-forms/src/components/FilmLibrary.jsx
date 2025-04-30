import 'dayjs';
import { Table, Form, Button } from 'react-bootstrap';

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
           setFilmToEdit={props.setFilmToEdit} setShowForm={props.setShowForm} />)}
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
        {/* Note: the edit button and then the form should be used to edit the checkbox. 
            If using defaultChecked, the value will not update upon re-render. */}
        <Form.Check type="checkbox" checked={props.filmData.favorite ? true : false} readOnly />
      </td>
      <td>
        <small>{formatWatchDate(props.filmData.watchDate, 'MMMM D, YYYY')}</small>
      </td>
      <td>
        <Rating rating={props.filmData.rating} maxStars={5} />
      </td>
      <td>
        <Button variant='danger'
          onClick={() => { props.delete(props.filmData.id) }} >
          <i className='bi bi-trash'></i>
        </Button>
        <Button className="mx-2" variant='warning'
          onClick={() => { props.setFilmToEdit(props.filmData); props.setShowForm(true); }} >
          <i className='bi bi-pencil'></i>
        </Button>
      </td>
    </tr>
  );
}

function Rating(props) {
  // Create an array with props.maxStars elements, then run map to create the JSX elements for the array 
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} />
  )
}

export { FilmTable };
