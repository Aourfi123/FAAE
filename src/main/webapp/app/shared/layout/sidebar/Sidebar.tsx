// src/app/shared/layout/sidebar/Sidebar.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTable, faUsersCog, faChartPie, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';


const Sidebar = () => {
  const [isEntitesOpen, setIsEntitesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const toggleEntites = () => setIsEntitesOpen(!isEntitesOpen);
  const toggleAdmin = () => setIsAdminOpen(!isAdminOpen);

  return (
    <div className="sidebar">
      <img src="content/images/ouipneu-michelin.png" style={{width: "270px",height:"140px"}}/>
      <br /><br /><br />
      <Nav vertical>
        <NavItem>
          <NavLink tag={Link} to="/">
            <FontAwesomeIcon icon={faHome} className="nav-icon" /> <span className="nav-text">Accueil</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink onClick={toggleEntites} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faTable} className="nav-icon" /> <span className="nav-text">Entités</span>
            <FontAwesomeIcon icon={isEntitesOpen ? faChevronUp : faChevronDown} className="chevron-icon" />
          </NavLink>
          <Collapse isOpen={isEntitesOpen}>
            <Nav vertical className="submenu">
              <NavItem>
                <NavLink tag={Link} to="/article">Article</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/tarif">Tarif</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/societe-commerciale">Société Commerciale</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/document">Document</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/facture">Facture</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/avoir">Avoir</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/client">Client</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/paiement">Paiement</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/bordereau">Bordereau</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/demande-rembourssement">Demande Remboursement</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/details-demande">Détails Demande</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/lignes-bordereau">Lignes Bordereau</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/lignes-document">Lignes Document</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/reduction">Réduction</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/client-bordereau">Client Bordereau</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </NavItem>
        <NavItem>
          <NavLink onClick={toggleAdmin} style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faUsersCog} className="nav-icon" /> <span className="nav-text">Administration</span>
            <FontAwesomeIcon icon={isAdminOpen ? faChevronUp : faChevronDown} className="chevron-icon" />
          </NavLink>
          <Collapse isOpen={isAdminOpen}>
            <Nav vertical className="submenu">
              <NavItem>
                <NavLink tag={Link} to="/admin/user-management">User Management</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/metrics">Metrics</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/health">Health</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/configuration">Configuration</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/logs">Logs</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/graphics">
            <FontAwesomeIcon icon={faChartPie} className="nav-icon" /> <span className="nav-text">Graphicals</span>
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default Sidebar;
