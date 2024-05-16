import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Bordereau from './bordereau';
import BordereauDetail from './bordereau-detail';
import BordereauUpdate from './bordereau-update';
import BordereauDeleteDialog from './bordereau-delete-dialog';

const BordereauRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Bordereau />} />
    <Route path="new" element={<BordereauUpdate />} />
    <Route path=":id">
      <Route index element={<BordereauDetail />} />
      <Route path="edit" element={<BordereauUpdate />} />
      <Route path="delete" element={<BordereauDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default BordereauRoutes;
