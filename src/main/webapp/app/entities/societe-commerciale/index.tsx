import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SocieteCommerciale from './societe-commerciale';
import SocieteCommercialeDetail from './societe-commerciale-detail';
import SocieteCommercialeUpdate from './societe-commerciale-update';
import SocieteCommercialeDeleteDialog from './societe-commerciale-delete-dialog';

const SocieteCommercialeRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SocieteCommerciale />} />
    <Route path="new" element={<SocieteCommercialeUpdate />} />
    <Route path=":id">
      <Route index element={<SocieteCommercialeDetail />} />
      <Route path="edit" element={<SocieteCommercialeUpdate />} />
      <Route path="delete" element={<SocieteCommercialeDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SocieteCommercialeRoutes;
