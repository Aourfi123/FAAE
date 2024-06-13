import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, Table, Input } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, ValidatedBlobField, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getArticles } from 'app/entities/article/article.reducer';
import { IDemandeRembourssement } from 'app/shared/model/demande-rembourssement.model';
import { getEntity, updateEntity, createEntity, reset } from './demande-rembourssement.reducer';
import { IArticle } from 'app/shared/model/article.model';
import { updateEntity as updateDetailsDemande, createEntity as createDetailsDemande , getEntities as getDetailsDemande} from 'app/entities/details-demande/details-demande.reducer';
import { getEntities as getLignesDocument } from 'app/entities/lignes-document/lignes-document.reducer';
import { getEntities as getLignesBordereaus } from 'app/entities/lignes-bordereau/lignes-bordereau.reducer';

interface DemandeUpdateProps {
  documentId: string | number;
}

export const DemandeRembourssementUpdate: React.FC<DemandeUpdateProps> = ({ documentId }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;
  const detailsDemandeList = useAppSelector(state => state.detailsDemande.entities);

  const articles = useAppSelector(state => state.article.entities);
  const demandeRembourssementEntity = useAppSelector(state => state.demandeRembourssement.entity);
  const loading = useAppSelector(state => state.demandeRembourssement.loading);
  const updating = useAppSelector(state => state.demandeRembourssement.updating);
  const updateSuccess = useAppSelector(state => state.demandeRembourssement.updateSuccess);
  const [articlesSelected, setArticlesSelected] = useState<{ [bordereauId: number]: { article: IArticle }[] }>({});
  const lignesDocumentList = useAppSelector(state => state.lignesDocument.entities);
  const lignesBordereauList = useAppSelector(state => state.lignesBordereau.entities);
  const [selectedBordereaux, setSelectedBordereaux] = useState<number | null>(null);
  const [bordereauArticles, setBordereauArticles] = useState<{ [bordereauId: number]: IArticle[] }>({});

  const filteredLignesDocument = lignesDocumentList.filter(
    ligne => ligne.documents && ligne.documents.id.toString() === documentId.toString()
  );

  const filteredBordereaux = lignesBordereauList.filter(bordereau =>
    filteredLignesDocument.some(ligne => ligne.bordereaus && bordereau.bordereaus && ligne.bordereaus.id === bordereau.bordereaus.id)
  );

  const uniqueBordereaux = [];
  const codesSeen = {};
  for (const bordereau of filteredBordereaux) {
    if (bordereau.bordereaus?.id && !codesSeen[bordereau.bordereaus.id]) {
      uniqueBordereaux.push(bordereau);
      codesSeen[bordereau.bordereaus.id] = true;
    }
  }

  const handleClose = () => {
    navigate('/document' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
    dispatch(getArticles({}));
    dispatch(getLignesBordereaus({}));
    dispatch(getLignesDocument({}));
    dispatch(getDetailsDemande({}))
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleBordereauChange = e => {
    const selectedId = Number(e.target.value);
    setSelectedBordereaux(selectedId);

    const updatedBordereauArticles = { ...bordereauArticles };
    updatedBordereauArticles[selectedId] = lignesBordereauList
      .filter(ligneBordereau => ligneBordereau.bordereaus && ligneBordereau.bordereaus.id === selectedId)
      .map(ligneBordereau => ligneBordereau.articles);
    setBordereauArticles(updatedBordereauArticles);
  };

  const handleArticleSelect = (article, bordereauId) => {
    setArticlesSelected(prevState => {
      const selectedArticlesForBordereau = prevState[bordereauId] || [];
      const existing = selectedArticlesForBordereau.find(a => a.article.id === article.id);
      if (existing) {
        return {
          ...prevState,
          [bordereauId]: selectedArticlesForBordereau.filter(a => a.article.id !== article.id)
        };
      } else {
        return {
          ...prevState,
          [bordereauId]: [...selectedArticlesForBordereau, { article }]
        };
      }
    });
  };

  const saveEntity = async values => {
    const entity = {
      ...demandeRembourssementEntity,
      ...values,
      dateCreation: new Date(),
      etat: "En attente",
    };
      const result = await dispatch(createEntity(entity));
      const newDemandeId = result.payload["data"];
console.log(newDemandeId);
      for (const bordereauId in articlesSelected) {
        for (const { article } of articlesSelected[bordereauId]) {
          const detailsDemandeEntity = {
            demandeRemboursements: newDemandeId,
            bordereaus: bordereauId,
            articles: article,
            quantite: values.quantite,
            etat: "En attente"
          };
          await dispatch(createDetailsDemande(detailsDemandeEntity));
        }
      }
    };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...demandeRembourssementEntity,
        };

  return (
    <div>
      <Row className="justify-content-center">

      </Row>
      <Row className="justify-content-center">
        <Col md="10">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="demande-rembourssement-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('faeApp.demandeRembourssement.raison')}
                id="demande-rembourssement-raison"
                name="raison"
                data-cy="raison"
                type="text"
              />
              <ValidatedBlobField
                label={translate('faeApp.demandeRembourssement.pieceJointe')}
                id="demande-rembourssement-pieceJointe"
                name="pieceJointe"
                data-cy="pieceJointe"
                isImage
                accept="image/*"
              />
              <ValidatedField
                label={translate('faeApp.demandeRembourssement.etat')}
                id="demande-rembourssement-etat"
                name="etat"
                data-cy="etat"
                type="text"
                value="En attente"
                disabled
              />
              <ValidatedField
                label={translate('faeApp.detailsDemande.quantite')}
                id="details-demande-quantite"
                name="quantite"
                data-cy="quantite"
                type="text"
              />
              <ValidatedField
                label={translate('faeApp.demandeRembourssement.dateCreation')}
                id="demandeRembourssement-dateCreation"
                name="dateCreation"
                data-cy="dateCreation"
                type="date"
                value={new Date().toISOString().split('T')[0]}
                disabled
/>
              <ValidatedField
                id="bordereau-select"
                name="bordereau"
                data-cy="bordereau"
                label="Bordereau"
                type="select"
                onChange={handleBordereauChange}
              >
                <option value="" key="0" />
                {uniqueBordereaux.map(bordereau => (
                  bordereau.bordereaus &&
                  <option value={bordereau.bordereaus.id} key={bordereau.bordereaus.id}>
                    {bordereau.bordereaus.id}
                  </option>
                ))}              </ValidatedField>

                  <br />
      {selectedBordereaux && (
        <Row>
          <Col md="12">
            <Table responsive>
            <thead>
                <tr>
                  <th>Nom de l'Article</th>
                  <th>Sélectionner</th>
                </tr>
              </thead>
              <tbody>
              {bordereauArticles[selectedBordereaux] && bordereauArticles[selectedBordereaux].map(article => {
            // Vérifier si l'article est déjà dans les détails de demande
            const articleAlreadySelected = detailsDemandeList.some(detail => detail.articles?.id === article.id);
            // Afficher l'article uniquement s'il n'est pas déjà sélectionné
            if (!articleAlreadySelected) {
              return (
                <tr key={article.id}>
                  <td>{article.modele}</td>
                  <td>
                    <Input
                      type="checkbox"
                      value={article.id}
                      checked={articlesSelected[selectedBordereaux]?.some(a => a.article.id === article.id)}
                      onChange={() => handleArticleSelect(article, selectedBordereaux)}
                    />
                  </td>
                </tr>
              );
            } else {
              return null; // Ne rien afficher si l'article est déjà sélectionné
            }
          })}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/demande-rembourssement" replace color="info">
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

    </div>
  );
};

export default DemandeRembourssementUpdate;
