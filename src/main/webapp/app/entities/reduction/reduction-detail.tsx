import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './reduction.reducer';

export const ReductionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const reductionEntity = useAppSelector(state => state.reduction.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="reductionDetailsHeading">
          <Translate contentKey="faeApp.reduction.detail.title">Reduction</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{reductionEntity.id}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="faeApp.reduction.description">Description</Translate>
            </span>
          </dt>
          <dd>{reductionEntity.description}</dd>
          <dt>
            <span id="typeOperation">
              <Translate contentKey="faeApp.reduction.typeOperation">Type Operation</Translate>
            </span>
          </dt>
          <dd>{reductionEntity.typeOperation}</dd>
          <dt>
            <span id="pourcentage">
              <Translate contentKey="faeApp.reduction.pourcentage">Pourcentage</Translate>
            </span>
          </dt>
          <dd>{reductionEntity.pourcentage}</dd>
          <dt>
            <span id="dateDebut">
              <Translate contentKey="faeApp.reduction.dateDebut">Date Debut</Translate>
            </span>
          </dt>
          <dd>
            {reductionEntity.dateDebut ? <TextFormat value={reductionEntity.dateDebut} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="dateFin">
              <Translate contentKey="faeApp.reduction.dateFin">Date Fin</Translate>
            </span>
          </dt>
          <dd>
            {reductionEntity.dateFin ? <TextFormat value={reductionEntity.dateFin} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="faeApp.reduction.societeCommercial">Societe Commercial</Translate>
          </dt>
          <dd>{reductionEntity.societeCommercial ? reductionEntity.societeCommercial.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/reduction" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/reduction/${reductionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ReductionDetail;
