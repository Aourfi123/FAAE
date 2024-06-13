import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getArticles } from 'app/entities/article/article.reducer';
import { ISocieteCommerciale } from 'app/shared/model/societe-commerciale.model';
import { getEntities as getSocieteCommerciales } from 'app/entities/societe-commerciale/societe-commerciale.reducer';
import { IReduction } from 'app/shared/model/reduction.model';
import { getEntity, updateEntity, createEntity, reset, getEntities } from './reduction.reducer';
import { IArticle } from 'app/shared/model/article.model';
import { getEntities as getTarifs } from 'app/entities/tarif/tarif.reducer';
import { createEntity as createTarifEntity } from 'app/entities/tarif/tarif.reducer';
import { getEntities as getLignesBordereaus } from 'app/entities/lignes-bordereau/lignes-bordereau.reducer';

export const ReductionUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const location = useLocation();
  const type = new URLSearchParams(location.search).get('type') || 'remise';

  const reductionList = useAppSelector(state => state.reduction.entities);
  const societeCommerciales = useAppSelector(state => state.societeCommerciale.entities);
  const reductionEntity = useAppSelector(state => state.reduction.entity);
  const loading = useAppSelector(state => state.reduction.loading);
  const updating = useAppSelector(state => state.reduction.updating);
  const updateSuccess = useAppSelector(state => state.reduction.updateSuccess);
  const articleList = useAppSelector(state => state.article.entities);
  const tarifList = useAppSelector(state => state.tarif.entities);
  const lignesBordereauList = useAppSelector(state => state.lignesBordereau.entities);

  const [selectedCondition, setSelectedCondition] = useState('');
  const [selected, setSelected] = useState<ISocieteCommerciale>();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [articlesPlusVendus, setArticlesPlusVendus] = useState<IArticle[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [articlesPromotionnels, setArticlesPromotionnels] = useState<IArticle[]>([]);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);

  const conditions = [
    { value: 'TOTAL_OVER_1000', label: 'Remise pour les articles les plus vendus' },
    { value: 'SPECIFIC_ARTICLE', label: 'Remise pour un article spécifique' },
    { value: 'PROMOTIONAL_PERIOD', label: 'Remise pendant période promotionnelle' },
  ];

  const handleClose = () => {
    navigate('/reduction' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
      dispatch(getArticles({}));
      dispatch(getEntities({}));
      dispatch(getTarifs({}));
      dispatch(getLignesBordereaus({}))
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getSocieteCommerciales({}));
  }, [isNew]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleSocieteCommercialeChange = e => {
    const selectedId = e.target.value;
    const selectedEntity = societeCommerciales.find(entity => entity.id.toString() === selectedId);
    setSelected(selectedEntity);

    setArticles([]);
  };

  const handleConditionChange = e => {
    const selectedCondition = e.target.value;
    setSelectedCondition(selectedCondition);
    if (selectedCondition === 'PROMOTIONAL_PERIOD' && selected) {
       const selectedReductions = reductionList.filter(reduction => reduction.typeOperation === 'taxe' && reduction.societeCommercial.id === selected.id);
       if (selectedReductions.length > 0) {
         const selectedTarifs = tarifList.filter(tarif => selectedReductions.some(sr => tarif.reductions && sr && sr.id === tarif.reductions.id));
         const selectedArticles = articleList.filter(article => selectedTarifs.some(tarif => tarif.articles && article && article.id === tarif.articles.id));
         setArticlesPromotionnels(selectedArticles);
       } else {
        setArticlesPromotionnels([]);
       }
       setPromotionModalOpen(true);
    }
    if (selectedCondition === 'TOTAL_OVER_1000' && selected) {
      // Logique pour TOTAL_OVER_1000
      const selectedReductions = reductionList.filter(reduction => reduction.typeOperation === 'taxe' && reduction.societeCommercial.id === selected.id);
      if (selectedReductions.length > 0) {
        const selectedTarifs = tarifList.filter(tarif => selectedReductions.some(sr => tarif.reductions && sr && sr.id === tarif.reductions.id));
        const selectedArticles = articleList.filter(article => selectedTarifs.some(tarif => tarif.articles && article && article.id === tarif.articles.id));
        const selectedArticlesPlusVendu = selectedArticles.filter(article => lignesBordereauList.some(bordereau => bordereau.articles && article && bordereau && bordereau.articles && article.id === bordereau.articles.id));
        setArticlesPlusVendus(selectedArticlesPlusVendu);
        console.log(lignesBordereauList)
        console.log(selectedArticlesPlusVendu)
      } else {
        setArticlesPlusVendus([]);
      }
      setModalOpen(true);
    }

    if (selectedCondition === 'SPECIFIC_ARTICLE' && selected) {
      // Logique pour SPECIFIC_ARTICLE
      const selectedReductions = reductionList.filter(reduction => reduction.typeOperation === 'taxe' && reduction.societeCommercial.id === selected.id);
      if (selectedReductions.length > 0) {
        const selectedTarifs = tarifList.filter(tarif => selectedReductions.some(sr => tarif.reductions && sr && sr.id === tarif.reductions.id));
        const selectedArticles = articleList.filter(article => selectedTarifs.some(tarif => tarif.articles && article && article.id === tarif.articles.id));
        setArticles(selectedArticles);
      } else {
        setArticles([]);
      }
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const togglePromotionModal = () => {
    setPromotionModalOpen(!promotionModalOpen);
  };

  const saveEntity = async values => {
    const entity = {
      ...reductionEntity,
      ...values,
      societeCommercial: societeCommerciales.find(it => it.id.toString() === values.societeCommercial.toString()),
    };

    let newReduction;
    if (isNew) {
      const result = await dispatch(createEntity(entity));
      newReduction = result.payload["data"];
    } else {
      const result = await dispatch(updateEntity(entity));
      newReduction = result.payload["data"];
    }

    if (newReduction) {
      let selectedArticlesForTarifs = [];

      if (selectedCondition === 'TOTAL_OVER_1000') {
        selectedArticlesForTarifs = articlesPlusVendus;
      } else if (selectedCondition === 'PROMOTIONAL_PERIOD') {
        selectedArticlesForTarifs = articlesPromotionnels;
      } else if (selectedCondition === 'SPECIFIC_ARTICLE') {
        const articleId = values.articles;
        const selectedArticle = articles.find(article => article.id.toString() === articleId.toString());
        if (selectedArticle) {
          selectedArticlesForTarifs = [selectedArticle];
        }
      }

      for (const article of selectedArticlesForTarifs) {
        const tarifEntity = {
          dateDebut: new Date(),
          reductions: newReduction,
          articles: article,
        };
        await dispatch(createTarifEntity(tarifEntity));
      }
    }
  };
  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...reductionEntity,
          societeCommercial: reductionEntity?.societeCommercial?.id,
        };

  return (
    <div>
      {type === 'remise' ? (
        <>
          <Row className="justify-content-center">
            <Col md="8">
              <h2 id="faeApp.reduction.home.createOrEditLabel" data-cy="ReductionCreateUpdateHeading">
                Create or edit a Remise
              </h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="8">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  {!isNew ? (
                    <ValidatedField
                      name="id"
                      required
                      readOnly
                      id="reduction-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }}
                    />
                  ) : null}
                  <ValidatedField
                    label={translate('faeApp.reduction.description')}
                    id="reduction-description"
                    name="description"
                    data-cy="description"
                    type="text"
                  />
                  <ValidatedField
                    label={translate('faeApp.reduction.typeOperation')}
                    id="reduction-typeOperation"
                    name="typeOperation"
                    data-cy="typeOperation"
                    type="text"
                    value="remise"  // Valeur par défaut
                    disabled
                  />
                  <ValidatedField
                    label={translate('faeApp.reduction.pourcentage')}
                    id="reduction-pourcentage"
                    name="pourcentage"
                    data-cy="pourcentage"
                    type="text"
                  />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateDebut')}
                    id="reduction-dateDebut"
                    name="dateDebut"
                    data-cy="dateDebut"
                    type="date"
                  />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateFin')}
                    id="reduction-dateFin"
                    name="dateFin"
                    data-cy="dateFin"
                    type="date"
                  />
                  <ValidatedField
                    id="reduction-societeCommercial"
                    name="societeCommercial"
                    data-cy="societeCommercial"
                    label={translate('faeApp.reduction.societeCommercial')}
                    type="select"
                    onChange={handleSocieteCommercialeChange}
                  >
                    <option value="" key="0" />
                    {societeCommerciales
                      ? societeCommerciales.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </ValidatedField>
                  <ValidatedField
                    id="reduction-condition"
                    name="condition"
                    data-cy="condition"
                    label="Condition de Remise"
                    type="select"
                    onChange={handleConditionChange}
                  >
                    <option value="" key="0" />
                    {conditions.map(condition => (
                      <option value={condition.value} key={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </ValidatedField>
                  {selectedCondition === 'SPECIFIC_ARTICLE' && (
                    <ValidatedField
                      id="reduction-article"
                      name="articles"
                      data-cy="articles"
                      label="Article spécifique"
                      type="select"
                    >
                      <option value="" key="0" />
                      {articles
                        ? articles.map(article => (
                            <option value={article.id} key={article.id}>
                              {article.id}
                            </option>
                          ))
                        : null}
                    </ValidatedField>
                  )}
                  <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/reduction" replace color="info">
                    <FontAwesomeIcon icon="arrow-left" />
                    &nbsp;
                    <span className="d-none d-md-inline">
                      <Translate contentKey="entity.action.back">Back</Translate>
                    </span>
                  </Button>
                  &nbsp;
                  <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    <Translate contentKey="entity.action.save">Save</Translate>
                  </Button>
                </ValidatedForm>
              )}
            </Col>
          </Row>
          <Modal isOpen={modalOpen} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Articles les plus vendus</ModalHeader>
            <ModalBody>
              <ul>
                {articlesPlusVendus.map(article => (
                  <li key={article.id}>{article.modele}</li>
                ))}
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={promotionModalOpen} toggle={togglePromotionModal}>
            <ModalHeader toggle={togglePromotionModal}>Articles Promotionnels</ModalHeader>
            <ModalBody>
              <ul>
                {articlesPromotionnels.map(article => (
                  <li key={article.id}>{article.modele}</li>
                ))}
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={togglePromotionModal}>
                Fermer
              </Button>
            </ModalFooter>
          </Modal>

        </>
      ) : (
        <><Row className="justify-content-center">
          <Col md="8">
            <h2 id="faeApp.reduction.home.createOrEditLabel" data-cy="ReductionCreateUpdateHeading">

Create or edit a Taxe            </h2>
          </Col>
        </Row><Row className="justify-content-center">
            <Col md="8">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                  {!isNew ? (
                    <ValidatedField
                      name="id"
                      required
                      readOnly
                      id="reduction-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }} />
                  ) : null}
                  <ValidatedField
                    label={translate('faeApp.reduction.description')}
                    id="reduction-description"
                    name="description"
                    data-cy="description"
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.typeOperation')}
                    id="reduction-typeOperation"
                    name="typeOperation"
                    data-cy="typeOperation"
                    value="taxe"  // Valeur par défaut
                    disabled
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.pourcentage')}
                    id="reduction-pourcentage"
                    name="pourcentage"
                    data-cy="pourcentage"
                    type="text" />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateDebut')}
                    id="reduction-dateDebut"
                    name="dateDebut"
                    data-cy="dateDebut"
                    type="date"
                     />
                  <ValidatedField
                    label={translate('faeApp.reduction.dateFin')}
                    id="reduction-dateFin"
                    name="dateFin"
                    data-cy="dateFin"
                    type="date" />
                  <ValidatedField
                    id="reduction-societeCommercial"
                    name="societeCommercial"
                    data-cy="societeCommercial"
                    label={translate('faeApp.reduction.societeCommercial')}
                    type="select"
                  >
                    <option value="" key="0" />
                    {societeCommerciales
                      ? societeCommerciales.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                      : null}
                  </ValidatedField>
                  <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/reduction" replace color="info">
                    <FontAwesomeIcon icon="arrow-left" />
                    &nbsp;
                    <span className="d-none d-md-inline">
                      <Translate contentKey="entity.action.back">Back</Translate>
                    </span>
                  </Button>
                  &nbsp;
                  <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    <Translate contentKey="entity.action.save">Save</Translate>
                  </Button>
                </ValidatedForm>
              )}
            </Col>
          </Row></>
      )}
    </div>
  );
};

export default ReductionUpdate;
