package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LignesBordereau.
 */
@Entity
@Table(name = "lignes_bordereau")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LignesBordereau implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "quantite")
    private Integer quantite;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "clientBordereaus", "lignesBordereaus", "lignesDocuments" }, allowSetters = true)
    private Bordereau bordereaus;

    @ManyToOne
    @JsonIgnoreProperties(value = { "tarifs", "lignesBordereaus", "detailsDemandes" }, allowSetters = true)
    private Article articles;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LignesBordereau id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantite() {
        return this.quantite;
    }

    public LignesBordereau quantite(Integer quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public LignesBordereau dateDebut(LocalDate dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return this.dateFin;
    }

    public LignesBordereau dateFin(LocalDate dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Bordereau getBordereaus() {
        return this.bordereaus;
    }

    public void setBordereaus(Bordereau bordereau) {
        this.bordereaus = bordereau;
    }

    public LignesBordereau bordereaus(Bordereau bordereau) {
        this.setBordereaus(bordereau);
        return this;
    }

    public Article getArticles() {
        return this.articles;
    }

    public void setArticles(Article article) {
        this.articles = article;
    }

    public LignesBordereau articles(Article article) {
        this.setArticles(article);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LignesBordereau)) {
            return false;
        }
        return id != null && id.equals(((LignesBordereau) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LignesBordereau{" +
            "id=" + getId() +
            ", quantite=" + getQuantite() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            "}";
    }
}
