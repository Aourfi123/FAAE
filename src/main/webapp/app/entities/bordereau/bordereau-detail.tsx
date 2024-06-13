import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Table } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './bordereau.reducer';
import { getEntities as getLignesBordereau } from 'app/entities/lignes-bordereau/lignes-bordereau.reducer';

export const BordereauDetail = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
    dispatch(getLignesBordereau({}));
  }, [id]);

  const bordereauEntity = useAppSelector(state => state.bordereau.entity);
  const ligneBordereauList = useAppSelector(state => state.lignesBordereau.entities);

  const filteredLignes = ligneBordereauList.filter(
    ligne => ligne.bordereaus && ligne.bordereaus.id === bordereauEntity.id
  );

  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bordereauDetailsHeading">
          <Translate contentKey="faeApp.bordereau.detail.title">Bordereau</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{bordereauEntity.id}</dd>
          <dt>
            <span id="reference">
              <Translate contentKey="faeApp.bordereau.reference">Reference</Translate>
            </span>
          </dt>
          <dd>{bordereauEntity.reference}</dd>
          <dt>
            <span id="etat">
              <Translate contentKey="faeApp.bordereau.etat">Etat</Translate>
            </span>
          </dt>
          <dd>{bordereauEntity.etat}</dd>
          <dt>
            <span id="montantTotal">
              <Translate contentKey="faeApp.bordereau.montantTotal">Montant Total</Translate>
            </span>
          </dt>
          <dd>{bordereauEntity.montantTotal}</dd>
          <dt>
            <span id="dateCreation">
              <Translate contentKey="faeApp.bordereau.dateCreation">Date Creation</Translate>
            </span>
          </dt>
          <dd>
            {bordereauEntity.dateCreation ? (
              <TextFormat value={bordereauEntity.dateCreation} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="dateModification">
              <Translate contentKey="faeApp.bordereau.dateModification">Date Modification</Translate>
            </span>
          </dt>
          <dd>
            {bordereauEntity.dateModification ? (
              <TextFormat value={bordereauEntity.dateModification} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
        </dl>

        <h3>
          <Translate contentKey="faeApp.bordereau.detail.title">Articles</Translate>
        </h3>
        <Table>
          <thead>
            <tr>
              <th>
                <Translate contentKey="faeApp.article.modele">Modele</Translate>
              </th>
              <th>
               Quantité    </th>
            </tr>
          </thead>
          <tbody>
            {filteredLignes.map((ligne, index) => (
              <tr key={index}>
                <td>{ligne.articles ? ligne.articles.modele : ''}</td>
                <td>{ligne.quantite}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button tag={Link} to="/bordereau" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/bordereau/${bordereauEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default BordereauDetail;
