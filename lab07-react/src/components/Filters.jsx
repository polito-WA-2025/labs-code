import {ListGroup} from 'react-bootstrap';

/**
 * This components requires:
 * - the list of filters labels to show, 
 * - the filter that is currenctly selected 
 */ 
const Filters = (props) => {
  const {items, selected } = props;

  return (
    <ListGroup as="ul" className="my-2">
        {
          items.map( e => {
            return (
                <ListGroup.Item as="li" key={e.filterName} href={'#'} 
                  action active={selected === e.filterName ? true : false} >
                    {e.label}
                </ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export { Filters };
