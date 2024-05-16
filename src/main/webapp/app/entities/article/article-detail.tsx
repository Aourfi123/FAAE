import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './article.reducer';

export const ArticleDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const articleEntity = useAppSelector(state => state.article.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="articleDetailsHeading">
          <Translate contentKey="faeApp.article.detail.title">Article</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{articleEntity.id}</dd>
          <dt>
            <span id="modele">
              <Translate contentKey="faeApp.article.modele">Modele</Translate>
            </span>
          </dt>
          <dd>{articleEntity.modele}</dd>
          <dt>
            <span id="largeurPneus">
              <Translate contentKey="faeApp.article.largeurPneus">Largeur Pneus</Translate>
            </span>
          </dt>
          <dd>{articleEntity.largeurPneus}</dd>
          <dt>
            <span id="hauteurPneus">
              <Translate contentKey="faeApp.article.hauteurPneus">Hauteur Pneus</Translate>
            </span>
          </dt>
          <dd>{articleEntity.hauteurPneus}</dd>
          <dt>
            <span id="typePneus">
              <Translate contentKey="faeApp.article.typePneus">Type Pneus</Translate>
            </span>
          </dt>
          <dd>{articleEntity.typePneus}</dd>
          <dt>
            <span id="diametre">
              <Translate contentKey="faeApp.article.diametre">Diametre</Translate>
            </span>
          </dt>
          <dd>{articleEntity.diametre}</dd>
          <dt>
            <span id="photo">
              <Translate contentKey="faeApp.article.photo">Photo</Translate>
            </span>
          </dt>
          <dd>
            {articleEntity.photo ? (
              <div>
                {articleEntity.photoContentType ? (
                  <a onClick={openFile(articleEntity.photoContentType, articleEntity.photo)}>
                    <img src={`data:${articleEntity.photoContentType};base64,${articleEntity.photo}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {articleEntity.photoContentType}, {byteSize(articleEntity.photo)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="dateCreation">
              <Translate contentKey="faeApp.article.dateCreation">Date Creation</Translate>
            </span>
          </dt>
          <dd>
            {articleEntity.dateCreation ? (
              <TextFormat value={articleEntity.dateCreation} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/article" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/article/${articleEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ArticleDetail;
