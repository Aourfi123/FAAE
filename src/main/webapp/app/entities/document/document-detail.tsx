import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './document.reducer';

export const DocumentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const documentEntity = useAppSelector(state => state.document.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="documentDetailsHeading">
          <Translate contentKey="faeApp.document.detail.title">Document</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{documentEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="faeApp.document.code">Code</Translate>
            </span>
          </dt>
          <dd>{documentEntity.code}</dd>
          <dt>
            <span id="reference">
              <Translate contentKey="faeApp.document.reference">Reference</Translate>
            </span>
          </dt>
          <dd>{documentEntity.reference}</dd>
          <dt>
            <span id="montantTotal">
              <Translate contentKey="faeApp.document.montantTotal">Montant Total</Translate>
            </span>
          </dt>
          <dd>{documentEntity.montantTotal}</dd>
          <dt>
            <span id="dateCreation">
              <Translate contentKey="faeApp.document.dateCreation">Date Creation</Translate>
            </span>
          </dt>
          <dd>
            {documentEntity.dateCreation ? (
              <TextFormat value={documentEntity.dateCreation} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateModification">
              <Translate contentKey="faeApp.document.dateModification">Date Modification</Translate>
            </span>
          </dt>
          <dd>
            {documentEntity.dateModification ? (
              <TextFormat value={documentEntity.dateModification} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/document" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/document/${documentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default DocumentDetail;
