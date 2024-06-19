import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState, JhiPagination, JhiItemCount, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from './tarif.reducer';

import './tarif.css';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import Sidebar from 'app/shared/layout/sidebar/Sidebar';

export const Tarif = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const tarifList = useAppSelector(state => state.tarif.entities);
  const loading = useAppSelector(state => state.tarif.loading);
  const totalItems = useAppSelector(state => state.tarif.totalItems);

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
          <h2 id="tarif-heading" data-cy="TarifHeading" className="mb-0">
            <Translate contentKey="faeApp.tarif.home.title">Tarifs</Translate>
          </h2>
          <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
            <Button className="btn btn-info me-2" onClick={handleSyncList} disabled={loading} style={{ width: '220px' }}>
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="faeApp.article.home.refreshListLabel">Refresh List</Translate>
            </Button>
            <Button className="btn btn-success" tag={Link} to="/tarif/new" style={{ width: '220px' }}>
              <FontAwesomeIcon icon="plus" />
              &nbsp;
              <Translate contentKey="faeApp.tarif.home.createLabel">Créer un nouveau Tarif</Translate>
            </Button>
          </div>


        </div>
        <div className="table-responsive">
          {tarifList && tarifList.length > 0 ? (
            <Table className="table-striped">
              <thead className="thead-dark">
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="faeApp.tarif.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateDebut')}>
                  <Translate contentKey="faeApp.tarif.dateDebut">Date Debut</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('dateFin')}>
                  <Translate contentKey="faeApp.tarif.dateFin">Date Fin</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="faeApp.tarif.reductions">Reductions</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="faeApp.tarif.articles">Articles</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {tarifList.map((tarif, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/tarif/${tarif.id}`} color="link" size="sm">
                      {tarif.id}
                    </Button>
                  </td>
                  <td>{tarif.dateDebut ? <TextFormat type="date" value={tarif.dateDebut} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{tarif.dateFin ? <TextFormat type="date" value={tarif.dateFin} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>{tarif.reductions ? <Link to={`/reduction/${tarif.reductions.id}`}>{tarif.reductions.id}</Link> : ''}</td>
                  <td>{tarif.articles ? <Link to={`/article/${tarif.articles.id}`}>{tarif.articles.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/tarif/${tarif.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />
                      </Button>
                      <Button
                        tag={Link}
                        to={`/tarif/${tarif.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />
                      </Button>
                      <Button
                        tag={Link}
                        to={`/tarif/${tarif.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                <Translate contentKey="faeApp.tarif.home.notFound">No Tarifs found</Translate>
              </div>
            )
          )}
        </div>
        {totalItems ? (
          <div className={tarifList && tarifList.length > 0 ? '' : 'd-none'}>
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

export default Tarif;
