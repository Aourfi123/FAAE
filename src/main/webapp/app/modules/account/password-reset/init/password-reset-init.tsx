import React, { useEffect, useState } from 'react';
import { Translate, translate, ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { Button, Col, Row } from 'reactstrap';
import { toast } from 'react-toastify';

import { handlePasswordResetInit, reset } from '../password-reset.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import './passwordr.css'; // Import the new CSS file

export const PasswordResetInit = () => {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  const handleValidSubmit = ({ email }) => {
    dispatch(handlePasswordResetInit(email));
  };

  const updateEmail = event => setEmail(event.target.value);

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  return (
    <div className="passwordd-page">
      <Row className="justify-content-center">
        <Col md="8">
          <div className="passwordd-card">
            <h2 id="passwordd-title">
              <Translate contentKey="reset.request.title">Reset your password</Translate>
            </h2>
            <ValidatedForm onSubmit={handleValidSubmit}>
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
                onChange={updateEmail}
                data-cy="emailResetPassword"
              />
              <Button color="primary" type="submit" data-cy="submit" className="btn-gradient">
                <Translate contentKey="reset.request.form.button">Reset password</Translate>
              </Button>
            </ValidatedForm>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordResetInit;
