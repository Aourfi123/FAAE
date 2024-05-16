import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Avoir from './avoir';
import AvoirDetail from './avoir-detail';
import AvoirUpdate from './avoir-update';
import AvoirDeleteDialog from './avoir-delete-dialog';

const AvoirRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Avoir />} />
    <Route path="new" element={<AvoirUpdate />} />
    <Route path=":id">
      <Route index element={<AvoirDetail />} />
      <Route path="edit" element={<AvoirUpdate />} />
      <Route path="delete" element={<AvoirDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AvoirRoutes;
