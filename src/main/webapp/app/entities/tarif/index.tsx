import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Tarif from './tarif';
import TarifDetail from './tarif-detail';
import TarifUpdate from './tarif-update';
import TarifDeleteDialog from './tarif-delete-dialog';

const TarifRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Tarif />} />
    <Route path="new" element={<TarifUpdate />} />
    <Route path=":id">
      <Route index element={<TarifDetail />} />
      <Route path="edit" element={<TarifUpdate />} />
      <Route path="delete" element={<TarifDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default TarifRoutes;
