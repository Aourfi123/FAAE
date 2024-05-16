import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './demande-rembourssement.reducer';

export const DemandeRembourssementDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const demandeRembourssementEntity = useAppSelector(state => state.demandeRembourssement.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="demandeRembourssementDetailsHeading">
          <Translate contentKey="faeApp.demandeRembourssement.detail.title">DemandeRembourssement</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{demandeRembourssementEntity.id}</dd>
          <dt>
            <span id="raison">
              <Translate contentKey="faeApp.demandeRembourssement.raison">Raison</Translate>
            </span>
          </dt>
          <dd>{demandeRembourssementEntity.raison}</dd>
          <dt>
            <span id="pieceJointe">
              <Translate contentKey="faeApp.demandeRembourssement.pieceJointe">Piece Jointe</Translate>
            </span>
          </dt>
          <dd>
            {demandeRembourssementEntity.pieceJointe ? (
              <div>
                {demandeRembourssementEntity.pieceJointeContentType ? (
                  <a onClick={openFile(demandeRembourssementEntity.pieceJointeContentType, demandeRembourssementEntity.pieceJointe)}>
                    <img
                      src={`data:${demandeRembourssementEntity.pieceJointeContentType};base64,${demandeRembourssementEntity.pieceJointe}`}
                      style={{ maxHeight: '30px' }}
                    />
                  </a>
                ) : null}
                <span>
                  {demandeRembourssementEntity.pieceJointeContentType}, {byteSize(demandeRembourssementEntity.pieceJointe)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="etat">
              <Translate contentKey="faeApp.demandeRembourssement.etat">Etat</Translate>
            </span>
          </dt>
          <dd>{demandeRembourssementEntity.etat}</dd>
          <dt>
            <span id="dateCreation">
              <Translate contentKey="faeApp.demandeRembourssement.dateCreation">Date Creation</Translate>
            </span>
          </dt>
          <dd>
            {demandeRembourssementEntity.dateCreation ? (
              <TextFormat value={demandeRembourssementEntity.dateCreation} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateModification">
              <Translate contentKey="faeApp.demandeRembourssement.dateModification">Date Modification</Translate>
            </span>
          </dt>
          <dd>
            {demandeRembourssementEntity.dateModification ? (
              <TextFormat value={demandeRembourssementEntity.dateModification} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/demande-rembourssement" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/demande-rembourssement/${demandeRembourssementEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default DemandeRembourssementDetail;
