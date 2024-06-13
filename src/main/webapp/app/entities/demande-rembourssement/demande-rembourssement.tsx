import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { openFile, byteSize, Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getligneDocument , updateEntity as updateLigneDocument, createEntity as createLigneDocument } from 'app/entities/lignes-document/lignes-document.reducer';
import { getEntities as getDemandesRembourssement, updateEntity as updateDemandeRembourssement } from './demande-rembourssement.reducer';
import { getEntities as getArticles } from 'app/entities/article/article.reducer';
import { getEntities as getDetailsDemande, updateEntity as updateDetailsDemande } from 'app/entities/details-demande/details-demande.reducer';
import { getEntities as getClientBordereau } from 'app/entities/client-bordereau/client-bordereau.reducer';
import { getEntities as getLignesBordereaus } from 'app/entities/lignes-bordereau/lignes-bordereau.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';
import { createEntity as createAvoir} from 'app/entities/avoir/avoir.reducer';
import { getEntities as getarticles } from 'app/entities/article/article.reducer';
export const DemandeRembourssement = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const [modal, setModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [newEtat, setNewEtat] = useState('');
  const lignesDocumentList = useAppSelector(state => state.lignesDocument.entities);
  const demandeRembourssementList = useAppSelector(state => state.demandeRembourssement.entities);
  const loading = useAppSelector(state => state.demandeRembourssement.loading);
  const totalItems = useAppSelector(state => state.demandeRembourssement.totalItems);
  const user = useAppSelector(state => state.authentication.account);
  const detailsDemandeList = useAppSelector(state => state.detailsDemande.entities);
  const clientBordereauList = useAppSelector(state => state.clientBordereau.entities);
  const lignesBordereauList = useAppSelector(state => state.lignesBordereau.entities);
  const clientList = useAppSelector(state => state.client.entities);
  const articleList = useAppSelector(state => state.article.entities);

  const getAllEntities = () => {
    dispatch(getDemandesRembourssement({}));
    dispatch(getDetailsDemande({}));
    dispatch(getClientBordereau({}));
    dispatch(getLignesBordereaus({}));
    dispatch(getligneDocument({}))
    dispatch(getClients({}));
    dispatch(getarticles({}))
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
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

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

  const updateDetailsDemandeState = (detailsDemande, newState) => {
    const updatedDetailsDemande = {
      ...detailsDemande,
      etat: newState,
    };
    const articlesSelectionnees = articleList.filter(article =>  detailsDemandeList.some(detailsd =>
     detailsd.demandeRemboursements &&
     detailsDemande.articles &&
     detailsd.demandeRemboursements.id == selectedDemande.id &&
     article.id == detailsDemande.articles.id
    ) );
    const bordereauSelectionnees = lignesBordereauList.filter(lignebordereau =>  articlesSelectionnees.some(article =>
      lignebordereau.articles &&
      article.id == lignebordereau.articles.id
     ) );
     const documentSelecionner = lignesDocumentList.find(lignedocument =>  bordereauSelectionnees.some(bordereau =>
      lignedocument.bordereaus && bordereau.bordereaus &&
      bordereau.bordereaus.id == lignedocument.bordereaus.id
     ) )?.documents
    const EntityAvoir = {
      code: documentSelecionner.code,
      document: documentSelecionner,
    };
    dispatch(createAvoir(EntityAvoir))
    dispatch(updateDetailsDemande(updatedDetailsDemande));
  };

  const updateDemandeRembourssementState = (demandeRembourssement, newState) => {
    const updatedDemandeRembourssement = {
      ...demandeRembourssement,
      etat: newState,
    };
    dispatch(updateDemandeRembourssement(updatedDemandeRembourssement));
  };

  const openModal = demandeRembourssement => {
    setSelectedDemande(demandeRembourssement);
    setNewEtat(demandeRembourssement.etat);
    setModal(true);
  };

  const handleSave = () => {
    if (selectedDemande) {
      const detailsDemande = detailsDemandeList.find(detail => detail.demandeRemboursements.id === selectedDemande.id);
      updateDetailsDemandeState(detailsDemande, newEtat);
      updateDemandeRembourssementState(selectedDemande, newEtat);
    }
    setModal(false);
  };

  const filteredDemandesRembourssement = user.authorities.includes('ROLE_ADMIN')
    ? demandeRembourssementList
    : demandeRembourssementList.filter(demande => {
        const detailsDemandeForDemande = detailsDemandeList.filter(detail => detail.demandeRemboursements && detail.demandeRemboursements.id === demande.id);
        const articlesIds = detailsDemandeForDemande.map(detail => detail.articles?.id);

        const bordereauIds = lignesBordereauList
          .filter(ligne => articlesIds.includes(ligne.articles?.id))
          .map(ligne => ligne.bordereaus?.id);
        const clientBordereauForUser = clientBordereauList.find(
          cb => bordereauIds.includes(cb.bordereaus?.id) && clientList.find(client => client.id == cb.clients?.id && client.user?.id == user.id)
        );

        return !!clientBordereauForUser;
      });

  return (
    <div>
      <h2 id="demande-rembourssement-heading" data-cy="DemandeRembourssementHeading">
        <Translate contentKey="faeApp.demandeRembourssement.home.title">Demande Rembourssements</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="faeApp.demandeRembourssement.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/demande-rembourssement/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="faeApp.demandeRembourssement.home.createLabel">Create new Demande Rembourssement</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {filteredDemandesRembourssement && filteredDemandesRembourssement.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="faeApp.demandeRembourssement.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('raison')}>
                  <Translate contentKey="faeApp.demandeRembourssement.raison">Raison</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('pieceJointe')}>
                  <Translate contentKey="faeApp.demandeRembourssement.pieceJointe">Piece Jointe</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('etat')}>
                  <Translate contentKey="faeApp.demandeRembourssement.etat">Etat</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateCreation')}>
                  <Translate contentKey="faeApp.demandeRembourssement.dateCreation">Date Creation</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredDemandesRembourssement.map((demandeRembourssement, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/demande-rembourssement/${demandeRembourssement.id}`} color="link" size="sm">
                      {demandeRembourssement.id}
                    </Button>
                  </td>
                  <td>{demandeRembourssement.raison}</td>
                  <td>
                    {demandeRembourssement.pieceJointe ? (
                      <div>
                        {demandeRembourssement.pieceJointeContentType ? (
                          <a onClick={openFile(demandeRembourssement.pieceJointeContentType, demandeRembourssement.pieceJointe)}>
                            <img
                              src={`data:${demandeRembourssement.pieceJointeContentType};base64,${demandeRembourssement.pieceJointe}`}
                              style={{ maxHeight: '30px' }}
                            />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {demandeRembourssement.pieceJointeContentType}, {byteSize(demandeRembourssement.pieceJointe)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{demandeRembourssement.etat}</td>
                  <td>
                    {demandeRembourssement.dateCreation ? (
                      <TextFormat type="date" value={demandeRembourssement.dateCreation} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/demande-rembourssement/${demandeRembourssement.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/demande-rembourssement/${demandeRembourssement.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                        to={`/demande-rembourssement/${demandeRembourssement.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                      {user.authorities.includes('ROLE_ADMIN') && (
                        <Button color="warning" size="sm" onClick={() => openModal(demandeRembourssement)}>
                          <FontAwesomeIcon icon="edit" />{' '}
                          <span className="d-none d-md-inline">
                        Edit State
                          </span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="faeApp.demandeRembourssement.home.notFound">No Demande Rembourssements found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={filteredDemandesRembourssement && filteredDemandesRembourssement.length > 0 ? '' : 'd-none'}>
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
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          <Translate contentKey="entity.action.editState">Edit State</Translate>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="etat-select">
              <Translate contentKey="faeApp.demandeRembourssement.etat">Etat</Translate>
            </Label>
            <Input type="select" id="etat-select" value={newEtat} onChange={e => setNewEtat(e.target.value)}>
              <option value="En attente">En Attente</option>
              <option value="Accepté">Accepté</option>
              <option value="Decliné">Decliné</option>
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(false)}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="primary" onClick={handleSave}>
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DemandeRembourssement;
