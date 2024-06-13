import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import DemandeRembourssement from './demande-rembourssement';
import DemandeRembourssementDetail from './demande-rembourssement-detail';
import DemandeRembourssementUpdate from './demande-rembourssement-update';
import DemandeRembourssementDeleteDialog from './demande-rembourssement-delete-dialog';

const DemandeRembourssementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<DemandeRembourssement />} />
    <Route path="new" element={<DemandeRembourssementUpdate documentId={''} />} />
    <Route path=":id">
      <Route index element={<DemandeRembourssementDetail />} />
      <Route path="edit" element={<DemandeRembourssementUpdate documentId={''} />} />
      <Route path="delete" element={<DemandeRembourssementDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default DemandeRembourssementRoutes;
