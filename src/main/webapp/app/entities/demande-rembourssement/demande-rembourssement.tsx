import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IDemandeRembourssement } from 'app/shared/model/demande-rembourssement.model';
import { getEntities } from './demande-rembourssement.reducer';

export const DemandeRembourssement = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const demandeRembourssementList = useAppSelector(state => state.demandeRembourssement.entities);
  const loading = useAppSelector(state => state.demandeRembourssement.loading);
  const totalItems = useAppSelector(state => state.demandeRembourssement.totalItems);

  const getAllEntities = () => {
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
        {demandeRembourssementList && demandeRembourssementList.length > 0 ? (
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
                  <Translate contentKey="faeApp.demandeRembourssement.dateCreation">Date Creation</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateModification')}>
                  <Translate contentKey="faeApp.demandeRembourssement.dateModification">Date Modification</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {demandeRembourssementList.map((demandeRembourssement, i) => (
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
                  <td>
                    {demandeRembourssement.dateModification ? (
                      <TextFormat type="date" value={demandeRembourssement.dateModification} format={APP_LOCAL_DATE_FORMAT} />
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
        <div className={demandeRembourssementList && demandeRembourssementList.length > 0 ? '' : 'd-none'}>
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
    </div>
  );
};

export default DemandeRembourssement;
