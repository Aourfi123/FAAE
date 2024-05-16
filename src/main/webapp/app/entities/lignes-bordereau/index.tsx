import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import LignesBordereau from './lignes-bordereau';
import LignesBordereauDetail from './lignes-bordereau-detail';
import LignesBordereauUpdate from './lignes-bordereau-update';
import LignesBordereauDeleteDialog from './lignes-bordereau-delete-dialog';

const LignesBordereauRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<LignesBordereau />} />
    <Route path="new" element={<LignesBordereauUpdate />} />
    <Route path=":id">
      <Route index element={<LignesBordereauDetail />} />
      <Route path="edit" element={<LignesBordereauUpdate />} />
      <Route path="delete" element={<LignesBordereauDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default LignesBordereauRoutes;
