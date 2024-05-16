package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DemandeRembourssement.
 */
@Entity
@Table(name = "demande_rembourssement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DemandeRembourssement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "raison")
    private String raison;

    @Lob
    @Column(name = "piece_jointe")
    private byte[] pieceJointe;

    @Column(name = "piece_jointe_content_type")
    private String pieceJointeContentType;

    @Column(name = "etat")
    private String etat;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Column(name = "date_modification")
    private LocalDate dateModification;

    @OneToMany(mappedBy = "demandeRemboursements")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "articles", "demandeRemboursements" }, allowSetters = true)
    private Set<DetailsDemande> detailsDemandes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DemandeRembourssement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRaison() {
        return this.raison;
    }

    public DemandeRembourssement raison(String raison) {
        this.setRaison(raison);
        return this;
    }

    public void setRaison(String raison) {
        this.raison = raison;
    }

    public byte[] getPieceJointe() {
        return this.pieceJointe;
    }

    public DemandeRembourssement pieceJointe(byte[] pieceJointe) {
        this.setPieceJointe(pieceJointe);
        return this;
    }

    public void setPieceJointe(byte[] pieceJointe) {
        this.pieceJointe = pieceJointe;
    }

    public String getPieceJointeContentType() {
        return this.pieceJointeContentType;
    }

    public DemandeRembourssement pieceJointeContentType(String pieceJointeContentType) {
        this.pieceJointeContentType = pieceJointeContentType;
        return this;
    }

    public void setPieceJointeContentType(String pieceJointeContentType) {
        this.pieceJointeContentType = pieceJointeContentType;
    }

    public String getEtat() {
        return this.etat;
    }

    public DemandeRembourssement etat(String etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public LocalDate getDateCreation() {
        return this.dateCreation;
    }

    public DemandeRembourssement dateCreation(LocalDate dateCreation) {
        this.setDateCreation(dateCreation);
        return this;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDate getDateModification() {
        return this.dateModification;
    }

    public DemandeRembourssement dateModification(LocalDate dateModification) {
        this.setDateModification(dateModification);
        return this;
    }

    public void setDateModification(LocalDate dateModification) {
        this.dateModification = dateModification;
    }

    public Set<DetailsDemande> getDetailsDemandes() {
        return this.detailsDemandes;
    }

    public void setDetailsDemandes(Set<DetailsDemande> detailsDemandes) {
        if (this.detailsDemandes != null) {
            this.detailsDemandes.forEach(i -> i.setDemandeRemboursements(null));
        }
        if (detailsDemandes != null) {
            detailsDemandes.forEach(i -> i.setDemandeRemboursements(this));
        }
        this.detailsDemandes = detailsDemandes;
    }

    public DemandeRembourssement detailsDemandes(Set<DetailsDemande> detailsDemandes) {
        this.setDetailsDemandes(detailsDemandes);
        return this;
    }

    public DemandeRembourssement addDetailsDemandes(DetailsDemande detailsDemande) {
        this.detailsDemandes.add(detailsDemande);
        detailsDemande.setDemandeRemboursements(this);
        return this;
    }

    public DemandeRembourssement removeDetailsDemandes(DetailsDemande detailsDemande) {
        this.detailsDemandes.remove(detailsDemande);
        detailsDemande.setDemandeRemboursements(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DemandeRembourssement)) {
            return false;
        }
        return id != null && id.equals(((DemandeRembourssement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DemandeRembourssement{" +
            "id=" + getId() +
            ", raison='" + getRaison() + "'" +
            ", pieceJointe='" + getPieceJointe() + "'" +
            ", pieceJointeContentType='" + getPieceJointeContentType() + "'" +
            ", etat='" + getEtat() + "'" +
            ", dateCreation='" + getDateCreation() + "'" +
            ", dateModification='" + getDateModification() + "'" +
            "}";
    }
}
