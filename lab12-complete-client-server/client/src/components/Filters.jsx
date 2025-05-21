import {ListGroup} from 'react-bootstrap';
import { NavLink } from 'react-router';


const Filters = (props) => {
  const { filterArray } = props;

  return (
    <ListGroup as="ul" className="my-2">
      {
        filterArray.map(e => {
          return (
            <NavLink className="list-group-item" key={e.url} to={`${e.url}`} >
              {e.label}
            </NavLink>
          );
        })
      }
    </ListGroup>
  );
}

export { Filters };
