import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, updateEntity, createEntity, reset } from './tarif.reducer';
import { getEntities as getReductions } from 'app/entities/reduction/reduction.reducer';
import { getEntities as getArticles } from 'app/entities/article/article.reducer';
import Sidebar from 'app/shared/layout/sidebar/Sidebar';
import './tarif.css'; // Import the CSS file

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
  }, [id, isNew]);

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
    <div className="container update-for">
      <Sidebar />
      <Row className="justify-content-center">
        <Col md="6">
          <Card>
            <CardBody>
              <CardTitle tag="h2" className="text-left text-black custom-title-bar py-2">
                <Translate contentKey="faeApp.tarif.home.createOrEditLabel">Créer ou éditer un Tarif</Translate>
              </CardTitle>
              <br />
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
                      className="custom-input-field"
                    />
                  ) : null}
                  <ValidatedField
                    label={translate('faeApp.tarif.dateDebut')}
                    id="tarif-dateDebut"
                    name="dateDebut"
                    data-cy="dateDebut"
                    type="date"
                    className="custom-input-field"
                  />
                  <ValidatedField
                    label={translate('faeApp.tarif.dateFin')}
                    id="tarif-dateFin"
                    name="dateFin"
                    data-cy="dateFin"
                    type="date"
                    className="custom-input-field"
                  />
                  <ValidatedField
                    id="tarif-reductions"
                    name="reductions"
                    data-cy="reductions"
                    label={translate('faeApp.tarif.reductions')}
                    type="select"
                    className="custom-input-field"
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
                    className="custom-input-field"
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
                  <div className="text-center">
                    <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/tarif" replace className="custom-back-button m-2">
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

export default TarifUpdate;
