import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IAvoir } from 'app/shared/model/avoir.model';
import { getEntities as getAvoirs } from 'app/entities/avoir/avoir.reducer';
import { IFacture } from 'app/shared/model/facture.model';
import { getEntities as getFactures } from 'app/entities/facture/facture.reducer';
import { IDocument } from 'app/shared/model/document.model';
import { getEntity, updateEntity, createEntity, reset } from './document.reducer';
import { getEntities as getBordereaus } from 'app/entities/bordereau/bordereau.reducer';
import {updateEntity as updateLigneDocument, createEntity as createLigneDocument } from 'app/entities/lignes-document/lignes-document.reducer';
import { IBordereau } from 'app/shared/model/bordereau.model';

export const DocumentUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const bordereaus = useAppSelector(state => state.bordereau.entities);

  const avoirs = useAppSelector(state => state.avoir.entities);
  const factures = useAppSelector(state => state.facture.entities);
  const documentEntity = useAppSelector(state => state.document.entity);
  const loading = useAppSelector(state => state.document.loading);
  const updating = useAppSelector(state => state.document.updating);
  const updateSuccess = useAppSelector(state => state.document.updateSuccess);
  const [bordereausSelected, setBordereausSelected] = useState<IBordereau[]>([]);

  const handleClose = () => {
    navigate('/document' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
      dispatch(getBordereaus({}))
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getAvoirs({}));
    dispatch(getFactures({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleBordereauChange = e => {
    const selectedId = e.target.value;
    const selectedEntity = bordereaus.find(entity => entity.id.toString() === selectedId);
    if (selectedEntity) {
      setBordereausSelected([...bordereausSelected, selectedEntity]);
    }
  };
  const saveEntity = async values => {
    const entity = {
      ...documentEntity,
      ...values,
    };

    if (isNew) {
      const result = await dispatch(createEntity(entity));
      const newBordereauId = result.payload["data"];
      for (const bord of bordereausSelected) {
        const borderauxs = {
          documents: newBordereauId,
          bordereaus: bord,
          dateDebut: new Date(),
        };
       dispatch(createLigneDocument(borderauxs));
      }
    }
     else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...documentEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.document.home.createOrEditLabel" data-cy="DocumentCreateUpdateHeading">
            <Translate contentKey="faeApp.document.home.createOrEditLabel">Create or edit a Document</Translate>
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
                  id="document-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label={translate('faeApp.document.code')} id="document-code" name="code" data-cy="code" type="text" />
              <ValidatedField
                label={translate('faeApp.document.reference')}
                id="document-reference"
                name="reference"
                data-cy="reference"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.document.montantTotal')}
                id="document-montantTotal"
                name="montantTotal"
                data-cy="montantTotal"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.document.dateCreation')}
                id="document-dateCreation"
                name="dateCreation"
                data-cy="dateCreation"
                type="date"
                value={new Date().toISOString().split('T')[0]}  // Valeur par défaut
                disabled  // Désactiver le champ
              />

              <ValidatedField
                label={translate('faeApp.lignesDocument.dateDebut')}
                id="lignes-document-dateDebut"
                name="dateDebut"
                data-cy="dateDebut"
                type="date"
              />

              <ValidatedField
                id="lignes-document-bordereaus"
                name="bordereaus"
                data-cy="bordereaus"
                label={translate('faeApp.lignesDocument.bordereaus')}
                type="select"
                onChange={handleBordereauChange}
                multiple
              >
                <option value="" key="0" />
                {bordereaus
                  ? bordereaus.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.reference}
                      </option>
                    ))
                  : null}
              </ValidatedField>

              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/document" replace color="info">
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

export default DocumentUpdate;
