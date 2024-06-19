import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Badge } from 'reactstrap';
import { openFile, Translate, TextFormat, JhiPagination, JhiItemCount, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { getUsersAsAdmin, updateUser } from './user-management.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getClientEntities } from 'app/entities/client/client.reducer';
import Sidebar from 'app/shared/layout/sidebar/Sidebar';

import './UserManagement.css'; // Import the CSS file

export const UserManagement = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [pagination, setPagination] = useState(
    overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search)
  );

  const getUsersFromProps = () => {
    dispatch(
      getUsersAsAdmin({
        page: pagination.activePage - 1,
        size: pagination.itemsPerPage,
        sort: `${pagination.sort},${pagination.order}`,
      })
    );
    const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    getUsersFromProps();
    dispatch(getClientEntities({}));
  }, [pagination.activePage, pagination.order, pagination.sort]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = params.get('page');
    const sortParam = params.get(SORT);
    if (page && sortParam) {
      const sortSplit = sortParam.split(',');
      setPagination({
        ...pagination,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [location.search]);

  const sort = p => () =>
    setPagination({
      ...pagination,
      order: pagination.order === ASC ? DESC : ASC,
      sort: p,
    });

  const handlePagination = currentPage =>
    setPagination({
      ...pagination,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    getUsersFromProps();
  };

  const toggleActive = user => () => {
    dispatch(
      updateUser({
        ...user,
        activated: !user.activated,
      })
    );
  };

  const account = useAppSelector(state => state.authentication.account);
  const users = useAppSelector(state => state.userManagement.users);
  const totalItems = useAppSelector(state => state.userManagement.totalItems);
  const loading = useAppSelector(state => state.userManagement.loading);
  const clientList = useAppSelector(state => state.client.entities);

  return (
    <div>
      <Sidebar />
      <div className="table-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3 p-3 custom-bg-color text-white rounded">
          <h2 id="user-management-page-heading" data-cy="userManagementPageHeading" className="mb-0" style={{width:'200px'}}>
            Liste Clients
          </h2>
          <div className="d-flex justify-content-end ajust3" style={{ gap: '10px' , marginLeft:'-10px'}}>
            <Button className="btn btn-info me-2" onClick={handleSyncList} disabled={loading} style={{ width: '220px', height: '45px' }}>
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="userManagement.home.refreshListLabel">Refresh List</Translate>
            </Button>
            <Link to="new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton" style={{ width: '220px', height: '45px' }}>
              <FontAwesomeIcon icon="plus" />  Créer un nouveau utilisateur
            </Link>
          </div>
        </div>
        <div className="table-responsive">
          <Table className="table-striped">
            <thead className="thead-dark">
            <tr>
              <th className="hand" onClick={sort('id')}>
                <Translate contentKey="global.field.id">ID</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('photo')}>
                <Translate contentKey="faeApp.client.photo">Photo</Translate> <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('login')}>
                Nom complet
                <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('email')}>
                <Translate contentKey="userManagement.email">Email</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th />
              <th className="hand" onClick={sort('langKey')}>
                <Translate contentKey="userManagement.langKey">Lang Key</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th>
                <Translate contentKey="userManagement.profiles">Profiles</Translate>
              </th>
              <th className="hand" onClick={sort('createdDate')}>
                <Translate contentKey="userManagement.createdDate">Created Date</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th className="hand" onClick={sort('lastModifiedBy')}>
                <Translate contentKey="userManagement.lastModifiedBy">Last Modified By</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th id="modified-date-sort" className="hand" onClick={sort('lastModifiedDate')}>
                <Translate contentKey="userManagement.lastModifiedDate">Last Modified Date</Translate>
                <FontAwesomeIcon icon="sort" />
              </th>
              <th />
            </tr>
            </thead>
            <tbody>
            {users.map((user, i) => (
              <tr id={user.login} key={`user-${i}`}>
                <td>
                  <Button tag={Link} to={user.login} color="link" size="sm">
                    {user.id}
                  </Button>
                </td>
                <td>
                  {clientList
                    ? clientList
                      .filter(client => client.user.id === user.id)
                      .map((client, j) => (
                        <div key={`client-${i}-${j}`}>
                          {client.photoContentType ? (
                            <a onClick={openFile(client.photoContentType, client.photo)}>
                              <img
                                src={`data:${client.photoContentType};base64,${client.photo}`}
                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              &nbsp;
                            </a>
                          ) : null}
                        </div>
                      ))
                    : null}
                </td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  {user.activated ? (
                    <Button color="success" onClick={toggleActive(user)} style={{ padding: '5px 5px', fontSize: '12px' }} className="meme">
                      <Translate contentKey="userManagement.activated">Activé</Translate>
                    </Button>
                  ) : (
                    <Button color="danger" onClick={toggleActive(user)} style={{ padding: '5px 5px', fontSize: '12px'}}>
                      <Translate contentKey="userManagement.deactivated">Désactivé</Translate>
                    </Button>
                  )}
                </td>

                <td>{user.langKey}</td>
                <td>
                  {user.authorities
                    ? user.authorities.map((authority, j) => (
                      <div key={`user-auth-${i}-${j}`}>
                        <Badge color="info">{authority}</Badge>
                      </div>
                    ))
                    : null}
                </td>
                <td>
                  {user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
                </td>
                <td>{user.lastModifiedBy}</td>
                <td>
                  {user.lastModifiedDate ? (
                    <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  ) : null}
                </td>
                <td className="text-end">
                  <div className="btn-group flex-btn-group-container">
                    <Button tag={Link} to={user.login} color="info" size="sm">
                      <FontAwesomeIcon icon="eye" />{' '}

                    </Button>
                    <Button tag={Link} to={`${user.login}/edit`} color="primary" size="sm">
                      <FontAwesomeIcon icon="pencil-alt" />{' '}

                    </Button>
                    <Button tag={Link} to={`${user.login}/delete`} color="danger" size="sm" disabled={account.login === user.login}>
                      <FontAwesomeIcon icon="trash" />{' '}

                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </div>
        {totalItems ? (
          <div className={users?.length > 0 ? '' : 'd-none'}>
            <div className="d-flex justify-content-center">
              <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} i18nEnabled />
            </div>
            <div className="d-flex justify-content-center">
              <JhiPagination
                activePage={pagination.activePage}
                onSelect={handlePagination}
                maxButtons={5}
                itemsPerPage={pagination.itemsPerPage}
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

export default UserManagement;
