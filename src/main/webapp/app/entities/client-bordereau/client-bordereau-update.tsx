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
import { IClient } from 'app/shared/model/client.model';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { IClientBordereau } from 'app/shared/model/client-bordereau.model';
import { getEntity, updateEntity, createEntity, reset } from './client-bordereau.reducer';

export const ClientBordereauUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const bordereaus = useAppSelector(state => state.bordereau.entities);
  const clients = useAppSelector(state => state.client.entities);
  const clientBordereauEntity = useAppSelector(state => state.clientBordereau.entity);
  const loading = useAppSelector(state => state.clientBordereau.loading);
  const updating = useAppSelector(state => state.clientBordereau.updating);
  const updateSuccess = useAppSelector(state => state.clientBordereau.updateSuccess);

  const handleClose = () => {
    navigate('/client-bordereau' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getBordereaus({}));
    dispatch(getClients({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...clientBordereauEntity,
      ...values,
      bordereaus: bordereaus.find(it => it.id.toString() === values.bordereaus.toString()),
      clients: clients.find(it => it.id.toString() === values.clients.toString()),
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
          ...clientBordereauEntity,
          bordereaus: clientBordereauEntity?.bordereaus?.id,
          clients: clientBordereauEntity?.clients?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.clientBordereau.home.createOrEditLabel" data-cy="ClientBordereauCreateUpdateHeading">
            <Translate contentKey="faeApp.clientBordereau.home.createOrEditLabel">Create or edit a ClientBordereau</Translate>
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
                  id="client-bordereau-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.clientBordereau.dateDebut')}
                id="client-bordereau-dateDebut"
                name="dateDebut"
                data-cy="dateDebut"
                type="date"
              />
              <ValidatedField
                label={translate('faeApp.clientBordereau.dateFin')}
                id="client-bordereau-dateFin"
                name="dateFin"
                data-cy="dateFin"
                type="date"
              />
              <ValidatedField
                id="client-bordereau-bordereaus"
                name="bordereaus"
                data-cy="bordereaus"
                label={translate('faeApp.clientBordereau.bordereaus')}
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
                id="client-bordereau-clients"
                name="clients"
                data-cy="clients"
                label={translate('faeApp.clientBordereau.clients')}
                type="select"
              >
                <option value="" key="0" />
                {clients
                  ? clients.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/client-bordereau" replace color="info">
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

export default ClientBordereauUpdate;
