import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './facture.reducer';

export const FactureDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const factureEntity = useAppSelector(state => state.facture.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="factureDetailsHeading">
          <Translate contentKey="faeApp.facture.detail.title">Facture</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{factureEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="faeApp.facture.code">Code</Translate>
            </span>
          </dt>
          <dd>{factureEntity.code}</dd>
          <dt>
            <span id="etat">
              <Translate contentKey="faeApp.facture.etat">Etat</Translate>
            </span>
          </dt>
          <dd>{factureEntity.etat}</dd>
          <dt>
            <Translate contentKey="faeApp.facture.document">Document</Translate>
          </dt>
          <dd>{factureEntity.document ? factureEntity.document.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/facture" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/facture/${factureEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default FactureDetail;
