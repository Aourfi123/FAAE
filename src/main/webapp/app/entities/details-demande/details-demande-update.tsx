import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IArticle } from 'app/shared/model/article.model';
import { getEntities as getArticles } from 'app/entities/article/article.reducer';
import { IDemandeRembourssement } from 'app/shared/model/demande-rembourssement.model';
import { getEntities as getDemandeRembourssements } from 'app/entities/demande-rembourssement/demande-rembourssement.reducer';
import { IDetailsDemande } from 'app/shared/model/details-demande.model';
import { getEntity, updateEntity, createEntity, reset } from './details-demande.reducer';

export const DetailsDemandeUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const articles = useAppSelector(state => state.article.entities);
  const demandeRembourssements = useAppSelector(state => state.demandeRembourssement.entities);
  const detailsDemandeEntity = useAppSelector(state => state.detailsDemande.entity);
  const loading = useAppSelector(state => state.detailsDemande.loading);
  const updating = useAppSelector(state => state.detailsDemande.updating);
  const updateSuccess = useAppSelector(state => state.detailsDemande.updateSuccess);

  const handleClose = () => {
    navigate('/details-demande' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getArticles({}));
    dispatch(getDemandeRembourssements({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...detailsDemandeEntity,
      ...values,
      articles: articles.find(it => it.id.toString() === values.articles.toString()),
      demandeRemboursements: demandeRembourssements.find(it => it.id.toString() === values.demandeRemboursements.toString()),
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
          ...detailsDemandeEntity,
          articles: detailsDemandeEntity?.articles?.id,
          demandeRemboursements: detailsDemandeEntity?.demandeRemboursements?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.detailsDemande.home.createOrEditLabel" data-cy="DetailsDemandeCreateUpdateHeading">
            <Translate contentKey="faeApp.detailsDemande.home.createOrEditLabel">Create or edit a DetailsDemande</Translate>
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
                  id="details-demande-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.detailsDemande.quantite')}
                id="details-demande-quantite"
                name="quantite"
                data-cy="quantite"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.detailsDemande.etat')}
                id="details-demande-etat"
                name="etat"
                data-cy="etat"
                type="text"
              />
              <ValidatedField
                id="details-demande-articles"
                name="articles"
                data-cy="articles"
                label={translate('faeApp.detailsDemande.articles')}
                type="select"
              >
                <option value="" key="0" />
                {articles
                  ? articles.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="details-demande-demandeRemboursements"
                name="demandeRemboursements"
                data-cy="demandeRemboursements"
                label={translate('faeApp.detailsDemande.demandeRemboursements')}
                type="select"
              >
                <option value="" key="0" />
                {demandeRembourssements
                  ? demandeRembourssements.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/details-demande" replace color="info">
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

export default DetailsDemandeUpdate;
