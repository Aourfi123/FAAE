import  { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'; // Ajoutez Modal depuis 'reactstrap'
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import {  Row, Col, FormText } from 'reactstrap';
import { isNumber, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import {PaiementUpdate} from 'app/entities/paiement/paiement-update'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getClientBordereau } from 'app/entities/client-bordereau/client-bordereau.reducer';
import {  useParams } from 'react-router-dom';
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Invoice.css';
import { width, height } from '@fortawesome/free-solid-svg-icons/faCogs';
import { IDocument } from 'app/shared/model/document.model';
import { getEntities } from './document.reducer';
import { IClient } from 'app/shared/model/client.model';
import { IClientBordereau } from 'app/shared/model/client-bordereau.model';
import { getEntity, updateEntity, createEntity, reset } from './document.reducer';
import { getEntities as getBordereaus } from 'app/entities/bordereau/bordereau.reducer';
import { getEntities as getligneDocument , updateEntity as updateLigneDocument, createEntity as createLigneDocument } from 'app/entities/lignes-document/lignes-document.reducer';
import { getEntities as getLigneBordereaus } from 'app/entities/lignes-bordereau/lignes-bordereau.reducer';

import {DemandeRembourssementUpdate} from 'app/entities/demande-rembourssement/demande-rembourssement-update'

import { IBordereau } from 'app/shared/model/bordereau.model';

import { IAvoir } from 'app/shared/model/avoir.model';
import { getEntities as getAvoirs } from 'app/entities/avoir/avoir.reducer';
import { IFacture } from 'app/shared/model/facture.model';
import { getEntities as getFactures } from 'app/entities/facture/facture.reducer';
import { getEntities as getfactures , createEntity as createFacture} from 'app/entities/facture/facture.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';

export const Document = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );
  const clientList = useAppSelector(state => state.client.entities);
  const clientBordereauList = useAppSelector(state => state.clientBordereau.entities);
  const documentList = useAppSelector(state => state.document.entities);
  const loading = useAppSelector(state => state.document.loading);
  const totalItems = useAppSelector(state => state.document.totalItems);
  const [selectedClientData,setSelectedClientData]=useState<IBordereau[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedBordereaux, setSelectedBordereaux] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const lignesDocumentList = useAppSelector(state => state.lignesDocument.entities);
  const [totalMontant, setTotalMontant] = useState(0);
  const [clients, setClients] = useState<IClient[]>([]);
  const user = useAppSelector(state => state.authentication.account);
  const userId = user ? user.id : null;
  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  const handleCheckboxChange = (e, bordereauId) => {
    if (e.target.checked) {
      setSelectedBordereaux(prevSelected => {
        if (!prevSelected.includes(bordereauId)) {
          return [...prevSelected, bordereauId];
        } else {
          return prevSelected;
        }
      });
    } else {
      setSelectedBordereaux(prevSelected => prevSelected.filter(id => id !== bordereauId));
    }
    console.log(selectedBordereaux)
  };
  useEffect(() => {
    const total = selectedBordereaux.reduce((sum, bordereauId) => {
      const bordereau = clientBordereauList
        .flatMap(client => client.bordereaus)
        .find(bord => bord && bord.id === bordereauId);
      return sum + (bordereau ? bordereau.montantTotal : 0);
    }, 0);
    setTotalMontant(total);
  }, [selectedBordereaux, clientBordereauList]);


  const toggleModal = () => setShowModal(!showModal);



  const getAllEntities = () => {
    dispatch(getClients({}))
    dispatch(getligneDocument({}))
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      })
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };


  useEffect(() => {
    sortEntities();
    dispatch(getClientBordereau({}));
    dispatch(getLigneBordereaus({}))
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);
// propre document

const clientsfunction = async () =>{
  const result = await dispatch(getClients({}));
  const newBordereauId = result.payload["data"];
  console.log(newBordereauId)
  newBordereauId.forEach(client => {
    setClients(prevClients => [...prevClients, client]);
  });}

//propre document fin
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const handleClientSelect = event => {
    const clientId = parseInt(event.target.value, 10);
    setSelectedClient(clientId);
    setSelectedBordereaux([]); // Réinitialiser selectedBordereaux à un tableau vide
    console.log('Selected client ID:', clientId); // Affiche l'ID du client sélectionné
    if (selectedClient !== null) {
      const selectedClientData = clientBordereauList.find(client =>  client.clients && client.clients.id === selectedClient).bordereaus;
      setSelectedClientData(selectedClientData);
      console.log('Selected client data:', selectedClientData); // Affiche les données du client sélectionné
    }
  };
  const handleSendSelectedBordereaux = () => {
    // Vous pouvez envoyer les bordereaux sélectionnés à la base de données ici
    console.log("Bordereaux sélectionnés :", selectedBordereaux);
    // Réinitialiser la sélection après l'envoi
    setSelectedBordereaux([]);
  };

  // Créez une fonction pour filtrer les clients uniques
const getUniqueClients = () => {
  const uniqueClientIds = [];
  return clientBordereauList.filter(client => {
    if (client.clients && !uniqueClientIds.includes(client.clients.id)) {
      uniqueClientIds.push(client.clients.id);
      return true;
    }
    return false;
  });
};

// Utilisez la fonction pour obtenir une liste de clients uniques
const uniqueClients = getUniqueClients();
  useEffect(() => {
    // Update selected client data whenever selectedClient changes

  }, [selectedClient, clientBordereauList]);
  //ajout document

  const bordereaus = useAppSelector(state => state.bordereau.entities);

  const avoirs = useAppSelector(state => state.avoir.entities);
  const factures = useAppSelector(state => state.facture.entities);
  const documentEntity = useAppSelector(state => state.document.entity);
  const updating = useAppSelector(state => state.document.updating);
  const updateSuccess = useAppSelector(state => state.document.updateSuccess);
  const [bordereausSelected, setBordereausSelected] = useState<IBordereau[]>([]);
  const factureList = useAppSelector(state => state.facture.entities);
  const isAdmin = user && user.authorities && user.authorities.includes('ROLE_ADMIN');

  const handleClose = () => {
    navigate('/document' + location.search);
  };

  useEffect(() => {
      dispatch(reset());
      dispatch(getBordereaus({}))
      dispatch(getAvoirs({}));
      dispatch(getFactures({}));
      dispatch(getClients({}))
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = async values => {
    const entity = {
      ...documentEntity,
      ...values,
    };
      const result = await dispatch(createEntity(entity));
      const newBordereauId = result.payload["data"];
      const borderauxs = {
        documents: newBordereauId,
        dateDebut: new Date(),
        code: newBordereauId.code,
        etat: "Non payé"
      };
     dispatch(createFacture(borderauxs));
      for (const bord of selectedBordereaux) {
        console.log()
        const borderauxs = {
          documents: newBordereauId,
          bordereaus: bordereaus.find(entity => entity.id === bord),
          dateDebut: new Date(),
        };
       dispatch(createLigneDocument(borderauxs));
       setShowModal(!showModal);
      }
  };



  if (isAdmin) {
    return(
    <div>
      <h2 id="document-heading" data-cy="DocumentHeading">
        <Translate contentKey="faeApp.document.home.title">Documents</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="faeApp.document.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Button className="me-2" color="info" onClick={toggleModal}>
            <FontAwesomeIcon icon="plus" /> Ajouter une facture
          </Button>

        </div>
      </h2>
      <div className="table-responsive">
        {documentList && documentList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="faeApp.document.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('code')}>
                  <Translate contentKey="faeApp.document.code">Code</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('reference')}>
                  <Translate contentKey="faeApp.document.reference">Reference</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('montantTotal')}>
                  <Translate contentKey="faeApp.document.montantTotal">Montant Total</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateCreation')}>
                  <Translate contentKey="faeApp.document.dateCreation">Date Creation</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateModification')}>
                  <Translate contentKey="faeApp.document.dateModification">Date Modification</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {documentList.map((document, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/document/${document.id}`} color="link" size="sm">
                      {document.id}
                    </Button>
                  </td>
                  <td>{document.code}</td>
                  <td>{document.reference}</td>
                  <td>{document.montantTotal}</td>
                  <td>
                    {document.dateCreation ? <TextFormat type="date" value={document.dateCreation} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {document.dateModification ? (
                      <TextFormat type="date" value={document.dateModification} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/document/${document.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/document/${document.id}/edit?page={paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/document/${document.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="faeApp.document.home.notFound">No Documents found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={documentList && documentList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
     <Modal isOpen={showModal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Ajouter une Facture</ModalHeader>
        <ModalBody>
        <div className="mb-3">
          <label htmlFor="clientSelect" className="form-label">Sélectionner un client :</label>
          <select id="clientSelect" className="form-select" onChange={handleClientSelect}>
            <option value="">Sélectionnez un client</option>
            {uniqueClients.map((client, index) => (
              client.clients && (
                <option key={`${client.clients.id}-${client.clients.nom}`} value={client.clients.id}>
        {
          clientList.find(clien => clien.user && clien.id == client.clients.id )&& clientList.find(clien => clien.user && clien.id == client.clients.id).user ?  clientList.find(clien => clien.user && clien.id == client.clients.id).user.firstName : ''
        }        </option>
              )
            ))}
          </select>
        </div>
          <br />
          {selectedClient !== null && clientBordereauList.find(client => client.clients && client.clients.id === selectedClient) && (
      <div className="table-responsive">

          {clientBordereauList.filter(client => client.clients && client.clients.id === selectedClient).length > 0 ? (
          <Table responsive striped bordered>
          <thead className="table-light">
            <tr>
            <th></th>
              <th>ID</th>
              <th>Référence</th>
              <th>État</th>
              <th>Montant Total</th>
              <th>Date de Création</th>
            </tr>
          </thead>
          <tbody>
          {clientBordereauList
        .filter(client => client.clients && client.clients.id === selectedClient)
        .map(bordereau => bordereau.bordereaus && ( !(lignesDocumentList.some(ligne =>  bordereau.bordereaus && ligne.bordereaus && ligne.bordereaus.id === bordereau.bordereaus.id)) && (
            <tr key={bordereau.bordereaus.id}>
              <td>
                <input type="checkbox" onChange={(e) => handleCheckboxChange(e, bordereau.bordereaus.id)} />
              </td>
              <td>{bordereau.bordereaus.id}</td>
              <td>{bordereau.bordereaus.reference}</td>
              <td>{bordereau.bordereaus.etat}</td>
              <td>{bordereau.bordereaus.montantTotal}</td>
              <td>{bordereau.bordereaus.dateCreation}</td>
            </tr>
          )
        ))}

          </tbody>
        </Table>

      ) : (
        <p>Aucun bordereau trouvé pour ce client.</p>
              )}
        </div>

        )}
        {selectedClient && (
          <div className="d-flex align-items-center mb-3" style={{ cursor: 'pointer' }} onClick={toggleAdditionalFields}>
          <span style={{ color: 'lightblue', margin: 'auto' }}>Ajouter d'autres informations   <FontAwesomeIcon icon={showAdditionalFields ? faChevronUp : faChevronDown}></FontAwesomeIcon>
        </span>
        </div>

        )}
        {showAdditionalFields && (
        <div>
        <Row className="">

        </Row>
        <Row className="justify-content-center">
          <Col md="">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ValidatedForm onSubmit={saveEntity}>
                <ValidatedField label={translate('faeApp.document.code')} id="document-code" name="code" data-cy="code" type="text" />
                <ValidatedField
                  label={translate('faeApp.document.reference')}
                  id="document-reference"
                  name="reference"
                  data-cy="reference"
                  type="text"
                />
                <ValidatedField
                  label={translate('faeApp.document.montantTotal')}
                  id="document-montantTotal"
                  name="montantTotal"
                  data-cy="montantTotal"
                  type="text"
                  value={totalMontant}
                  disabled
                />

                <ValidatedField
                  label={translate('faeApp.document.dateCreation')}
                  id="document-dateCreation"
                  name="dateCreation"
                  data-cy="dateCreation"
                  type="date"
                  value={new Date().toISOString().split('T')[0]}
                  disabled
                />

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
        )}

        </ModalBody>
        <ModalFooter>
                  <Button color="secondary" onClick={toggleModal}>Fermer</Button>
                  {/* Bouton de soumission du formulaire d'ajout */}
                </ModalFooter>
              </Modal>

              {/* Reste du contenu de la page */}
              {/* ... */}
            </div>
          )
        }
        else {

          const clientListFiltered = clientList.find(client => client.user && client.user.id == user.id);
const userBordereauIds = clientBordereauList.filter(clientBordereau => clientBordereau.clients && clientListFiltered && clientBordereau.clients.id == clientListFiltered.id);
console.log(userBordereauIds);

const lignedocument = lignesDocumentList.filter(documentbord =>
  userBordereauIds.some(bordereau =>
    bordereau.bordereaus &&
    documentbord.bordereaus &&
    bordereau.bordereaus.id === documentbord.bordereaus.id
  )
);
console.log("Ligne document " + lignedocument);

const userDocuments = [];
for (const document of documentList) {
  for (const lignedocumen of lignedocument) {
    if (
      lignedocumen.documents &&
      document.id === lignedocumen.documents.id
    ) {
      console.log("Hna document : " + document);
      userDocuments.push(document);
      break; // Sort de la boucle interne dès qu'un document correspondant est trouvé
    }
  }
}
console.log("Document list " + factureList);

const [modal, setModal] = useState(false);
const [selectedFacture, setSelectedFacture] = useState(null);
const [selectedDoc, setSelectedDoc] = useState(null);
const [selectDocDR, setSelectDocDR] = useState(null)

const [secondModal, setSecondModal] = useState(false);

const toggle = () => setModal(!modal);
const toggleSecondModal = () => setSecondModal(!secondModal);

const handlePayment = (facture, document) => {
  setSelectedFacture(facture);
  setSelectedDoc(document);
  toggle();
};

const handleOtherAction = (document) => {
  setSelectDocDR(document);
  toggleSecondModal();
};
const [modall, setModall] = useState(false);

  const togglle = () => setModall(!modall);

  const handleDownload = () => {
    const input = document.getElementById('invoice-container');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 200;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const marginLeft = 5; // Ajustez cette valeur selon la marge désirée
        pdf.addImage(imgData, 'PNG', marginLeft, 0, imgWidth, imgHeight);
        pdf.save('facture.pdf');
      });
  };

return (
  <div>
    <h2 id="document-heading" data-cy="DocumentHeading">
      Factures
      <div className="d-flex justify-content-end">
        <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
          <FontAwesomeIcon icon="sync" spin={loading} />{' '}
          <Translate contentKey="faeApp.document.home.refreshListLabel">Refresh List</Translate>
        </Button>
      </div>
    </h2>
    <div className="table-responsive">
      {userDocuments && userDocuments.length > 0 ? (
        <Table responsive>
          <thead>
            <tr>
              <th className="hand" onClick={sort('id')}>
                <Translate contentKey="faeApp.document.id">ID</Translate> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('code')}>
                <Translate contentKey="faeApp.document.code">Code</Translate> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('reference')}>
                <Translate contentKey="faeApp.document.reference">Reference</Translate> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('montantTotal')}>
                <Translate contentKey="faeApp.document.montantTotal">Montant Total</Translate> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('facture')}>
                État
              </th>
              <th className="hand" onClick={sort('dateCreation')}>
                <Translate contentKey="faeApp.document.dateCreation">Date Creation</Translate> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('dateModification')}>
                date de livraison
              </th>
              <th></th>
              <th />
            </tr>
          </thead>
          <tbody>
            {userDocuments.filter(f => f.id && factureList.find(d => d.document && f.id == d.document.id)).map((document, i) => {
              const facture = factureList.find(f => f.document && f.document.id == document.id);
              return (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/document/${document.id}`} color="link" size="sm">
                      {document.id}
                    </Button>
                  </td>
                  <td>{document.code}</td>
                  <td>{document.reference}</td>
                  <td>{document.montantTotal}</td>
                  <td>
                    {facture ? (
                      <div>{facture.etat}</div>
                    ) : (
                      <div>Aucune facture</div>
                    )}
                  </td>
                  <td>
                    {document.dateCreation ? <TextFormat type="date" value={document.dateCreation} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>{document.dateModification ? <TextFormat type="date" value={document.dateModification} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>
                    {facture && facture.etat === "Non payé" && (
                      <Button color="primary" size="sm" data-cy="entityEditButton" onClick={() => handlePayment(facture, document)}>
                        <FontAwesomeIcon icon={faCreditCard} /> <span className="d-none d-md-inline">
                          Payer
                        </span>
                      </Button>
                    )}
                    {facture && facture.etat !== "Non payé" && (
                    <div className="btn-group flex-btn-group-container">
                    <Button color="primary" size="sm" data-cy="entityViewButton" onClick={togglle}><FontAwesomeIcon icon={faCreditCard} /> <span className="d-none d-md-inline">
                          imprimer
                        </span>
                      </Button>

                      <Button color="warning" size="sm" data-cy="entityViewButton" onClick={() => handleOtherAction(document)}>
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">
                          Demande R
                        </span>
                      </Button>
                      </div>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/document/${document.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/document/${document.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/document/${document.id}/delete?page={paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        !loading && (
          <div className="alert alert-warning">
            No document found
          </div>
        )
      )}
    </div>
    {totalItems ? (
      <div className={documentList && documentList.length > 0 ? '' : 'd-none'}>
        <Row className="justify-content-center">
          <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
        </Row>
        <Row className="justify-content-center">
          <JhiPagination
            activePage={paginationState.activePage}
            onSelect={handlePagination}
            maxButtons={5}
            itemsPerPage={paginationState.itemsPerPage}
            totalItems={totalItems}
          />
        </Row>
      </div>
    ) : (
      ''
    )}

    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Procéder au paiement</ModalHeader>
      <ModalBody>
        {selectedFacture && selectedDoc && (
          <PaiementUpdate factureId={selectedFacture.id} documentId={selectedDoc.id} />
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Annuler</Button>
      </ModalFooter>
    </Modal>
    <Modal isOpen={modall} toggle={togglle} size="lg"  >
        <ModalHeader toggle={togglle}>Détails de la facture</ModalHeader>
        <ModalBody>
        <div>
      <div id="invoice-container" className="invoice-container">
        <div className="header">
          <h1>Facture</h1>
          <div className="logo">
            <img src="content/images/logo michelin.jpg" style={{ width:"80px" , height:"80px"}}/>
          </div>
        </div>
        <div className="info">
          <div className="vendor">
            <h2>Vendeur</h2>
            <p>Mon Entreprise</p>
            <p>22, Avenue Voltaire</p>
            <p>13000 Marseille</p>
          </div>
          <div className="client">
            <h2>Client</h2>
            <p>Michel Acheteur</p>
            <p>31, rue de la Forêt</p>
            <p>13100 Aix-en-Provence</p>
          </div>
        </div>
        <div className="details">
          <div className="date">
            <p>Date de facturation: 2.8.2021</p>
          </div>
          <div className="facture-num">
            <p>Numéro de facture: 143</p>
          </div>
          <div className="echeance">
            <p>Échéance: 16.6.2021</p>
          </div>
          <div className="paiement">
            <p>Paiement: 30 jours</p>
          </div>
          <div className="reference">
            <p>Référence: 1436</p>
          </div>
        </div>
        <div className="additional-info">
          <p>Informations additionnelles :</p>
          <p>Service Après Vente : Garantie 1 an.</p>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantité</th>
              <th>Unité</th>
              <th>Prix unitaire HT</th>
              <th>% TVA</th>
              <th>Total TVA</th>
              <th>Total TTC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Main-d'œuvre</td>
              <td>5</td>
              <td>h</td>
              <td>60,00 €</td>
              <td>20 %</td>
              <td>60,00 €</td>
              <td>360,00 €</td>
            </tr>
            <tr>
              <td>Produit</td>
              <td>10</td>
              <td>pcs</td>
              <td>105,00 €</td>
              <td>20 %</td>
              <td>210,00 €</td>
              <td>1 260,00 €</td>
            </tr>
          </tbody>
        </table>

        <div className="totals">
          <p>Total HT: 1 350,00 €</p>
          <p>Total TVA: 270,00 €</p>
          <p>Total TTC: 1 620,00 €</p>
        </div>

      </div>
    </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleDownload}>Télécharger</Button>
          <Button color="secondary" onClick={togglle}>Fermer</Button>
        </ModalFooter>
      </Modal>

    <Modal isOpen={secondModal} toggle={toggleSecondModal} >
      <ModalHeader toggle={toggleSecondModal}>Détails de la facture</ModalHeader>
      <ModalBody>
      {selectDocDR && (
        <DemandeRembourssementUpdate documentId={selectDocDR.id} />
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleSecondModal}>Fermer</Button>
      </ModalFooter>
    </Modal>
  </div>
);
        }}
export default Document;
