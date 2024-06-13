import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import { Row, Col, Alert, Table } from 'reactstrap';
import account from '../account';

const dataAnnuel = [
  { date: '2019', articlesCommandes: 100, commandes: 80, facturesPayees: 70, avoirs: 20 },
  { date: '2020', articlesCommandes: 120, commandes: 90, facturesPayees: 85, avoirs: 25 },
  { date: '2021', articlesCommandes: 130, commandes: 100, facturesPayees: 95, avoirs: 30 },
  { date: '2022', articlesCommandes: 140, commandes: 110, facturesPayees: 105, avoirs: 35 },
  { date: '2023', articlesCommandes: 150, commandes: 120, facturesPayees: 115, avoirs: 40 },
  { date: '2024', articlesCommandes: 160, commandes: 130, facturesPayees: 125, avoirs: 45 },
];

const dataMensuel = [
  { date: 'Janvier', articlesCommandes: 50, commandes: 20, facturesPayees: 15, avoirs: 5 },
  { date: 'Février', articlesCommandes: 60, commandes: 25, facturesPayees: 20, avoirs: 7 },
  { date: 'Mars', articlesCommandes: 70, commandes: 30, facturesPayees: 25, avoirs: 10 },
  { date: 'Avril', articlesCommandes: 80, commandes: 35, facturesPayees: 100, avoirs: 12 },
  { date: 'Mai', articlesCommandes: 90, commandes: 40, facturesPayees: 35, avoirs: 15 },
  { date: 'Juin', articlesCommandes: 10, commandes: 45, facturesPayees: 40, avoirs: 17 },
  { date: 'Juillet', articlesCommandes: 110, commandes: 50, facturesPayees: 45, avoirs: 20 },
  { date: 'Août', articlesCommandes: 20, commandes: 55, facturesPayees: 50, avoirs: 22 },
  { date: 'Septembre', articlesCommandes: 130, commandes: 60, facturesPayees: 55, avoirs: 25 },
  { date: 'Octobre', articlesCommandes: 140, commandes: 65, facturesPayees: 60, avoirs: 27 },
  { date: 'Novembre', articlesCommandes: 15, commandes: 70, facturesPayees: 100, avoirs: 30 },
  { date: 'Décembre', articlesCommandes: 160, commandes: 75, facturesPayees: 70, avoirs: 35 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#0ed145', '#f262bd', '#FF19A2', '#A2FF19'];

const Home = () => {
  const user = useAppSelector(state => state.authentication.account);

  return (
    <div>
      {user && user.authorities && user.authorities.includes('ROLE_ADMIN') ? (
        <>
          <h1>Dashboard</h1>
          <br />
          <div style={{ display: 'flex', flexWrap: 'wrap' , width: '100%' , margin:"auto"}}>
            <div style={{ flex: '1 1 50%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={dataAnnuel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="articlesCommandes" stroke={COLORS[0]} name="Articles Commandés par année" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: '1 1 50%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dataMensuel}
                    name="Facture"
                    dataKey="facturesPayees"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ date, value }) => `${date}: ${value}`}
                  >
                    {dataMensuel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: '1 1 50%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={dataMensuel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="articlesCommandes" fill={COLORS[0]} name="Articles Commandés par mois" />
                  <Bar dataKey="commandes" fill={COLORS[1]} name="Commandes par mois" />
                  <Bar dataKey="facturesPayees" fill={COLORS[2]} name="Factures Payées par mois" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: '1 1 50%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={dataAnnuel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avoirs" fill={COLORS[0]} name="Avoirs Générés par année" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ width: '85%', margin: 'auto' }}>

          <Table striped>
            <thead>
              <tr>
                <th>Date</th>
                <th>Articles Commandés</th>
                <th>Commandes</th>
                <th>Factures Payées</th>
                <th>Avoirs</th>
              </tr>
            </thead>
            <tbody>
              {dataMensuel.map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.articlesCommandes}</td>
                  <td>{row.commandes}</td>
                  <td>{row.facturesPayees}</td>
                  <td>{row.avoirs}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        </>
      ) : (
        <Row>
          <Col md="16" className="d-flex align-items-center">
            <img src="content/images/michelin.png" alt="Logo" />
            <div>
              <h2>Welcome</h2>
              <p className="lead">
                <Translate contentKey="home.subtitle">This is your homepage</Translate>
              </p>
              <p></p>
              {user?.login ? (
                <Alert color="success">
                  <Translate contentKey="home.logged.message" interpolate={{ username: user.login }}>
                    You are logged in as user {user.login}.
                  </Translate>
                </Alert>
              ) : (
                <Alert color="warning">
                  <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
                  <Link to="/login" className="alert-link">
                    <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
                  </Link>
                  <Translate contentKey="global.messages.info.authenticated.suffix">
                    , you can try the default accounts:
                    <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                    <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
                  </Translate>
                </Alert>
              )}
              <h4>La gamme Michelin Collection vous propose:</h4>
              <ul>
                <li>L’étendue de gamme la plus large du marché (enrichie par l’apport régulier de nouvelles dimensions)</li>
                <li>Longévité de la carcasse</li>
                <li>Préservation de la valeur de votre automobile</li>
                <li>Technologie moderne</li>
                <li>Respect de l’authenticité historique des véhicules</li>
              </ul>
            </div>
          </Col>
          <Col md="12"></Col>
        </Row>
      )}
    </div>
  );
};

export default Home;
