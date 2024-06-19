import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, FormGroup, Form, Alert } from 'reactstrap';
import { Translate } from 'react-jhipster';
import './login.css'; // Import the CSS file
import { Link } from 'react-router-dom';

const LoginModal = ({ showModal, handleLogin, handleClose, loginError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    handleLogin(username, password, rememberMe);
  };

  return (
    <Modal isOpen={showModal} toggle={handleClose} className="modal-content">
      <ModalHeader toggle={handleClose} className="modal-header">
        <span className="modal-title">Login</span>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {loginError ? (
            <Alert color="danger">
              <Translate contentKey="login.messages.error.authentication">
                <strong>Failed to sign in!</strong> Please check your credentials and try again.
              </Translate>
            </Alert>
          ) : null}
          <FormGroup>
            <Label for="username" className="form-check-label">
              Username
            </Label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="form-control"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password" className="form-check-label">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="form-check-input"
              />{' '}
              Remember me
            </Label>
          </FormGroup>
          <Button type="submit" className="btn-submit">
            SUBMIT
          </Button>
        </Form>
        <div className="additional-links">
          <Link to="/account/reset/request">Forgot Password?</Link>
          <Link to="/account/register">Create an Account</Link>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default LoginModal;
