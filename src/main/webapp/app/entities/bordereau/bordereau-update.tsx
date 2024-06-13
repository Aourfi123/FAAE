import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Table, Input } from 'reactstrap';
import { openFile, byteSize, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IBordereau } from 'app/shared/model/bordereau.model';
import { getEntity, updateEntity, createEntity, reset } from './bordereau.reducer';
import { getEntities as getArticles } from 'app/entities/article/article.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity as createEntityClientBordereau } from 'app/entities/client-bordereau/client-bordereau.reducer';
import { createEntity as createEntityLigneBordereau } from 'app/entities/lignes-bordereau/lignes-bordereau.reducer';
import { IClient } from 'app/shared/model/client.model';
import { IArticle } from 'app/shared/model/article.model';

import './styles.css';

const ProgressBar = ({ currentStep }) => (
  <div className="progress-container">
    <div className="step-label">Step 1</div>
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: currentStep >= 1 ? '100%' : '0' }}></div>
    </div>
    <div className="step-label">Step 2</div>
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: currentStep >= 2 ? '100%' : '0' }}></div>
    </div>
  </div>
);

const BordereauUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const bordereauEntity = useAppSelector(state => state.bordereau.entity);
  const loading = useAppSelector(state => state.bordereau.loading);
  const updating = useAppSelector(state => state.bordereau.updating);
  const updateSuccess = useAppSelector(state => state.bordereau.updateSuccess);
  const articleList = useAppSelector(state => state.article.entities);
  const clientList = useAppSelector(state => state.client.entities);
  const [articles, setArticles] = useState<IArticle>();
  const [clients, setClients] = useState<IClient>();
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [montantTotal, setMontantTotal] = useState(0);

  const [formData, setFormData] = useState({
    reference: '',
    etat: 'En attente',
    dateCreation: new Date().toISOString().split('T')[0],
    clients: ''
  });

  const handleClose = () => {
    navigate('/bordereau' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
      dispatch(getArticles({}));
      dispatch(getClients({}));
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    calculateMontantTotal();
  }, [selectedArticles]);

  const handleFieldChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArticlesChange = e => {
    const selectedId = e.target.value;
    const selectedEntity = articleList.find(entity => entity.id.toString() === selectedId);
    setArticles(selectedEntity);
  };

  const handleClientsChange = e => {
    const selectedId = e.target.value;
    const selectedEntity = clientList.find(entity => entity.id.toString() === selectedId);
    setClients(selectedEntity);
  };

  const addArticle = () => {
    if (articles && !selectedArticles.find(item => item.article.id === articles.id)) {
      setSelectedArticles([...selectedArticles, { article: articles, quantite: 1 }]);
    }
  };

  const handleQuantiteChange = (index, quantite) => {
    const newSelectedArticles = [...selectedArticles];
    newSelectedArticles[index].quantite = quantite;
    setSelectedArticles(newSelectedArticles);
  };

  const calculateMontantTotal = () => {
    let total = 0;
    selectedArticles.forEach(item => {
      total += item.article.diametre * item.quantite;
    });
    setMontantTotal(total);
  };

  const saveEntity = async values => {
    const entity = {
      ...bordereauEntity,
      ...formData,
      ...values,
    };

    if (isNew) {
      const result = await dispatch(createEntity(entity));
      const newBordereauId = result.payload["data"];

      for (const item of selectedArticles) {
        const ligneBordereauEntity = {
          bordereaus: newBordereauId,
          articles: articleList.find(a => a.id == item.article.id),
          dateDebut: new Date(),
          quantite: item.quantite,
        };
        await dispatch(createEntityLigneBordereau(ligneBordereauEntity));
      }

      const clientBordereauEntity = {
        bordereaus: newBordereauId,
        dateDebut: new Date(),
        clients: clients
      };
      console.log("liste client :"+clientList)
      console.log("form data : "+ formData.clients)
      await dispatch(createEntityClientBordereau(clientBordereauEntity));
    } else {
      await dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? { ...formData }
      : {
          ...bordereauEntity,
        };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="centralized-container">
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="faeApp.bordereau.home.createOrEditLabel" data-cy="BordereauCreateUpdateHeading">
            <Translate contentKey="faeApp.bordereau.home.createOrEditLabel">Create or edit a Bordereau</Translate>
          </h2>
        </Col>
      </Row>
      <ProgressBar currentStep={currentStep} />
      <Row className="justify-content-center" style={{ marginLeft: "110px" }}>
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {currentStep === 1 && (
                <div>
                  {!isNew ? (
                    <ValidatedField
                      name="id"
                      required
                      readOnly
                      id="bordereau-id"
                      label={translate('global.field.id')}
                      validate={{ required: true }}
                    />
                  ) : null}
                  <ValidatedField
                    label={translate('faeApp.bordereau.reference')}
                    id="bordereau-reference"
                    name="reference"
                    data-cy="reference"
                    type="text"
                    onChange={handleFieldChange}
                    value={formData.reference}
                  />
                  <ValidatedField
                    label={translate('faeApp.bordereau.etat')}
                    id="bordereau-etat"
                    name="etat"
                    data-cy="etat"
                    type="text"
                    disabled
                    value={formData.etat}
                  />
                  <ValidatedField
                    label={translate('faeApp.bordereau.dateCreation')}
                    id="bordereau-dateCreation"
                    name="dateCreation"
                    data-cy="dateCreation"
                    type="date"
                    value={formData.dateCreation}
                    disabled
                  />
                  <Button onClick={handleNextStep} color="primary">
                    Next
                  </Button>
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <ValidatedField
                    id="reduction-article"
                    name="articles"
                    data-cy="articles"
                    label="Article spécifique"
                    type="select"
                    onChange={handleArticlesChange}
                  >
                    <option value="" key="0" />
                    {articleList
                      ? articleList.map(article => (
                          <option value={article.id} key={article.id}>
                            {article.modele}
                          </option>
                        ))
                      : null}
                  </ValidatedField>
                  <ValidatedField
                    id="client-bordereau-clients"
                    name="clients"
                    data-cy="clients"
                    label={translate('faeApp.clientBordereau.clients')}
                    type="select"
                    onChange={handleClientsChange}
                  >
                    <option value="" key="0" />
                    {clientList
                      ? clientList.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </ValidatedField>
                  <ValidatedField
                    label={translate('faeApp.bordereau.montantTotal')}
                    id="bordereau-montantTotal"
                    name="montantTotal"
                    data-cy="montantTotal"
                    type="text"
                    value={montantTotal}
                    disabled
                  />
                  <Button onClick={addArticle} color="secondary" id="add-article" data-cy="addArticleButton">
                    Add Article
                  </Button>

                  <Button onClick={handlePrevStep} color="secondary">
                    Previous
                  </Button>
                  &nbsp;
                  <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                    <FontAwesomeIcon icon="save" />
                    &nbsp;
                    <Translate contentKey="entity.action.save">Save</Translate>
                  </Button>
                </div>
              )}
            </ValidatedForm>
          )}
        </Col>
        <Col md="4">
          {currentStep === 2 && (
            <div>
              <h3>Selected Articles</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Article</th>
                      <th>Quantité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedArticles.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.article.photo ? (
                            <div>
                              {item.article.photoContentType ? (
                                <a onClick={openFile(item.article.photoContentType, item.article.photo)}>
                                  <img src={`data:${item.article.photoContentType};base64,${item.article.photo}`} style={{ maxHeight: '30px' }} />
                                  &nbsp;
                                </a>
                              ) : null}
                            </div>
                          ) : null}
                        </td>
                        <td>{item.article.modele}</td>
                        <td>
                          <Input
                            type="number"
                            value={item.quantite}
                            onChange={e => handleQuantiteChange(index, parseInt(e.target.value, 10))}
                            min="1"
                            style={{ width: '80px' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default BordereauUpdate;
