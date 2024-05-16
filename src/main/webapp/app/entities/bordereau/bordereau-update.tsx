import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IBordereau } from 'app/shared/model/bordereau.model';
import { getEntity, updateEntity, createEntity, reset } from './bordereau.reducer';

export const BordereauUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const bordereauEntity = useAppSelector(state => state.bordereau.entity);
  const loading = useAppSelector(state => state.bordereau.loading);
  const updating = useAppSelector(state => state.bordereau.updating);
  const updateSuccess = useAppSelector(state => state.bordereau.updateSuccess);

  const handleClose = () => {
    navigate('/bordereau' + location.search);
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
      ...bordereauEntity,
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
          ...bordereauEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.bordereau.home.createOrEditLabel" data-cy="BordereauCreateUpdateHeading">
            <Translate contentKey="faeApp.bordereau.home.createOrEditLabel">Create or edit a Bordereau</Translate>
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
                  id="bordereau-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.bordereau.reference')}
                id="bordereau-reference"
                name="reference"
                data-cy="reference"
                type="text"
              />
              <ValidatedField label={translate('faeApp.bordereau.etat')} id="bordereau-etat" name="etat" data-cy="etat" type="text" />
              <ValidatedField
                label={translate('faeApp.bordereau.montantTotal')}
                id="bordereau-montantTotal"
                name="montantTotal"
                data-cy="montantTotal"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.bordereau.dateCreation')}
                id="bordereau-dateCreation"
                name="dateCreation"
                data-cy="dateCreation"
                type="date"
              />
              <ValidatedField
                label={translate('faeApp.bordereau.dateModification')}
                id="bordereau-dateModification"
                name="dateModification"
                data-cy="dateModification"
                type="date"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/bordereau" replace color="info">
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

export default BordereauUpdate;
