import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IDocument } from 'app/shared/model/document.model';
import { getEntities as getDocuments } from 'app/entities/document/document.reducer';
import { IPaiement } from 'app/shared/model/paiement.model';
import { getEntities as getPaiements } from 'app/entities/paiement/paiement.reducer';
import { IFacture } from 'app/shared/model/facture.model';
import { getEntity, updateEntity, createEntity, reset } from './facture.reducer';

 // Import the custom CSS file

export const FactureUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const documents = useAppSelector(state => state.document.entities);
  const paiements = useAppSelector(state => state.paiement.entities);
  const factureEntity = useAppSelector(state => state.facture.entity);
  const loading = useAppSelector(state => state.facture.loading);
  const updating = useAppSelector(state => state.facture.updating);
  const updateSuccess = useAppSelector(state => state.facture.updateSuccess);

  const handleClose = () => {
    navigate('/facture' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getDocuments({}));
    dispatch(getPaiements({}));
  }, [id, isNew]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...factureEntity,
      ...values,
      document: documents.find(it => it.id.toString() === values.document.toString()),
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
        ...factureEntity,
        document: factureEntity?.document?.id,
      };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.facture.home.createOrEditLabel" data-cy="FactureCreateUpdateHeading">
            <Translate contentKey="faeApp.facture.home.createOrEditLabel">Create or edit a Facture</Translate>
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
                  id="facture-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                  className="custom-input-field" // Add the custom class here
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.facture.code')}
                id="facture-code"
                name="code"
                data-cy="code"
                type="text"
                className="custom-input-field" // Add the custom class here
              />
              <ValidatedField
                label={translate('faeApp.facture.etat')}
                id="facture-etat"
                name="etat"
                data-cy="etat"
                type="text"
                className="custom-input-field" // Add the custom class here
              />
              <ValidatedField
                id="facture-document"
                name="document"
                data-cy="document"
                label={translate('faeApp.facture.document')}
                type="select"
                className="custom-input-field" // Add the custom class here
              >
                <option value="" key="0" />
                {documents
                  ? documents.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.id}
                    </option>
                  ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/facture" replace color="info">
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

export default FactureUpdate;
