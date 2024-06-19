import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './tarif.reducer';
import Sidebar from 'app/shared/layout/sidebar/Sidebar'; // Import the Sidebar component
import './tarif.css';

export const TarifDetail = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, [dispatch, id]);

  const tarifEntity = useAppSelector(state => state.tarif.entity);
  return (
    <div className="container-fluid">
      <Row>
        <Col md="3">
          <Sidebar /> {/* Use the Sidebar component */}
        </Col>
        <Col md="9" className="offset-md-3 tarif-container">
          <Row className="justify-content-center">
            <Col md="12">
              <Card className="mb-4">
                <CardBody className="tarif-detail-card">
                  <CardTitle tag="h2" className="text-center mb-4">
                    <Translate contentKey="faeApp.tarif.detail.title">Tarif</Translate>
                  </CardTitle>
                  <dl className="tarif-entity-details">
                    <dt>
                      <span id="id">
                        <Translate contentKey="global.field.id">ID</Translate>
                      </span>
                    </dt>
                    <dd>{tarifEntity.id}</dd>
                    <dt>
                      <span id="dateDebut">
                        <Translate contentKey="faeApp.tarif.dateDebut">Date Debut</Translate>
                      </span>
                    </dt>
                    <dd>
                      {tarifEntity.dateDebut ? (
                        <TextFormat value={tarifEntity.dateDebut} type="date" format={APP_LOCAL_DATE_FORMAT} />
                      ) : null}
                    </dd>
                    <dt>
                      <span id="dateFin">
                        <Translate contentKey="faeApp.tarif.dateFin">Date Fin</Translate>
                      </span>
                    </dt>
                    <dd>
                      {tarifEntity.dateFin ? (
                        <TextFormat value={tarifEntity.dateFin} type="date" format={APP_LOCAL_DATE_FORMAT} />
                      ) : null}
                    </dd>
                    <dt>
                      <Translate contentKey="faeApp.tarif.reductions">Reductions</Translate>
                    </dt>
                    <dd>{tarifEntity.reductions ? tarifEntity.reductions.id : ''}</dd>
                    <dt>
                      <Translate contentKey="faeApp.tarif.articles">Articles</Translate>
                    </dt>
                    <dd>{tarifEntity.articles ? tarifEntity.articles.id : ''}</dd>
                  </dl>
                  <div className="tarif-button-container">
                    <Button tag={Link} to="/tarif" replace color="info" data-cy="entityDetailsBackButton">
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
        </Col>
      </Row>
    </div>
  );
};

export default TarifDetail;
