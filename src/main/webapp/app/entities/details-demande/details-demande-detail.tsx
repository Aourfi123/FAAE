import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './details-demande.reducer';

export const DetailsDemandeDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const detailsDemandeEntity = useAppSelector(state => state.detailsDemande.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="detailsDemandeDetailsHeading">
          <Translate contentKey="faeApp.detailsDemande.detail.title">DetailsDemande</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{detailsDemandeEntity.id}</dd>
          <dt>
            <span id="quantite">
              <Translate contentKey="faeApp.detailsDemande.quantite">Quantite</Translate>
            </span>
          </dt>
          <dd>{detailsDemandeEntity.quantite}</dd>
          <dt>
            <span id="etat">
              <Translate contentKey="faeApp.detailsDemande.etat">Etat</Translate>
            </span>
          </dt>
          <dd>{detailsDemandeEntity.etat}</dd>
          <dt>
            <Translate contentKey="faeApp.detailsDemande.articles">Articles</Translate>
          </dt>
          <dd>{detailsDemandeEntity.articles ? detailsDemandeEntity.articles.id : ''}</dd>
          <dt>
            <Translate contentKey="faeApp.detailsDemande.demandeRemboursements">Demande Remboursements</Translate>
          </dt>
          <dd>{detailsDemandeEntity.demandeRemboursements ? detailsDemandeEntity.demandeRemboursements.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/details-demande" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/details-demande/${detailsDemandeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default DetailsDemandeDetail;
