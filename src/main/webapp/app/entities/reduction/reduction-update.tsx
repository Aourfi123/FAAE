import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ISocieteCommerciale } from 'app/shared/model/societe-commerciale.model';
import { getEntities as getSocieteCommerciales } from 'app/entities/societe-commerciale/societe-commerciale.reducer';
import { IReduction } from 'app/shared/model/reduction.model';
import { getEntity, updateEntity, createEntity, reset } from './reduction.reducer';
import Sidebar from 'app/shared/layout/sidebar/Sidebar';
import './reduction.css'; // Import the custom CSS file

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
    <div className="container update-fo">
      <Sidebar />
      <Row className="justify-content-center">
        <Col md="6">
          <Card>
            <CardBody>
              <CardTitle tag="h2" className="text-left text-black custom-title-bar py-2">
                {type === 'remise' ? (
                  <div>Créer ou éditer une Remise</div>
                ) : (
                  <div>Créer ou éditer un Taxe</div>
                )}
              </CardTitle>

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
                      validate={{ required: true }}
                      className="custom-input-field" // Add the custom class here
                    />
                  ) : null}
                  <ValidatedField
                    label={translate('faeApp.reduction.description')}
                    id="reduction-description"
                    name="description"
                    data-cy="description"
                    type="text"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    label={translate('faeApp.reduction.typeOperation')}
                    id="reduction-typeOperation"
                    name="typeOperation"
                    data-cy="typeOperation"
                    type="text"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    label={translate('faeApp.reduction.pourcentage')}
                    id="reduction-pourcentage"
                    name="pourcentage"
                    data-cy="pourcentage"
                    type="text"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateDebut')}
                    id="reduction-dateDebut"
                    name="dateDebut"
                    data-cy="dateDebut"
                    type="date"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateFin')}
                    id="reduction-dateFin"
                    name="dateFin"
                    data-cy="dateFin"
                    type="date"
                    className="custom-input-field" // Add the custom class here
                  />
                  <ValidatedField
                    id="reduction-societeCommercial"
                    name="societeCommercial"
                    data-cy="societeCommercial"
                    label={translate('faeApp.reduction.societeCommercial')}
                    type="select"
                    className="custom-input-field" // Add the custom class here
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
                  <div className="text-center">
                    <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/reduction" replace className="custom-back-button m-2">
                      <FontAwesomeIcon icon="arrow-left" />
                      &nbsp;
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.back">Back</Translate>
                      </span>
                    </Button>
                    <Button id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating} className="custom-save-button m-2">
                      <FontAwesomeIcon icon="save" />
                      &nbsp;
                      <Translate contentKey="entity.action.save">Save</Translate>
                    </Button>
                  </div>
                </ValidatedForm>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReductionUpdate;
