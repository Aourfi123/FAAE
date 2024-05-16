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
 * A Bordereau.
 */
@Entity
@Table(name = "bordereau")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Bordereau implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "reference")
    private String reference;

    @Column(name = "etat")
    private String etat;

    @Column(name = "montant_total")
    private Float montantTotal;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Column(name = "date_modification")
    private LocalDate dateModification;

    @OneToMany(mappedBy = "bordereaus")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bordereaus", "clients" }, allowSetters = true)
    private Set<ClientBordereau> clientBordereaus = new HashSet<>();

    @OneToMany(mappedBy = "bordereaus")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bordereaus", "articles" }, allowSetters = true)
    private Set<LignesBordereau> lignesBordereaus = new HashSet<>();

    @OneToMany(mappedBy = "bordereaus")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bordereaus", "documents" }, allowSetters = true)
    private Set<LignesDocument> lignesDocuments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bordereau id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return this.reference;
    }

    public Bordereau reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getEtat() {
        return this.etat;
    }

    public Bordereau etat(String etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public Float getMontantTotal() {
        return this.montantTotal;
    }

    public Bordereau montantTotal(Float montantTotal) {
        this.setMontantTotal(montantTotal);
        return this;
    }

    public void setMontantTotal(Float montantTotal) {
        this.montantTotal = montantTotal;
    }

    public LocalDate getDateCreation() {
        return this.dateCreation;
    }

    public Bordereau dateCreation(LocalDate dateCreation) {
        this.setDateCreation(dateCreation);
        return this;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDate getDateModification() {
        return this.dateModification;
    }

    public Bordereau dateModification(LocalDate dateModification) {
        this.setDateModification(dateModification);
        return this;
    }

    public void setDateModification(LocalDate dateModification) {
        this.dateModification = dateModification;
    }

    public Set<ClientBordereau> getClientBordereaus() {
        return this.clientBordereaus;
    }

    public void setClientBordereaus(Set<ClientBordereau> clientBordereaus) {
        if (this.clientBordereaus != null) {
            this.clientBordereaus.forEach(i -> i.setBordereaus(null));
        }
        if (clientBordereaus != null) {
            clientBordereaus.forEach(i -> i.setBordereaus(this));
        }
        this.clientBordereaus = clientBordereaus;
    }

    public Bordereau clientBordereaus(Set<ClientBordereau> clientBordereaus) {
        this.setClientBordereaus(clientBordereaus);
        return this;
    }

    public Bordereau addClientBordereaus(ClientBordereau clientBordereau) {
        this.clientBordereaus.add(clientBordereau);
        clientBordereau.setBordereaus(this);
        return this;
    }

    public Bordereau removeClientBordereaus(ClientBordereau clientBordereau) {
        this.clientBordereaus.remove(clientBordereau);
        clientBordereau.setBordereaus(null);
        return this;
    }

    public Set<LignesBordereau> getLignesBordereaus() {
        return this.lignesBordereaus;
    }

    public void setLignesBordereaus(Set<LignesBordereau> lignesBordereaus) {
        if (this.lignesBordereaus != null) {
            this.lignesBordereaus.forEach(i -> i.setBordereaus(null));
        }
        if (lignesBordereaus != null) {
            lignesBordereaus.forEach(i -> i.setBordereaus(this));
        }
        this.lignesBordereaus = lignesBordereaus;
    }

    public Bordereau lignesBordereaus(Set<LignesBordereau> lignesBordereaus) {
        this.setLignesBordereaus(lignesBordereaus);
        return this;
    }

    public Bordereau addLignesBordereaus(LignesBordereau lignesBordereau) {
        this.lignesBordereaus.add(lignesBordereau);
        lignesBordereau.setBordereaus(this);
        return this;
    }

    public Bordereau removeLignesBordereaus(LignesBordereau lignesBordereau) {
        this.lignesBordereaus.remove(lignesBordereau);
        lignesBordereau.setBordereaus(null);
        return this;
    }

    public Set<LignesDocument> getLignesDocuments() {
        return this.lignesDocuments;
    }

    public void setLignesDocuments(Set<LignesDocument> lignesDocuments) {
        if (this.lignesDocuments != null) {
            this.lignesDocuments.forEach(i -> i.setBordereaus(null));
        }
        if (lignesDocuments != null) {
            lignesDocuments.forEach(i -> i.setBordereaus(this));
        }
        this.lignesDocuments = lignesDocuments;
    }

    public Bordereau lignesDocuments(Set<LignesDocument> lignesDocuments) {
        this.setLignesDocuments(lignesDocuments);
        return this;
    }

    public Bordereau addLignesDocuments(LignesDocument lignesDocument) {
        this.lignesDocuments.add(lignesDocument);
        lignesDocument.setBordereaus(this);
        return this;
    }

    public Bordereau removeLignesDocuments(LignesDocument lignesDocument) {
        this.lignesDocuments.remove(lignesDocument);
        lignesDocument.setBordereaus(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bordereau)) {
            return false;
        }
        return id != null && id.equals(((Bordereau) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bordereau{" +
            "id=" + getId() +
            ", reference='" + getReference() + "'" +
            ", etat='" + getEtat() + "'" +
            ", montantTotal=" + getMontantTotal() +
            ", dateCreation='" + getDateCreation() + "'" +
            ", dateModification='" + getDateModification() + "'" +
            "}";
    }
}
