import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity, updateEntity, createEntity, reset } from './societe-commerciale.reducer';

import './societeCommercialeUpdate.css';
import Sidebar from "app/shared/layout/sidebar/Sidebar";

export const SocieteCommercialeUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const societeCommercialeEntity = useAppSelector(state => state.societeCommerciale.entity);
  const loading = useAppSelector(state => state.societeCommerciale.loading);
  const updating = useAppSelector(state => state.societeCommerciale.updating);
  const updateSuccess = useAppSelector(state => state.societeCommerciale.updateSuccess);

  const handleClose = () => {
    navigate('/societe-commerciale' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, [id, isNew]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...societeCommercialeEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
        ...societeCommercialeEntity,
      };

  return (
    <div className="container update-form">
      <Sidebar/>
      <Row className="justify-content-center">
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h2" className="text-left text-black custom-title-bar py-2">
                Créer ou éditer une Societe Commerciale
              </CardTitle>
              <br></br>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  {!isNew ? (
                    <ValidatedField
                      name="id"
                      required
                      readOnly
                      id="societe-commerciale-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }}
                      className="custom-input-field"
                    />
                  ) : null}
                  <ValidatedField
                    label={translate('faeApp.societeCommerciale.codePays')}
                    id="societe-commerciale-codePays"
                    name="codePays"
                    data-cy="codePays"
                    type="text"
                    className="custom-input-field"
                  />
                  <ValidatedField
                    label={translate('faeApp.societeCommerciale.libelle')}
                    id="societe-commerciale-libelle"
                    name="libelle"
                    data-cy="libelle"
                    type="text"
                    className="custom-input-field"
                  />
                  <ValidatedField
                    label={translate('faeApp.societeCommerciale.devise')}
                    id="societe-commerciale-devise"
                    name="devise"
                    data-cy="devise"
                    type="text"
                    className="custom-input-field"
                  />
                  <div className="text-center">
                    <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/societe-commerciale" replace className="custom-back-button m-2">
                      <FontAwesomeIcon icon="arrow-left" />
                      &nbsp;
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.back">Back</Translate>
                      </span>
                    </Button>
                    <Button id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating} className="custom-save-button m-2">
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

export default SocieteCommercialeUpdate;
