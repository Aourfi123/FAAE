import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IDemandeRembourssement } from 'app/shared/model/demande-rembourssement.model';
import { getEntity, updateEntity, createEntity, reset } from './demande-rembourssement.reducer';

export const DemandeRembourssementUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const demandeRembourssementEntity = useAppSelector(state => state.demandeRembourssement.entity);
  const loading = useAppSelector(state => state.demandeRembourssement.loading);
  const updating = useAppSelector(state => state.demandeRembourssement.updating);
  const updateSuccess = useAppSelector(state => state.demandeRembourssement.updateSuccess);

  const handleClose = () => {
    navigate('/demande-rembourssement' + location.search);
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
      ...demandeRembourssementEntity,
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
          ...demandeRembourssementEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.demandeRembourssement.home.createOrEditLabel" data-cy="DemandeRembourssementCreateUpdateHeading">
            <Translate contentKey="faeApp.demandeRembourssement.home.createOrEditLabel">Create or edit a DemandeRembourssement</Translate>
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
                  id="demande-rembourssement-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.demandeRembourssement.raison')}
                id="demande-rembourssement-raison"
                name="raison"
                data-cy="raison"
                type="text"
              />
              <ValidatedBlobField
                label={translate('faeApp.demandeRembourssement.pieceJointe')}
                id="demande-rembourssement-pieceJointe"
                name="pieceJointe"
                data-cy="pieceJointe"
                isImage
                accept="image/*"
              />
              <ValidatedField
                label={translate('faeApp.demandeRembourssement.etat')}
                id="demande-rembourssement-etat"
                name="etat"
                data-cy="etat"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.demandeRembourssement.dateCreation')}
                id="demande-rembourssement-dateCreation"
                name="dateCreation"
                data-cy="dateCreation"
                type="date"
              />
              <ValidatedField
                label={translate('faeApp.demandeRembourssement.dateModification')}
                id="demande-rembourssement-dateModification"
                name="dateModification"
                data-cy="dateModification"
                type="date"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/demande-rembourssement" replace color="info">
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

export default DemandeRembourssementUpdate;
