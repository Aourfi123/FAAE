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
import { IArticle } from 'app/shared/model/article.model';
import { getEntities as getArticles } from 'app/entities/article/article.reducer';
import { ILignesBordereau } from 'app/shared/model/lignes-bordereau.model';
import { getEntity, updateEntity, createEntity, reset } from './lignes-bordereau.reducer';

export const LignesBordereauUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const bordereaus = useAppSelector(state => state.bordereau.entities);
  const articles = useAppSelector(state => state.article.entities);
  const lignesBordereauEntity = useAppSelector(state => state.lignesBordereau.entity);
  const loading = useAppSelector(state => state.lignesBordereau.loading);
  const updating = useAppSelector(state => state.lignesBordereau.updating);
  const updateSuccess = useAppSelector(state => state.lignesBordereau.updateSuccess);

  const handleClose = () => {
    navigate('/lignes-bordereau' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getBordereaus({}));
    dispatch(getArticles({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...lignesBordereauEntity,
      ...values,
      bordereaus: bordereaus.find(it => it.id.toString() === values.bordereaus.toString()),
      articles: articles.find(it => it.id.toString() === values.articles.toString()),
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
          ...lignesBordereauEntity,
          bordereaus: lignesBordereauEntity?.bordereaus?.id,
          articles: lignesBordereauEntity?.articles?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.lignesBordereau.home.createOrEditLabel" data-cy="LignesBordereauCreateUpdateHeading">
            <Translate contentKey="faeApp.lignesBordereau.home.createOrEditLabel">Create or edit a LignesBordereau</Translate>
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
                  id="lignes-bordereau-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.lignesBordereau.quantite')}
                id="lignes-bordereau-quantite"
                name="quantite"
                data-cy="quantite"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.lignesBordereau.dateDebut')}
                id="lignes-bordereau-dateDebut"
                name="dateDebut"
                data-cy="dateDebut"
                type="date"
              />
              <ValidatedField
                label={translate('faeApp.lignesBordereau.dateFin')}
                id="lignes-bordereau-dateFin"
                name="dateFin"
                data-cy="dateFin"
                type="date"
              />
              <ValidatedField
                id="lignes-bordereau-bordereaus"
                name="bordereaus"
                data-cy="bordereaus"
                label={translate('faeApp.lignesBordereau.bordereaus')}
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
                id="lignes-bordereau-articles"
                name="articles"
                data-cy="articles"
                label={translate('faeApp.lignesBordereau.articles')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/lignes-bordereau" replace color="info">
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

export default LignesBordereauUpdate;
