import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISocieteCommerciale } from 'app/shared/model/societe-commerciale.model';
import { getEntity, updateEntity, createEntity, reset } from './societe-commerciale.reducer';

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
  }, []);

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
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.societeCommerciale.home.createOrEditLabel" data-cy="SocieteCommercialeCreateUpdateHeading">
            <Translate contentKey="faeApp.societeCommerciale.home.createOrEditLabel">Create or edit a SocieteCommerciale</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
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
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.societeCommerciale.codePays')}
                id="societe-commerciale-codePays"
                name="codePays"
                data-cy="codePays"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.societeCommerciale.libelle')}
                id="societe-commerciale-libelle"
                name="libelle"
                data-cy="libelle"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.societeCommerciale.devise')}
                id="societe-commerciale-devise"
                name="devise"
                data-cy="devise"
                type="text"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/societe-commerciale" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SocieteCommercialeUpdate;
