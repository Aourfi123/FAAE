import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getSocieteCommericales } from 'app/entities/societe-commerciale/societe-commerciale.reducer';
import { getEntity, updateEntity, createEntity, reset } from './article.reducer';
import { getEntities as getReductions } from 'app/entities/reduction/reduction.reducer';
import { createEntity as createTarifEntity } from 'app/entities/tarif/tarif.reducer';
import Sidebar from 'app/shared/layout/sidebar/Sidebar';
import './article.css'; // Import the CSS file

export const ArticleUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const articleEntity = useAppSelector(state => state.article.entity);
  const loading = useAppSelector(state => state.article.loading);
  const updating = useAppSelector(state => state.article.updating);
  const updateSuccess = useAppSelector(state => state.article.updateSuccess);
  const societeCommercialeList = useAppSelector(state => state.societeCommerciale.entities);
  const reductionList = useAppSelector(state => state.reduction.entities);

  const [selectedSocieteCommerciale, setSelectedSocieteCommerciale] = useState(null);
  const [selectedTVA, setSelectedTVA] = useState(null);

  const handleClose = () => {
    navigate('/article' + location.search);
  };

  useEffect(() => {
    dispatch(reset());
    if (!isNew) {
      dispatch(getEntity(id));
    }
    dispatch(getSocieteCommericales({}));
    dispatch(getReductions({}));
  }, [id, isNew]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = async values => {
    const entity = {
      ...articleEntity,
      ...values
    };

    if (isNew) {
      const result = await dispatch(createEntity(entity));
      const newArticle = result.payload["data"];
      if (newArticle) {
        const tarifEntity = {
          dateDebut: new Date(),
          reductions: reductionList.find(r => r.societeCommercial && r.pourcentage === selectedTVA),
          articles: newArticle
        };
        dispatch(createTarifEntity(tarifEntity));
      }
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
        ...articleEntity,
        societeCommerciale: articleEntity?.societeCommerciale?.id,
      };

  const handleSocieteCommercialeChange = e => {
    const selectedId = e.target.value;
    const selectedEntity = societeCommercialeList.find(it => it.id.toString() === selectedId);
    setSelectedSocieteCommerciale(selectedEntity);
    if (selectedEntity) {
      const reduction = reductionList.find(r => r.societeCommercial && r.societeCommercial.id === selectedEntity.id);
      setSelectedTVA(reduction ? reduction.pourcentage : null);
    } else {
      setSelectedTVA(null);
    }
  };

  return (
    <div className="container update-form">
      <Sidebar />
      <Row className="justify-content-center">
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h2" className="text-left text-black custom-title-bar py-2">
                <Translate contentKey="faeApp.article.home.createOrEditLabel">Create or edit an Article</Translate>
              </CardTitle>
              <br />
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  {!isNew && (
                    <ValidatedField
                      name="id"
                      required
                      readOnly
                      id="article-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }}
                      className="custom-input-field"
                    />
                  )}
                  <ValidatedField label={translate('faeApp.article.modele')} id="article-modele" name="modele" data-cy="modele" type="text" className="custom-input-field" />
                  <ValidatedField
                    label={translate('faeApp.article.largeurPneus')}
                    id="article-largeurPneus"
                    name="largeurPneus"
                    data-cy="largeurPneus"
                    type="text"
                    className="custom-input-field"
                  />
                  <ValidatedField
                    label={translate('faeApp.article.hauteurPneus')}
                    id="article-hauteurPneus"
                    name="hauteurPneus"
                    data-cy="hauteurPneus"
                    type="text"
                    className="custom-input-field"
                  />
                  <ValidatedField
                    label={translate('faeApp.article.typePneus')}
                    id="article-typePneus"
                    name="typePneus"
                    data-cy="typePneus"
                    type="text"
                    className="custom-input-field"
                  />
                  <ValidatedField
                    label={translate('faeApp.article.diametre')}
                    id="article-diametre"
                    name="diametre"
                    data-cy="diametre"
                    type="text"
                    className="custom-input-field"
                  />
                  <ValidatedBlobField
                    label={translate('faeApp.article.photo')}
                    id="article-photo"
                    name="photo"
                    data-cy="photo"
                    isImage
                    accept="image/*"
                    className="custom-input-field"
                  />
                  <ValidatedField
                    label={translate('faeApp.article.dateCreation')}
                    id="article-dateCreation"
                    name="dateCreation"
                    data-cy="dateCreation"
                    type="date"
                    value={new Date().toISOString().split('T')[0]}
                    disabled
                    className="custom-input-field"
                  />
                  <ValidatedField
                    id="societe-commerciale"
                    name="societeCommerciale"
                    data-cy="societeCommerciale"
                    label="Choisir la societe commerciale"
                    type="select"
                    onChange={handleSocieteCommercialeChange}
                    className="custom-input-field"
                  >
                    <option value="" key="0" />
                    {societeCommercialeList &&
                      societeCommercialeList.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.libelle}
                        </option>
                      ))}
                  </ValidatedField>
                  {selectedSocieteCommerciale && (
                    <>
                      {selectedTVA !== null ? (
                        <ValidatedField
                          name="selectedTVA"
                          label="TVA APPLIQUE"
                          type="text"
                          value={selectedTVA}
                          readOnly
                          disabled
                          className="custom-input-field"
                        />
                      ) : (
                        <p>Pas de TVA Applique</p>
                      )}
                    </>
                  )}
                  <div className="text-center">
                    <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/article" replace className="custom-back-button m-2">
                      <FontAwesomeIcon icon="arrow-left" />
                      &nbsp;
                      <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.back">Back</Translate>
                      </span>
                    </Button>
                    <Button id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating} className="custom-save-button m-2">
                      <FontAwesomeIcon icon="save" />
                      &nbsp;
                      <Translate contentKey="entity.action.save">Save</Translate>
                    </Button>
                  </div>
                </ValidatedForm>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ArticleUpdate;
