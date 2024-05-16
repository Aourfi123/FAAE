import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Reduction from './reduction';
import ReductionDetail from './reduction-detail';
import ReductionUpdate from './reduction-update';
import ReductionDeleteDialog from './reduction-delete-dialog';

const ReductionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Reduction />} />
    <Route path="new" element={<ReductionUpdate />} />
    <Route path=":id">
      <Route index element={<ReductionDetail />} />
      <Route path="edit" element={<ReductionUpdate />} />
      <Route path="delete" element={<ReductionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ReductionRoutes;
