import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import DetailsDemande from './details-demande';
import DetailsDemandeDetail from './details-demande-detail';
import DetailsDemandeUpdate from './details-demande-update';
import DetailsDemandeDeleteDialog from './details-demande-delete-dialog';

const DetailsDemandeRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<DetailsDemande />} />
    <Route path="new" element={<DetailsDemandeUpdate />} />
    <Route path=":id">
      <Route index element={<DetailsDemandeDetail />} />
      <Route path="edit" element={<DetailsDemandeUpdate />} />
      <Route path="delete" element={<DetailsDemandeDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default DetailsDemandeRoutes;
