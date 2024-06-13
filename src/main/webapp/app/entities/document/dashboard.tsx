import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Invoice.css';
import { width, height } from '@fortawesome/free-solid-svg-icons/faCogs';

const Invoice = () => {
  const handleDownload = () => {
    const input = document.getElementById('invoice-container');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 200;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const marginLeft = 5; // Ajustez cette valeur selon la marge désirée
        pdf.addImage(imgData, 'PNG', marginLeft, 0, imgWidth, imgHeight);
        pdf.save('facture.pdf');
      });
  };

  return (
    <div>
      <button onClick={handleDownload}>Télécharger</button>
      <div id="invoice-container" className="invoice-container">
        <div className="header">
          <h1>Facture</h1>
          <div className="logo">
            <img src="content/images/logo michelin.jpg" style={{ width:"80px" , height:"80px"}}/>
          </div>
        </div>
        <div className="info">
          <div className="vendor">
            <h2>Vendeur</h2>
            <p>Mon Entreprise</p>
            <p>22, Avenue Voltaire</p>
            <p>13000 Marseille</p>
          </div>
          <div className="client">
            <h2>Client</h2>
            <p>Michel Acheteur</p>
            <p>31, rue de la Forêt</p>
            <p>13100 Aix-en-Provence</p>
          </div>
        </div>
        <div className="details">
          <div className="date">
            <p>Date de facturation: 2.8.2021</p>
          </div>
          <div className="facture-num">
            <p>Numéro de facture: 143</p>
          </div>
          <div className="echeance">
            <p>Échéance: 16.6.2021</p>
          </div>
          <div className="paiement">
            <p>Paiement: 30 jours</p>
          </div>
          <div className="reference">
            <p>Référence: 1436</p>
          </div>
        </div>
        <div className="additional-info">
          <p>Informations additionnelles :</p>
          <p>Service Après Vente : Garantie 1 an.</p>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantité</th>
              <th>Unité</th>
              <th>Prix unitaire HT</th>
              <th>% TVA</th>
              <th>Total TVA</th>
              <th>Total TTC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Main-d'œuvre</td>
              <td>5</td>
              <td>h</td>
              <td>60,00 €</td>
              <td>20 %</td>
              <td>60,00 €</td>
              <td>360,00 €</td>
            </tr>
            <tr>
              <td>Produit</td>
              <td>10</td>
              <td>pcs</td>
              <td>105,00 €</td>
              <td>20 %</td>
              <td>210,00 €</td>
              <td>1 260,00 €</td>
            </tr>
          </tbody>
        </table>

        <div className="totals">
          <p>Total HT: 1 350,00 €</p>
          <p>Total TVA: 270,00 €</p>
          <p>Total TTC: 1 620,00 €</p>
        </div>

      </div>
    </div>
  );
};

export default Invoice;
