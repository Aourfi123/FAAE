import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Article from './article';
import Tarif from './tarif';
import SocieteCommerciale from './societe-commerciale';
import Document from './document';
import Facture from './facture';
import Avoir from './avoir';
import Client from './client';
import Paiement from './paiement';
import Bordereau from './bordereau';
import DemandeRembourssement from './demande-rembourssement';
import DetailsDemande from './details-demande';
import LignesBordereau from './lignes-bordereau';
import LignesDocument from './lignes-document';
import Reduction from './reduction';
import ClientBordereau from './client-bordereau';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="article/*" element={<Article />} />
        <Route path="tarif/*" element={<Tarif />} />
        <Route path="societe-commerciale/*" element={<SocieteCommerciale />} />
        <Route path="document/*" element={<Document />} />
        <Route path="facture/*" element={<Facture />} />
        <Route path="avoir/*" element={<Avoir />} />
        <Route path="client/*" element={<Client />} />
        <Route path="paiement/*" element={<Paiement />} />
        <Route path="bordereau/*" element={<Bordereau />} />
        <Route path="demande-rembourssement/*" element={<DemandeRembourssement />} />
        <Route path="details-demande/*" element={<DetailsDemande />} />
        <Route path="lignes-bordereau/*" element={<LignesBordereau />} />
        <Route path="lignes-document/*" element={<LignesDocument />} />
        <Route path="reduction/*" element={<Reduction />} />
        <Route path="client-bordereau/*" element={<ClientBordereau />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
