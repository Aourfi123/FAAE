package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DetailsDemande.
 */
@Entity
@Table(name = "details_demande")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DetailsDemande implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "quantite")
    private Integer quantite;

    @Column(name = "etat")
    private String etat;

    @ManyToOne
    @JsonIgnoreProperties(value = { "tarifs", "lignesBordereaus", "detailsDemandes" }, allowSetters = true)
    private Article articles;

    @ManyToOne
    @JsonIgnoreProperties(value = { "detailsDemandes" }, allowSetters = true)
    private DemandeRembourssement demandeRemboursements;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DetailsDemande id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantite() {
        return this.quantite;
    }

    public DetailsDemande quantite(Integer quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public String getEtat() {
        return this.etat;
    }

    public DetailsDemande etat(String etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public Article getArticles() {
        return this.articles;
    }

    public void setArticles(Article article) {
        this.articles = article;
    }

    public DetailsDemande articles(Article article) {
        this.setArticles(article);
        return this;
    }

    public DemandeRembourssement getDemandeRemboursements() {
        return this.demandeRemboursements;
    }

    public void setDemandeRemboursements(DemandeRembourssement demandeRembourssement) {
        this.demandeRemboursements = demandeRembourssement;
    }

    public DetailsDemande demandeRemboursements(DemandeRembourssement demandeRembourssement) {
        this.setDemandeRemboursements(demandeRembourssement);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DetailsDemande)) {
            return false;
        }
        return id != null && id.equals(((DetailsDemande) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DetailsDemande{" +
            "id=" + getId() +
            ", quantite=" + getQuantite() +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
