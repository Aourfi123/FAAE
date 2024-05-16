import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './tarif.reducer';

export const TarifDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const tarifEntity = useAppSelector(state => state.tarif.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="tarifDetailsHeading">
          <Translate contentKey="faeApp.tarif.detail.title">Tarif</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{tarifEntity.id}</dd>
          <dt>
            <span id="dateDebut">
              <Translate contentKey="faeApp.tarif.dateDebut">Date Debut</Translate>
            </span>
          </dt>
          <dd>{tarifEntity.dateDebut ? <TextFormat value={tarifEntity.dateDebut} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="dateFin">
              <Translate contentKey="faeApp.tarif.dateFin">Date Fin</Translate>
            </span>
          </dt>
          <dd>{tarifEntity.dateFin ? <TextFormat value={tarifEntity.dateFin} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="faeApp.tarif.reductions">Reductions</Translate>
          </dt>
          <dd>{tarifEntity.reductions ? tarifEntity.reductions.id : ''}</dd>
          <dt>
            <Translate contentKey="faeApp.tarif.articles">Articles</Translate>
          </dt>
          <dd>{tarifEntity.articles ? tarifEntity.articles.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/tarif" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/tarif/${tarifEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default TarifDetail;
