import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './avoir.reducer';

export const AvoirDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const avoirEntity = useAppSelector(state => state.avoir.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="avoirDetailsHeading">
          <Translate contentKey="faeApp.avoir.detail.title">Avoir</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{avoirEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="faeApp.avoir.code">Code</Translate>
            </span>
          </dt>
          <dd>{avoirEntity.code}</dd>
          <dt>
            <Translate contentKey="faeApp.avoir.document">Document</Translate>
          </dt>
          <dd>{avoirEntity.document ? avoirEntity.document.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/avoir" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/avoir/${avoirEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AvoirDetail;
