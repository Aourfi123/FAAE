import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IBordereau } from 'app/shared/model/bordereau.model';
import { getEntities as getBordereaus } from 'app/entities/bordereau/bordereau.reducer';
import { IDocument } from 'app/shared/model/document.model';
import { getEntities as getDocuments } from 'app/entities/document/document.reducer';
import { ILignesDocument } from 'app/shared/model/lignes-document.model';
import { getEntity, updateEntity, createEntity, reset } from './lignes-document.reducer';

export const LignesDocumentUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const bordereaus = useAppSelector(state => state.bordereau.entities);
  const documents = useAppSelector(state => state.document.entities);
  const lignesDocumentEntity = useAppSelector(state => state.lignesDocument.entity);
  const loading = useAppSelector(state => state.lignesDocument.loading);
  const updating = useAppSelector(state => state.lignesDocument.updating);
  const updateSuccess = useAppSelector(state => state.lignesDocument.updateSuccess);

  const handleClose = () => {
    navigate('/lignes-document' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getBordereaus({}));
    dispatch(getDocuments({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...lignesDocumentEntity,
      ...values,
      bordereaus: bordereaus.find(it => it.id.toString() === values.bordereaus.toString()),
      documents: documents.find(it => it.id.toString() === values.documents.toString()),
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
          ...lignesDocumentEntity,
          bordereaus: lignesDocumentEntity?.bordereaus?.id,
          documents: lignesDocumentEntity?.documents?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.lignesDocument.home.createOrEditLabel" data-cy="LignesDocumentCreateUpdateHeading">
            <Translate contentKey="faeApp.lignesDocument.home.createOrEditLabel">Create or edit a LignesDocument</Translate>
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
                  id="lignes-document-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.lignesDocument.dateDebut')}
                id="lignes-document-dateDebut"
                name="dateDebut"
                data-cy="dateDebut"
                type="date"
              />
              <ValidatedField
                label={translate('faeApp.lignesDocument.dateFin')}
                id="lignes-document-dateFin"
                name="dateFin"
                data-cy="dateFin"
                type="date"
              />
              <ValidatedField
                id="lignes-document-bordereaus"
                name="bordereaus"
                data-cy="bordereaus"
                label={translate('faeApp.lignesDocument.bordereaus')}
                type="select"
              >
                <option value="" key="0" />
                {bordereaus
                  ? bordereaus.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="lignes-document-documents"
                name="documents"
                data-cy="documents"
                label={translate('faeApp.lignesDocument.documents')}
                type="select"
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/lignes-document" replace color="info">
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

export default LignesDocumentUpdate;
