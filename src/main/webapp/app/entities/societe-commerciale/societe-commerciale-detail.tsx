import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './societe-commerciale.reducer';

export const SocieteCommercialeDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const societeCommercialeEntity = useAppSelector(state => state.societeCommerciale.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="societeCommercialeDetailsHeading">
          <Translate contentKey="faeApp.societeCommerciale.detail.title">SocieteCommerciale</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{societeCommercialeEntity.id}</dd>
          <dt>
            <span id="codePays">
              <Translate contentKey="faeApp.societeCommerciale.codePays">Code Pays</Translate>
            </span>
          </dt>
          <dd>{societeCommercialeEntity.codePays}</dd>
          <dt>
            <span id="libelle">
              <Translate contentKey="faeApp.societeCommerciale.libelle">Libelle</Translate>
            </span>
          </dt>
          <dd>{societeCommercialeEntity.libelle}</dd>
          <dt>
            <span id="devise">
              <Translate contentKey="faeApp.societeCommerciale.devise">Devise</Translate>
            </span>
          </dt>
          <dd>{societeCommercialeEntity.devise}</dd>
        </dl>
        <Button tag={Link} to="/societe-commerciale" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/societe-commerciale/${societeCommercialeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SocieteCommercialeDetail;
