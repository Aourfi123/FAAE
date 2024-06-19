import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './societe-commerciale.reducer';
import './SocieteCommerciale.css';
import Sidebar from "app/shared/layout/sidebar/Sidebar"; // Import the new CSS file

export const SocieteCommercialeDetail = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const societeCommercialeEntity = useAppSelector(state => state.societeCommerciale.entity);
  return (
    <div className="container mt-4">
      <Sidebar/>
      <Row className="justify-content-center">
        <Col md="8">
          <Card className="mb-4">
            <CardBody className="societe-detail">
              <CardTitle tag="h2" className="text-center mb-4">
                <Translate contentKey="faeApp.societeCommerciale.detail.title">Societe Commerciale</Translate>
              </CardTitle>
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
              <div className="button-container">
                <Button tag={Link} to="/societe-commerciale" replace color="info" data-cy="entityDetailsBackButton">
                  <FontAwesomeIcon icon="arrow-left" />{' '}
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SocieteCommercialeDetail;
