import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm, isEmail, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { locales, languages } from 'app/config/translation';
import { getUser, getRoles, updateUser, createUser, reset, getUsers } from './user-management.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity as getClientEntity, updateEntity as updateClientEntity, createEntity as createClientEntity, reset as resetClient, getEntities as getClientEntities } from 'app/entities/client/client.reducer';
import Sidebar from "app/shared/layout/sidebar/Sidebar";
// Import the custom CSS file

const UserManagementUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const { login } = useParams<'login'>();
  const isNew = login === undefined;

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
      dispatch(resetClient());
    } else {
      dispatch(getUser(login));
    }
    dispatch(getUsers({}));
    dispatch(getClientEntities({}));
    dispatch(getRoles());

    return () => {
      dispatch(reset());
    };
  }, [login]);

  const handleClose = () => {
    navigate('/admin/user-management');
  };

  const saveUser = async values => {
    if (isNew) {
      const usser = await dispatch(createUser(values));
      const newUser = usser.payload["data"];
      if (user !== undefined) {
        const entity = {
          ...clientEntity,
          ...values,
          user: newUser
        };
        dispatch(createClientEntity(entity));
      }
    } else {
      const updatedUserResponse = await dispatch(updateUser(values));
      const clientValues = {
        id: clientEntities.find((client) => client.user.id === user?.id).id,
        cin: values.cin,
        photo: values.photo,
        numeroTelephone: values.numeroTelephone,
        dateNaissance: values.dateNaissance,
        nationalite: values.nationalite,
        adresse: values.adresse,
        genre: values.genre,
        user: updatedUserResponse.payload["data"]
      };
      dispatch(updateClientEntity(clientValues));
    }

    handleClose();
  };

  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const updating = useAppSelector(state => state.userManagement.updating);
  const authorities = useAppSelector(state => state.userManagement.authorities);
  const clientEntity = useAppSelector(state => state.client.entity);
  const clientEntities = useAppSelector(state => state.client.entities);

  const getDefaultValues = () => {
    if (isNew) {
      return {};
    } else {
      const client = clientEntities.find((client) => client.user.id === user?.id);
      const cin = client ? client.cin : '';
      const numeroTelephone = client ? client.numeroTelephone : '';
      const dateNaissance = client ? client.dateNaissance : '';
      const photo = client ? client.photo : null;
      const photoContentType = client ? client.photoContentType : '';
      const nationalite = client ? client.nationalite : '';
      const adresse = client ? client.adresse : '';
      const genre = client ? client.genre : '';

      return {
        id: user ? user.id : "",
        login: user ? user.login : '',
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
        email: user ? user.email : '',
        activated: user ? user.activated : true,
        langKey: user ? user.langKey : 'en',
        authorities: user ? user.authorities : [],
        cin: cin,
        photo: photo,
        numeroTelephone: numeroTelephone,
        dateNaissance: dateNaissance,
        nationalite: nationalite,
        adresse: adresse,
        genre: genre
      };
    }
  };

  return (
    <div className="container update-form" style={{marginLeft:'100px'}}>
      <Sidebar/>
      <Row className="justify-content-center">
        <Col md="6">
          <Card>
            <CardBody>
              <CardTitle tag="h2" className="text-left text-black custom-title-bar py-2">
                <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a User</Translate>
              </CardTitle>
              <br />
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ValidatedForm onSubmit={saveUser} defaultValues={getDefaultValues()}>
                  {user.id ? (
                    <ValidatedField
                      type="text"
                      name="id"
                      required
                      hidden
                      label={translate('global.field.id')}
                      validate={{ required: true }}
                      className="custom-input-field" // Add the custom class here
                    />
                  ) : null}
                  <ValidatedField
                    type="text"
                    name="login"
                    label={translate('userManagement.login')}
                    className="custom-input-field" // Add the custom class here
                    validate={{
                      required: {
                        value: true,
                        message: translate('register.messages.validate.login.required'),
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                        message: translate('register.messages.validate.login.pattern'),
                      },
                      minLength: {
                        value: 1,
                        message: translate('register.messages.validate.login.minlength'),
                      },
                      maxLength: {
                        value: 50,
                        message: translate('register.messages.validate.login.maxlength'),
                      },
                    }}
                  />
                  <ValidatedField
                    type="text"
                    name="firstName"
                    label={translate('userManagement.firstName')}
                    className="custom-input-field" // Add the custom class here
                    validate={{
                      maxLength: {
                        value: 50,
                        message: translate('entity.validation.maxlength', { max: 50 }),
                      },
                    }}
                  />
                  <ValidatedField
                    type="text"
                    name="lastName"
                    label={translate('userManagement.lastName')}
                    className="custom-input-field" // Add the custom class here
                    validate={{
                      maxLength: {
                        value: 50,
                        message: translate('entity.validation.maxlength', { max: 50 }),
                      },
                    }}
                  />
                  <ValidatedBlobField
                    label={translate('faeApp.client.photo')}
                    id="client-photo"
                    name="photo"
                    data-cy="photo"
                    isImage
                    accept="image/*"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    label={translate('faeApp.client.numeroTelephone')}
                    id="client-numeroTelephone"
                    name="numeroTelephone"
                    data-cy="numeroTelephone"
                    type="text"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    label={translate('faeApp.client.dateNaissance')}
                    id="client-dateNaissance"
                    name="dateNaissance"
                    data-cy="dateNaissance"
                    type="date"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    label={translate('faeApp.client.nationalite')}
                    id="client-nationalite"
                    name="nationalite"
                    data-cy="nationalite"
                    type="text"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField label={translate('faeApp.client.adresse')} id="client-adresse" name="adresse" data-cy="adresse" type="text" className="custom-input-field" />
                  <ValidatedField label={translate('faeApp.client.cin')} id="client-cin" name="cin" data-cy="cin" type="text" className="custom-input-field" />
                  <ValidatedField
                    label={translate('faeApp.client.genre')}
                    id="client-genre"
                    name="genre"
                    data-cy="genre"
                    type="select"
                    className="custom-input-field" // Add the custom class here
                  >
                    <option value="" key="0">
                      Sélectionner un genre
                    </option>
                    <option value="male" key="1">
                      Homme
                    </option>
                    <option value="female" key="2">
                      Femme
                    </option>
                  </ValidatedField>
                  <ValidatedField
                    name="email"
                    label={translate('global.form.email.label')}
                    placeholder={translate('global.form.email.placeholder')}
                    type="email"
                    validate={{
                      required: {
                        value: true,
                        message: translate('global.messages.validate.email.required'),
                      },
                      minLength: {
                        value: 5,
                        message: translate('global.messages.validate.email.minlength'),
                      },
                      maxLength: {
                        value: 254,
                        message: translate('global.messages.validate.email.maxlength'),
                      },
                      validate: v => isEmail(v) || translate('global.messages.validate.email.invalid'),
                    }}
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    type="checkbox"
                    name="activated"
                    check
                    value={true}
                    disabled={!user.id}
                    label={translate('userManagement.activated')}
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField type="select" name="langKey" label={translate('userManagement.langKey')} className="custom-input-field">
                    {locales.map(locale => (
                      <option value={locale} key={locale}>
                        {languages[locale].name}
                      </option>
                    ))}
                  </ValidatedField>
                  <ValidatedField type="select" name="authorities" multiple label={translate('userManagement.profiles')} className="custom-input-field">
                    {authorities.map(role => (
                      <option value={role} key={role}>
                        {role}
                      </option>
                    ))}
                  </ValidatedField>
                  <div className="text-center">
                    <Button tag={Link} to="/admin/user-management" replace className="custom-back-button m-2">
                      <FontAwesomeIcon icon="arrow-left" />
                      &nbsp;
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.back">Back</Translate>
                      </span>
                    </Button>
                    <Button color="primary" type="submit" disabled={updating} className="custom-save-button m-2">
                      <FontAwesomeIcon icon="save" />
                      &nbsp;
                      <Translate contentKey="entity.action.save">Save</Translate>
                    </Button>
                  </div>
                </ValidatedForm>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserManagementUpdate;
