import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IFacture } from 'app/shared/model/facture.model';
import { getEntities as getFactures , updateEntity as updateFacture} from 'app/entities/facture/facture.reducer';
import { IPaiement } from 'app/shared/model/paiement.model';
import { getEntity, updateEntity, createEntity, reset } from './paiement.reducer';
import { getEntities as getDocuments } from 'app/entities/document/document.reducer';

interface PaiementUpdateProps {
  factureId: number;
  documentId: number;
}

export const PaiementUpdate: React.FC<PaiementUpdateProps> = ({ factureId ,documentId }) => {
  // Utilisez factureId ici
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;
  const documentList = useAppSelector(state => state.document.entities);

  const factures = useAppSelector(state => state.facture.entities);
  const paiementEntity = useAppSelector(state => state.paiement.entity);
  const loading = useAppSelector(state => state.paiement.loading);
  const updating = useAppSelector(state => state.paiement.updating);
  const updateSuccess = useAppSelector(state => state.paiement.updateSuccess);

  const handleClose = () => {
    navigate('/document' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getFactures({}));
    dispatch(getDocuments({}))
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    console.log(values.facture)
    const entity = {
      ...paiementEntity,
      ...values,
      facture: factures.find(f => f.code == values.factures)
    };
    console.log(documentId +" "+ factureId)
    const entityFacture = {
      id: factureId,
      document:  documentList.find(d => d &&  d.id == documentId),
      code: documentList.find(d => d &&  d.id == documentId)?.code,
      etat: 'Payé'
    };

    dispatch(updateFacture(entityFacture));

      dispatch(createEntity(entity));
    // Ou `dispatch(updateEntity(entity))` si c'est une mise à jour
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...paiementEntity,
          facture: paiementEntity?.facture?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">

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
                  id="paiement-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.paiement.reference')}
                id="paiement-reference"
                name="reference"
                data-cy="reference"
                type="text"
              />
              <ValidatedField label={translate('faeApp.paiement.date')} id="paiement-date" name="date" data-cy="date" type="date" />
              <ValidatedField
                label={translate('faeApp.paiement.typePaiement')}
                id="paiement-typePaiement"
                name="typePaiement"
                data-cy="typePaiement"
                type="text"
              />

              <ValidatedField
                  id="paiement-facture"
                  name="facture"
                  data-cy="facture"
                  label={translate('faeApp.paiement.facture')}
                  type="text"
                  value={factures.find(f => f.id == factureId).code}
                  disabled
                />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/paiement" replace color="info">
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

export default PaiementUpdate;
