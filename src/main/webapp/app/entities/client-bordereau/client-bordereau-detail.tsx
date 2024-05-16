import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './client-bordereau.reducer';

export const ClientBordereauDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const clientBordereauEntity = useAppSelector(state => state.clientBordereau.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="clientBordereauDetailsHeading">
          <Translate contentKey="faeApp.clientBordereau.detail.title">ClientBordereau</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{clientBordereauEntity.id}</dd>
          <dt>
            <span id="dateDebut">
              <Translate contentKey="faeApp.clientBordereau.dateDebut">Date Debut</Translate>
            </span>
          </dt>
          <dd>
            {clientBordereauEntity.dateDebut ? (
              <TextFormat value={clientBordereauEntity.dateDebut} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateFin">
              <Translate contentKey="faeApp.clientBordereau.dateFin">Date Fin</Translate>
            </span>
          </dt>
          <dd>
            {clientBordereauEntity.dateFin ? (
              <TextFormat value={clientBordereauEntity.dateFin} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="faeApp.clientBordereau.bordereaus">Bordereaus</Translate>
          </dt>
          <dd>{clientBordereauEntity.bordereaus ? clientBordereauEntity.bordereaus.id : ''}</dd>
          <dt>
            <Translate contentKey="faeApp.clientBordereau.clients">Clients</Translate>
          </dt>
          <dd>{clientBordereauEntity.clients ? clientBordereauEntity.clients.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/client-bordereau" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/client-bordereau/${clientBordereauEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ClientBordereauDetail;
