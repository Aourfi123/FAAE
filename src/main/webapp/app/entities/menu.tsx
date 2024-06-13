import React from 'react';
import { Translate } from 'react-jhipster';
import PrivateRoute from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
      <MenuItem icon="asterisk" to="/article">
        <Translate contentKey="global.menu.entities.article" />
      </MenuItem>
      </PrivateRoute>
      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
      <MenuItem icon="asterisk" to="/tarif">
        <Translate contentKey="global.menu.entities.tarif" />
      </MenuItem>
      </PrivateRoute>
      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>

      <MenuItem icon="asterisk" to="/societe-commerciale">
        <Translate contentKey="global.menu.entities.societeCommerciale" />
      </MenuItem>
      </PrivateRoute>
      <MenuItem icon="asterisk" to="/document">
        <Translate contentKey="global.menu.entities.document" />
      </MenuItem>
      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
      <MenuItem icon="asterisk" to="/facture">
        <Translate contentKey="global.menu.entities.facture" />
      </MenuItem>
      </PrivateRoute>

      <MenuItem icon="asterisk" to="/avoir">
        <Translate contentKey="global.menu.entities.avoir" />
      </MenuItem>
      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>

      <MenuItem icon="asterisk" to="/client">
        <Translate contentKey="global.menu.entities.client" />
      </MenuItem>
      </PrivateRoute>
      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
      <MenuItem icon="asterisk" to="/paiement">
        <Translate contentKey="global.menu.entities.paiement" />
      </MenuItem>
      </PrivateRoute>
      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>

      <MenuItem icon="asterisk" to="/bordereau">
        <Translate contentKey="global.menu.entities.bordereau" />
      </MenuItem>
      </PrivateRoute>

      <MenuItem icon="asterisk" to="/demande-rembourssement">
        <Translate contentKey="global.menu.entities.demandeRembourssement" />
      </MenuItem>
      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>

      <MenuItem icon="asterisk" to="/details-demande">
        <Translate contentKey="global.menu.entities.detailsDemande" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/lignes-bordereau">
        <Translate contentKey="global.menu.entities.lignesBordereau" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/lignes-document">
        <Translate contentKey="global.menu.entities.lignesDocument" />
      </MenuItem>
      </PrivateRoute>

      <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>

      <MenuItem icon="asterisk" to="/reduction">
        <Translate contentKey="global.menu.entities.reduction" />
      </MenuItem>

      <MenuItem icon="asterisk" to="/client-bordereau">
        <Translate contentKey="global.menu.entities.clientBordereau" />
      </MenuItem>
      </PrivateRoute>

      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
