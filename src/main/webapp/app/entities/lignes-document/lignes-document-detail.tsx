import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './lignes-document.reducer';

export const LignesDocumentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const lignesDocumentEntity = useAppSelector(state => state.lignesDocument.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="lignesDocumentDetailsHeading">
          <Translate contentKey="faeApp.lignesDocument.detail.title">LignesDocument</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{lignesDocumentEntity.id}</dd>
          <dt>
            <span id="dateDebut">
              <Translate contentKey="faeApp.lignesDocument.dateDebut">Date Debut</Translate>
            </span>
          </dt>
          <dd>
            {lignesDocumentEntity.dateDebut ? (
              <TextFormat value={lignesDocumentEntity.dateDebut} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateFin">
              <Translate contentKey="faeApp.lignesDocument.dateFin">Date Fin</Translate>
            </span>
          </dt>
          <dd>
            {lignesDocumentEntity.dateFin ? (
              <TextFormat value={lignesDocumentEntity.dateFin} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="faeApp.lignesDocument.bordereaus">Bordereaus</Translate>
          </dt>
          <dd>{lignesDocumentEntity.bordereaus ? lignesDocumentEntity.bordereaus.id : ''}</dd>
          <dt>
            <Translate contentKey="faeApp.lignesDocument.documents">Documents</Translate>
          </dt>
          <dd>{lignesDocumentEntity.documents ? lignesDocumentEntity.documents.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/lignes-document" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/lignes-document/${lignesDocumentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default LignesDocumentDetail;
