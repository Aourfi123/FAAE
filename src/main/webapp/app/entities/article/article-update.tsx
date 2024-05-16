import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IArticle } from 'app/shared/model/article.model';
import { getEntity, updateEntity, createEntity, reset } from './article.reducer';

export const ArticleUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const articleEntity = useAppSelector(state => state.article.entity);
  const loading = useAppSelector(state => state.article.loading);
  const updating = useAppSelector(state => state.article.updating);
  const updateSuccess = useAppSelector(state => state.article.updateSuccess);

  const handleClose = () => {
    navigate('/article' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...articleEntity,
      ...values,
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
          ...articleEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.article.home.createOrEditLabel" data-cy="ArticleCreateUpdateHeading">
            <Translate contentKey="faeApp.article.home.createOrEditLabel">Create or edit a Article</Translate>
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
                  id="article-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField label={translate('faeApp.article.modele')} id="article-modele" name="modele" data-cy="modele" type="text" />
              <ValidatedField
                label={translate('faeApp.article.largeurPneus')}
                id="article-largeurPneus"
                name="largeurPneus"
                data-cy="largeurPneus"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.article.hauteurPneus')}
                id="article-hauteurPneus"
                name="hauteurPneus"
                data-cy="hauteurPneus"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.article.typePneus')}
                id="article-typePneus"
                name="typePneus"
                data-cy="typePneus"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.article.diametre')}
                id="article-diametre"
                name="diametre"
                data-cy="diametre"
                type="text"
              />
              <ValidatedBlobField
                label={translate('faeApp.article.photo')}
                id="article-photo"
                name="photo"
                data-cy="photo"
                isImage
                accept="image/*"
              />
              <ValidatedField
                label={translate('faeApp.article.dateCreation')}
                id="article-dateCreation"
                name="dateCreation"
                data-cy="dateCreation"
                type="date"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/article" replace color="info">
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

export default ArticleUpdate;
