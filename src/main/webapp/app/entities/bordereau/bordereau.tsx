import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, TextFormat, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import Sidebar from 'app/shared/layout/sidebar/Sidebar';
import { getEntities } from './bordereau.reducer';
import './bordereau.css';

export const Bordereau = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const bordereauList = useAppSelector(state => state.bordereau.entities);
  const loading = useAppSelector(state => state.bordereau.loading);
  const totalItems = useAppSelector(state => state.bordereau.totalItems);

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
      <Sidebar />
      <div className="table-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3 p-3 custom-bg-color text-white rounded">
          <h2 id="bordereau-heading" data-cy="BordereauHeading" className="mb-0">
            <Translate contentKey="faeApp.bordereau.home.title">Bordereaux</Translate>
          </h2>
          <div className="d-flex justify-content-end ajust2" style={{ gap: '10px' }}>
            <Button className="bt btn-info me-2" onClick={handleSyncList} disabled={loading} style={{ width: '220px',height:'48px' }}>
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="faeApp.article.home.refreshListLabel">Refresh List</Translate>
            </Button>
            <Button className="btn btn-success" tag={Link} to="/bordereau/new" style={{ width: '220px' ,height:'48px'}}>
              <FontAwesomeIcon icon="plus" />
              &nbsp;
              <Translate contentKey="faeApp.bordereau.home.createLabel">Créer un nouveau Bordereau</Translate>
            </Button>
          </div>
        </div>
        <div className="table-responsive">
          {bordereauList && bordereauList.length > 0 ? (
            <Table className="table-striped">
              <thead className="thead-dark">
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="faeApp.bordereau.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('reference')}>
                  <Translate contentKey="faeApp.bordereau.reference">Reference</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('etat')}>
                  <Translate contentKey="faeApp.bordereau.etat">Etat</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('montantTotal')}>
                  <Translate contentKey="faeApp.bordereau.montantTotal">Montant Total</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateCreation')}>
                  <Translate contentKey="faeApp.bordereau.dateCreation">Date Creation</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateModification')}>
                  <Translate contentKey="faeApp.bordereau.dateModification">Date Modification</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {bordereauList.map((bordereau, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/bordereau/${bordereau.id}`} color="link" size="sm">
                      {bordereau.id}
                    </Button>
                  </td>
                  <td>{bordereau.reference}</td>
                  <td>{bordereau.etat}</td>
                  <td>{bordereau.montantTotal}</td>
                  <td>
                    {bordereau.dateCreation ? (
                      <TextFormat type="date" value={bordereau.dateCreation} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {bordereau.dateModification ? (
                      <TextFormat type="date" value={bordereau.dateModification} format={APP_LOCAL_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/bordereau/${bordereau.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />
                      </Button>
                      <Button
                        tag={Link}
                        to={`/bordereau/${bordereau.id}/edit?page={paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />
                      </Button>
                      <Button
                        tag={Link}
                        to={`/bordereau/${bordereau.id}/delete?page={paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />
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
                <Translate contentKey="faeApp.bordereau.home.notFound">No Bordereaux found</Translate>
              </div>
            )
          )}
        </div>
        {totalItems ? (
          <div className={bordereauList && bordereauList.length > 0 ? '' : 'd-none'}>
            <div className="d-flex justify-content-end">
              <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
            </div>
            <div className="d-flex justify-content-end">
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
    </div>
  );
};

export default Bordereau;
