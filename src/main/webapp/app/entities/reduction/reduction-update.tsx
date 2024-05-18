import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ISocieteCommerciale } from 'app/shared/model/societe-commerciale.model';
import { getEntities as getSocieteCommerciales } from 'app/entities/societe-commerciale/societe-commerciale.reducer';
import { IReduction } from 'app/shared/model/reduction.model';
import { getEntity, updateEntity, createEntity, reset } from './reduction.reducer';

export const ReductionUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const societeCommerciales = useAppSelector(state => state.societeCommerciale.entities);
  const reductionEntity = useAppSelector(state => state.reduction.entity);
  const loading = useAppSelector(state => state.reduction.loading);
  const updating = useAppSelector(state => state.reduction.updating);
  const updateSuccess = useAppSelector(state => state.reduction.updateSuccess);
  const location = useLocation();
  const type = new URLSearchParams(location.search).get('type') || 'remise'; // Default to 'remise' if not specified

  const handleClose = () => {
    navigate('/reduction' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
      console.log(type)
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getSocieteCommerciales({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...reductionEntity,
      ...values,
      societeCommercial: societeCommerciales.find(it => it.id.toString() === values.societeCommercial.toString()),
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
          ...reductionEntity,
          societeCommercial: reductionEntity?.societeCommercial?.id,
        };

  return (

    <div>
    {type === "remise" ? (
      <><Row className="justify-content-center">
          <Col md="8">
            <h2 id="faeApp.reduction.home.createOrEditLabel" data-cy="ReductionCreateUpdateHeading">
              Create or edit a Remise
            </h2>
          </Col>
        </Row><Row className="justify-content-center">
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
                      id="reduction-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }} />
                  ) : null}
                  <ValidatedField
                    label={translate('faeApp.reduction.description')}
                    id="reduction-description"
                    name="description"
                    data-cy="description"
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.typeOperation')}
                    id="reduction-typeOperation"
                    name="typeOperation"
                    data-cy="typeOperation"
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.pourcentage')}
                    id="reduction-pourcentage"
                    name="pourcentage"
                    data-cy="pourcentage"
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateDebut')}
                    id="reduction-dateDebut"
                    name="dateDebut"
                    data-cy="dateDebut"
                    type="date" />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateFin')}
                    id="reduction-dateFin"
                    name="dateFin"
                    data-cy="dateFin"
                    type="date" />
                  <ValidatedField
                    id="reduction-societeCommercial"
                    name="societeCommercial"
                    data-cy="societeCommercial"
                    label={translate('faeApp.reduction.societeCommercial')}
                    type="select"
                  >
                    <option value="" key="0" />
                    {societeCommerciales
                      ? societeCommerciales.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                      : null}
                  </ValidatedField>
                  <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/reduction" replace color="info">
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
          </Row></>
      ):(
        <><Row className="justify-content-center">
          <Col md="8">
            <h2 id="faeApp.reduction.home.createOrEditLabel" data-cy="ReductionCreateUpdateHeading">

Create or edit a Taxe            </h2>
          </Col>
        </Row><Row className="justify-content-center">
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
                      id="reduction-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }} />
                  ) : null}
                  <ValidatedField
                    label={translate('faeApp.reduction.description')}
                    id="reduction-description"
                    name="description"
                    data-cy="description"
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.typeOperation')}
                    id="reduction-typeOperation"
                    name="typeOperation"
                    data-cy="typeOperation"
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.pourcentage')}
                    id="reduction-pourcentage"
                    name="pourcentage"
                    data-cy="pourcentage"
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateDebut')}
                    id="reduction-dateDebut"
                    name="dateDebut"
                    data-cy="dateDebut"
                    type="date" />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateFin')}
                    id="reduction-dateFin"
                    name="dateFin"
                    data-cy="dateFin"
                    type="date" />
                  <ValidatedField
                    id="reduction-societeCommercial"
                    name="societeCommercial"
                    data-cy="societeCommercial"
                    label={translate('faeApp.reduction.societeCommercial')}
                    type="select"
                  >
                    <option value="" key="0" />
                    {societeCommerciales
                      ? societeCommerciales.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                      : null}
                  </ValidatedField>
                  <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/reduction" replace color="info">
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
          </Row></>
      )
    };
    </div>
    );
};

export default ReductionUpdate;
