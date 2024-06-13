import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IAvoir } from 'app/shared/model/avoir.model';
import { getEntities } from './avoir.reducer';
import { getEntities as getDocuments } from 'app/entities/document/document.reducer';
import { getEntities as getLignesDocuments } from 'app/entities/lignes-document/lignes-document.reducer';
import { getEntities as getClientBordereau } from 'app/entities/client-bordereau/client-bordereau.reducer';
import { getEntities as getClients } from 'app/entities/client/client.reducer';

export const Avoir = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const avoirList = useAppSelector(state => state.avoir.entities);
  const loading = useAppSelector(state => state.avoir.loading);
  const totalItems = useAppSelector(state => state.avoir.totalItems);
  const user = useAppSelector(state => state.authentication.account);
  const documentList = useAppSelector(state => state.document.entities);
  const lignesDocumentList = useAppSelector(state => state.lignesDocument.entities);
  const clientBordereauList = useAppSelector(state => state.clientBordereau.entities);
  const clientList = useAppSelector(state => state.client.entities);

  const getAllEntities = () => {
    dispatch(getEntities({
      page: paginationState.activePage - 1,
      size: paginationState.itemsPerPage,
      sort: `${paginationState.sort},${paginationState.order}`,
    }));
    dispatch(getDocuments({}));
    dispatch(getLignesDocuments({}));
    dispatch(getClientBordereau({}));
    dispatch(getClients({}));
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

  // Filtrage des avoirs pour les utilisateurs non-admin
  const filteredAvoirList = user && user.authorities.includes('ROLE_ADMIN') ? avoirList : avoirList.filter(avoir => {
    const document = documentList.find(doc => doc.id == avoir.document?.id);
    if (!document) return false;
    console.log("document"+document )
    const lignesDocument = lignesDocumentList.filter(ld => ld.documents?.id == document.id);
    console.log("lignesDocument"+lignesDocument)
    const bordereauIds = lignesDocument.map(ld => ld.bordereaus?.id);
    console.log("bordereauIds"+bordereauIds)
    const clientBordereauForUser = clientBordereauList.find(
      cb => bordereauIds.includes(cb.bordereaus?.id) && clientList.find(client => client.id == cb.clients?.id && client.user?.id == user.id)
    );
    console.log("clientBordereauForUser"+clientBordereauForUser)
    return !!clientBordereauForUser;
  });

  return (
    <div>
      <h2 id="avoir-heading" data-cy="AvoirHeading">
        <Translate contentKey="faeApp.avoir.home.title">Avoirs</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="faeApp.avoir.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/avoir/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="faeApp.avoir.home.createLabel">Create new Avoir</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {filteredAvoirList && filteredAvoirList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="faeApp.avoir.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('code')}>
                  <Translate contentKey="faeApp.avoir.code">Code</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="faeApp.avoir.document">Document</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredAvoirList.map((avoir, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/avoir/${avoir.id}`} color="link" size="sm">
                      {avoir.id}
                    </Button>
                  </td>
                  <td>{avoir.code}</td>
                  <td>{avoir.document ? <Link to={`/document/${avoir.document.id}`}>{avoir.document.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/avoir/${avoir.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/avoir/${avoir.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/avoir/${avoir.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger" size="sm" data-cy="entityDeleteButton">
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
              <Translate contentKey="faeApp.avoir.home.notFound">No Avoirs found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={avoirList && avoirList.length > 0 ? '' : 'd-none'}>
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

export default Avoir;
