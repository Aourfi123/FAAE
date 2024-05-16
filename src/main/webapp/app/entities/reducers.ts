import article from 'app/entities/article/article.reducer';
import tarif from 'app/entities/tarif/tarif.reducer';
import societeCommerciale from 'app/entities/societe-commerciale/societe-commerciale.reducer';
import document from 'app/entities/document/document.reducer';
import facture from 'app/entities/facture/facture.reducer';
import avoir from 'app/entities/avoir/avoir.reducer';
import client from 'app/entities/client/client.reducer';
import paiement from 'app/entities/paiement/paiement.reducer';
import bordereau from 'app/entities/bordereau/bordereau.reducer';
import demandeRembourssement from 'app/entities/demande-rembourssement/demande-rembourssement.reducer';
import detailsDemande from 'app/entities/details-demande/details-demande.reducer';
import lignesBordereau from 'app/entities/lignes-bordereau/lignes-bordereau.reducer';
import lignesDocument from 'app/entities/lignes-document/lignes-document.reducer';
import reduction from 'app/entities/reduction/reduction.reducer';
import clientBordereau from 'app/entities/client-bordereau/client-bordereau.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  article,
  tarif,
  societeCommerciale,
  document,
  facture,
  avoir,
  client,
  paiement,
  bordereau,
  demandeRembourssement,
  detailsDemande,
  lignesBordereau,
  lignesDocument,
  reduction,
  clientBordereau,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
