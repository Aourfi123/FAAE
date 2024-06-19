import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getFactures, updateEntity as updateFacture } from 'app/entities/facture/facture.reducer';
import { getEntity, updateEntity, createEntity, reset } from './paiement.reducer';
import { getEntities as getDocuments } from 'app/entities/document/document.reducer';
import Sidebar from "app/shared/layout/sidebar/Sidebar";
import "./payment.css";

interface PaiementUpdateProps {
  factureId: string | number;
  documentId: string | number;
}

export const PaiementUpdate: React.FC<PaiementUpdateProps> = ({ factureId, documentId }) => {
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
    dispatch(getDocuments({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...paiementEntity,
      ...values,
      facture: values.factures,
    };

    const entityFacture = {
      ...values,
      document: documentId,
      code: documentList.find(d => d && d === documentId)?.code,
      id: factureId,
      etat: 'Payé'
    };

    dispatch(updateFacture(entityFacture));
    dispatch(createEntity(entity));
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
      <Sidebar />
      <Row className="justify-content-center payment-modal">
        <Col >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              <Row>
                <Col md="6" className="pay">
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
                  <ValidatedField
                    label={translate('faeApp.paiement.date')}
                    id="paiement-date"
                    name="date"
                    data-cy="date"
                    type="date"
                  />
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
                    value={factures.find(f => f.id == factureId)?.code}
                    disabled
                  />
                </Col>
                <Col md="6" className="payment-card-info">
                  <div className="card-icons">
                    <img src="content/images/visa.png" alt="Visa" />
                    <img src="content/images/master card.jpg" alt="MasterCard" />
                    <img src="content/images/amex.png" alt="Amex" />
                    <img src="content/images/paybal.png" alt="PayPal" />
                  </div>
                  <ValidatedField
                    name="cardName"
                    label="Nom sur la carte"
                    id="card-name"
                    type="text"
                    validate={{ required: { value: true, message: 'Ce champ est requis.' } }}
                  />
                  <ValidatedField
                    name="cardNumber"
                    label="N° de carte"
                    id="card-number"
                    type="text"
                    validate={{ required: { value: true, message: 'Ce champ est requis.' }, pattern: { value: /^\d{4} \d{4} \d{4} \d{4}$/, message: 'Numéro de carte invalide.' } }}
                  />
                  <ValidatedField
                    name="expirationDate"
                    label="Date d'expiration"
                    id="expiration-date"
                    type="text"
                    placeholder="MM/AA"
                    validate={{ required: { value: true, message: 'Ce champ est requis.' }, pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Date d\'expiration invalide.' } }}
                  />
                  <ValidatedField
                    name="cvv"
                    label="Cryptogramme visuel"
                    id="card-cvv"
                    type="text"
                    validate={{ required: { value: true, message: 'Ce champ est requis.' }, pattern: { value: /^\d{3}$/, message: 'CVV invalide.' } }}
                  />
                  <Row className="justify-content-end">
                    <Col md="auto">
                      <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/document" replace color="info" className="back">
                        <FontAwesomeIcon icon="arrow-left" />
                        &nbsp;
                        <span className="d-none d-md-inline ">
                      <Translate contentKey="entity.action.back">Back</Translate>
                    </span>
                      </Button>
                    </Col>

                    <Col md="auto ">
                      <Button color="primary" id="save-entity" size="sm" data-cy="entityCreateSaveButton" type="submit" disabled={updating} className="back1" style={{width:"160px"}}>
                        <FontAwesomeIcon icon="save" />
                        &nbsp;
                        <Translate contentKey="entity.action.save">Save</Translate>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PaiementUpdate;
