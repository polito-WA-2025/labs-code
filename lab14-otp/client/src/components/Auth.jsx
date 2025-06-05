import { useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import API from '../API.js';

function TotpForm(props) {
  const [totpCode, setTotpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  //console.log('DEBUG: RENDER TotpForm');

  const doTotpVerify = () => {
    API.totpVerify(totpCode)
      .then(() => {
        setErrorMessage('');
        props.totpSuccessful();
        navigate('/');
      })
      .catch(() => {
        // NB: Generic error message
        setErrorMessage('Wrong code, please try again');
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');

    // Some validation
    let valid = true;
    if (totpCode === '' || totpCode.length !== 6)
      valid = false;

    if (valid) {
      doTotpVerify(totpCode);
    } else {
      setErrorMessage('Invalid content in form: either empty or not 6-char long');
    }
  };

  return (
    <Row>
      <Col xs={4}></Col>
      <Col xs={4}>

        <h2>Second Factor Authentication</h2>
        <h5>Please enter the code that you read on your device</h5>
        <Form onSubmit={handleSubmit}>
          {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
          <Form.Group controlId='totpCode'>
            <Form.Label>Code</Form.Label>
            <Form.Control type='text' value={totpCode} onChange={ev => setTotpCode(ev.target.value)} />
          </Form.Group>
          <Button className='my-2' type='submit'>Validate</Button>
          <Button className='my-2 mx-2' variant='danger' onClick={() => navigate('/')}>Cancel</Button>
        </Form>
      </Col>
      <Col xs={4}></Col>
    </Row>
  )

}

function LoginForm(props) {
  const [username, setUsername] = useState('u1@p.it');
  const [password, setPassword] = useState('pwd');

  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    if (!username) {
      setErrorMessage('Username cannot be empty');
    } else if (!password) {
      setErrorMessage('Password cannot be empty');
    } else {
      props.login(credentials)
        //.then( () => navigate( "/" ) )   // navigation happens automatically, towards TOTP or main page, thanks to the router
        .catch((err) => { 
          setErrorMessage(err.error); 
        });
    }
  };

  return (
    <Row>
      <Col xs={4}></Col>
      <Col xs={4}>
        <h1 className="pb-3">Login</h1>

        <Form onSubmit={handleSubmit}>
          {errorMessage? <Alert dismissible onClose={() => setErrorMessage('')} variant="danger">{errorMessage}</Alert> : null}
          <Form.Group className="mb-3">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              value={username} placeholder="Example: john.doe@polito.it"
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password} placeholder="Enter your password"
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
          <Button className="mt-3" type="submit">Login</Button>
        </Form>
      </Col>
      <Col xs={4}></Col>
    </Row>

  )
};

function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>Logout</Button>
  )
}

function LoginButton(props) {
  const navigate = useNavigate();
  return (
    <Button variant="outline-light" onClick={()=> navigate('/login')}>Login</Button>
  )
}

export { LoginForm, LogoutButton, LoginButton, TotpForm };
