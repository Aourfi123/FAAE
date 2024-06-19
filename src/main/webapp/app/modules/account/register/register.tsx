import React, { useState, useEffect } from 'react';
import { Translate, translate, ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { Row, Col, Alert, Button } from 'reactstrap';
import { toast } from 'react-toastify';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handleRegister, reset } from './register.reducer';
import './register.css'; // Import the CSS file

export const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const handleValidSubmit = ({ username, email, firstPassword }) => {
    dispatch(handleRegister({ login: username, email, password: firstPassword, langKey: currentLocale }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  return (
    <div className="register-background">
      <Row className="justify-content-center">
        <Col md="6">
          <div className="register-form">
            <h1 id="register-title" data-cy="registerTitle">
              <Translate contentKey="register.title">Create Account</Translate>
            </h1>
            <ValidatedForm id="register-form" onSubmit={handleValidSubmit}>
              <ValidatedField
                name="username"
                label={translate('global.form.username.label')}
                placeholder={translate('global.form.username.placeholder')}
                validate={{
                  required: { value: true, message: translate('register.messages.validate.login.required') },
                  pattern: {
                    value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                    message: translate('register.messages.validate.login.pattern'),
                  },
                  minLength: { value: 1, message: translate('register.messages.validate.login.minlength') },
                  maxLength: { value: 50, message: translate('register.messages.validate.login.maxlength') },
                }}
                data-cy="username"
              />
              <ValidatedField
                name="email"
                label={translate('global.form.email.label')}
                placeholder={translate('global.form.email.placeholder')}
                type="email"
                validate={{
                  required: { value: true, message: translate('global.messages.validate.email.required') },
                  minLength: { value: 5, message: translate('global.messages.validate.email.minlength') },
                  maxLength: { value: 254, message: translate('global.messages.validate.email.maxlength') },
                  validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
                }}
                data-cy="email"
              />
              <ValidatedField
                name="firstPassword"
                label={translate('global.form.newpassword.label')}
                placeholder={translate('global.form.newpassword.placeholder')}
                type="password"
                onChange={updatePassword}
                validate={{
                  required: { value: true, message: translate('global.messages.validate.newpassword.required') },
                  minLength: { value: 4, message: translate('global.messages.validate.newpassword.minlength') },
                  maxLength: { value: 50, message: translate('global.messages.validate.newpassword.maxlength') },
                }}
                data-cy="firstPassword"
              />
              <PasswordStrengthBar password={password} />
              <ValidatedField
                name="secondPassword"
                label={translate('global.form.confirmpassword.label')}
                placeholder={translate('global.form.confirmpassword.placeholder')}
                type="password"
                validate={{
                  required: { value: true, message: translate('global.messages.validate.confirmpassword.required') },
                  minLength: { value: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                  maxLength: { value: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                  validate: v => v === password || translate('global.messages.error.dontmatch'),
                }}
                data-cy="secondPassword"
              />
              <div className="custom-checkbox">
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">
                  I agree all statements in <a href="#">Terms of service</a>
                </label>
              </div>
              <Button id="register-submit" className="submit-btn" color="primary" type="submit" data-cy="submit">
                <Translate contentKey="register.form.button">Sign Up</Translate>
              </Button>
            </ValidatedForm>
            <div className="login-link">
              Have already an account? <a href="/login">Login here</a>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
