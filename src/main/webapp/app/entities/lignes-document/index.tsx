import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import LignesDocument from './lignes-document';
import LignesDocumentDetail from './lignes-document-detail';
import LignesDocumentUpdate from './lignes-document-update';
import LignesDocumentDeleteDialog from './lignes-document-delete-dialog';

const LignesDocumentRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<LignesDocument />} />
    <Route path="new" element={<LignesDocumentUpdate />} />
    <Route path=":id">
      <Route index element={<LignesDocumentDetail />} />
      <Route path="edit" element={<LignesDocumentUpdate />} />
      <Route path="delete" element={<LignesDocumentDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default LignesDocumentRoutes;
