import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ClientBordereau from './client-bordereau';
import ClientBordereauDetail from './client-bordereau-detail';
import ClientBordereauUpdate from './client-bordereau-update';
import ClientBordereauDeleteDialog from './client-bordereau-delete-dialog';

const ClientBordereauRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ClientBordereau />} />
    <Route path="new" element={<ClientBordereauUpdate />} />
    <Route path=":id">
      <Route index element={<ClientBordereauDetail />} />
      <Route path="edit" element={<ClientBordereauUpdate />} />
      <Route path="delete" element={<ClientBordereauDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ClientBordereauRoutes;
