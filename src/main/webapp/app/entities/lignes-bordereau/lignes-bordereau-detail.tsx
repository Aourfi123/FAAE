import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './lignes-bordereau.reducer';

export const LignesBordereauDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const lignesBordereauEntity = useAppSelector(state => state.lignesBordereau.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="lignesBordereauDetailsHeading">
          <Translate contentKey="faeApp.lignesBordereau.detail.title">LignesBordereau</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{lignesBordereauEntity.id}</dd>
          <dt>
            <span id="quantite">
              <Translate contentKey="faeApp.lignesBordereau.quantite">Quantite</Translate>
            </span>
          </dt>
          <dd>{lignesBordereauEntity.quantite}</dd>
          <dt>
            <span id="dateDebut">
              <Translate contentKey="faeApp.lignesBordereau.dateDebut">Date Debut</Translate>
            </span>
          </dt>
          <dd>
            {lignesBordereauEntity.dateDebut ? (
              <TextFormat value={lignesBordereauEntity.dateDebut} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateFin">
              <Translate contentKey="faeApp.lignesBordereau.dateFin">Date Fin</Translate>
            </span>
          </dt>
          <dd>
            {lignesBordereauEntity.dateFin ? (
              <TextFormat value={lignesBordereauEntity.dateFin} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="faeApp.lignesBordereau.bordereaus">Bordereaus</Translate>
          </dt>
          <dd>{lignesBordereauEntity.bordereaus ? lignesBordereauEntity.bordereaus.id : ''}</dd>
          <dt>
            <Translate contentKey="faeApp.lignesBordereau.articles">Articles</Translate>
          </dt>
          <dd>{lignesBordereauEntity.articles ? lignesBordereauEntity.articles.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/lignes-bordereau" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/lignes-bordereau/${lignesBordereauEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default LignesBordereauDetail;
