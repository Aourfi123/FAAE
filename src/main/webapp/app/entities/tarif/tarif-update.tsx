import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IReduction } from 'app/shared/model/reduction.model';
import { getEntities as getReductions } from 'app/entities/reduction/reduction.reducer';
import { IArticle } from 'app/shared/model/article.model';
import { getEntities as getArticles } from 'app/entities/article/article.reducer';
import { ITarif } from 'app/shared/model/tarif.model';
import { getEntity, updateEntity, createEntity, reset } from './tarif.reducer';

export const TarifUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const reductions = useAppSelector(state => state.reduction.entities);
  const articles = useAppSelector(state => state.article.entities);
  const tarifEntity = useAppSelector(state => state.tarif.entity);
  const loading = useAppSelector(state => state.tarif.loading);
  const updating = useAppSelector(state => state.tarif.updating);
  const updateSuccess = useAppSelector(state => state.tarif.updateSuccess);

  const handleClose = () => {
    navigate('/tarif' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getReductions({}));
    dispatch(getArticles({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...tarifEntity,
      ...values,
      reductions: reductions.find(it => it.id.toString() === values.reductions.toString()),
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
          ...tarifEntity,
          reductions: tarifEntity?.reductions?.id,
          articles: tarifEntity?.articles?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.tarif.home.createOrEditLabel" data-cy="TarifCreateUpdateHeading">
            <Translate contentKey="faeApp.tarif.home.createOrEditLabel">Create or edit a Tarif</Translate>
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
                  id="tarif-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.tarif.dateDebut')}
                id="tarif-dateDebut"
                name="dateDebut"
                data-cy="dateDebut"
                type="date"
              />
              <ValidatedField label={translate('faeApp.tarif.dateFin')} id="tarif-dateFin" name="dateFin" data-cy="dateFin" type="date" />
              <ValidatedField
                id="tarif-reductions"
                name="reductions"
                data-cy="reductions"
                label={translate('faeApp.tarif.reductions')}
                type="select"
              >
                <option value="" key="0" />
                {reductions
                  ? reductions.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="tarif-articles"
                name="articles"
                data-cy="articles"
                label={translate('faeApp.tarif.articles')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/tarif" replace color="info">
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

export default TarifUpdate;
