import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form } from 'react-bootstrap';

const Navigation = () => {

    return (
        <Navbar bg="primary" expand="md" variant="dark" className="navbar-padding">
            <Navbar.Brand className="mx-2" href="index.html">
                <i className="bi bi-collection-play mx-2" />
                Film Library
            </Navbar.Brand>
            <Form className="my-2 mx-auto inline" action="#" role="search" aria-label="Quick search">
                <Form.Control type="search" placeholder="Search" aria-label="Search query" />
            </Form>
            <Nav>
                <Nav.Item>
                    <Nav.Link href="#">
                        <div className="fs-4 mx-2">
                            <i className="bi bi-person-circle icon-size" />
                        </div>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export { Navigation };
