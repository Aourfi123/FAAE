import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from './societe-commerciale.reducer';

import './SocieteCommerciale.css';
import {ASC, DESC, ITEMS_PER_PAGE, SORT} from "app/shared/util/pagination.constants";
import Sidebar from "app/shared/layout/sidebar/Sidebar"; // Custom CSS for additional styling

export const SocieteCommerciale = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const societeCommercialeList = useAppSelector(state => state.societeCommerciale.entities);
  const loading = useAppSelector(state => state.societeCommerciale.loading);
  const totalItems = useAppSelector(state => state.societeCommerciale.totalItems);

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
      <Sidebar/>
      <div className="table-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3 p-3 custom-bg-color text-white rounded">
          <h2 id="societe-commerciale-heading" data-cy="SocieteCommercialeHeading" className="mb-0">
            <Translate contentKey="faeApp.societeCommerciale.home.title">Societe Commerciales</Translate>
          </h2>
          <div className="d-flex justify-content-end ajust" style={{ gap: '10px', left: '100px' }}>
            <Button className="btn btn-info" onClick={handleSyncList} disabled={loading} style={{ width: '220px', height: '48px' }}>
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="faeApp.article.home.refreshListLabel">Actualiser la liste</Translate>
            </Button>
            <Button className="btn btn-success" tag={Link} to="/societe-commerciale/new" style={{ width: '220px', height: '48px' }}>
              <FontAwesomeIcon icon="plus" />Créer une nouvelle Societe Commerciale
              &nbsp;
            </Button>
          </div>


        </div>
        <div className="table-responsive">
          {societeCommercialeList && societeCommercialeList.length > 0 ? (
            <Table className="table-striped">
              <thead className="thead-dark">
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="faeApp.societeCommerciale.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('codePays')}>
                  <Translate contentKey="faeApp.societeCommerciale.codePays">Code Pays</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('libelle')}>
                  <Translate contentKey="faeApp.societeCommerciale.libelle">Libelle</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th className="hand" onClick={sort('devise')}>
                  <Translate contentKey="faeApp.societeCommerciale.devise">Devise</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {societeCommercialeList.map((societeCommerciale, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/societe-commerciale/${societeCommerciale.id}`} color="link" size="sm">
                      {societeCommerciale.id}
                    </Button>
                  </td>
                  <td>{societeCommerciale.codePays}</td>
                  <td>{societeCommerciale.libelle}</td>
                  <td>{societeCommerciale.devise}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/societe-commerciale/${societeCommerciale.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />
                      </Button>
                      <Button
                        tag={Link}
                        to={`/societe-commerciale/${societeCommerciale.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />
                      </Button>
                      <Button
                        tag={Link}
                        to={`/societe-commerciale/${societeCommerciale.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                <Translate contentKey="faeApp.societeCommerciale.home.notFound">No Societe Commerciales found</Translate>
              </div>
            )
          )}
        </div>
        {totalItems ? (
          <div className={societeCommercialeList && societeCommercialeList.length > 0 ? '' : 'd-none'}>
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

export default SocieteCommerciale;
