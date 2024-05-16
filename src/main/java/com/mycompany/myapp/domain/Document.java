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
 * A Document.
 */
@Entity
@Table(name = "document")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Document implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "reference")
    private String reference;

    @Column(name = "montant_total")
    private Float montantTotal;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @Column(name = "date_modification")
    private LocalDate dateModification;

    @JsonIgnoreProperties(value = { "document" }, allowSetters = true)
    @OneToOne(mappedBy = "document")
    private Avoir avoir;

    @JsonIgnoreProperties(value = { "document", "paiement" }, allowSetters = true)
    @OneToOne(mappedBy = "document")
    private Facture facture;

    @OneToMany(mappedBy = "documents")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bordereaus", "documents" }, allowSetters = true)
    private Set<LignesDocument> lignesDocuments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Document id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Document code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getReference() {
        return this.reference;
    }

    public Document reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Float getMontantTotal() {
        return this.montantTotal;
    }

    public Document montantTotal(Float montantTotal) {
        this.setMontantTotal(montantTotal);
        return this;
    }

    public void setMontantTotal(Float montantTotal) {
        this.montantTotal = montantTotal;
    }

    public LocalDate getDateCreation() {
        return this.dateCreation;
    }

    public Document dateCreation(LocalDate dateCreation) {
        this.setDateCreation(dateCreation);
        return this;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDate getDateModification() {
        return this.dateModification;
    }

    public Document dateModification(LocalDate dateModification) {
        this.setDateModification(dateModification);
        return this;
    }

    public void setDateModification(LocalDate dateModification) {
        this.dateModification = dateModification;
    }

    public Avoir getAvoir() {
        return this.avoir;
    }

    public void setAvoir(Avoir avoir) {
        if (this.avoir != null) {
            this.avoir.setDocument(null);
        }
        if (avoir != null) {
            avoir.setDocument(this);
        }
        this.avoir = avoir;
    }

    public Document avoir(Avoir avoir) {
        this.setAvoir(avoir);
        return this;
    }

    public Facture getFacture() {
        return this.facture;
    }

    public void setFacture(Facture facture) {
        if (this.facture != null) {
            this.facture.setDocument(null);
        }
        if (facture != null) {
            facture.setDocument(this);
        }
        this.facture = facture;
    }

    public Document facture(Facture facture) {
        this.setFacture(facture);
        return this;
    }

    public Set<LignesDocument> getLignesDocuments() {
        return this.lignesDocuments;
    }

    public void setLignesDocuments(Set<LignesDocument> lignesDocuments) {
        if (this.lignesDocuments != null) {
            this.lignesDocuments.forEach(i -> i.setDocuments(null));
        }
        if (lignesDocuments != null) {
            lignesDocuments.forEach(i -> i.setDocuments(this));
        }
        this.lignesDocuments = lignesDocuments;
    }

    public Document lignesDocuments(Set<LignesDocument> lignesDocuments) {
        this.setLignesDocuments(lignesDocuments);
        return this;
    }

    public Document addLignesDocuments(LignesDocument lignesDocument) {
        this.lignesDocuments.add(lignesDocument);
        lignesDocument.setDocuments(this);
        return this;
    }

    public Document removeLignesDocuments(LignesDocument lignesDocument) {
        this.lignesDocuments.remove(lignesDocument);
        lignesDocument.setDocuments(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Document)) {
            return false;
        }
        return id != null && id.equals(((Document) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Document{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", reference='" + getReference() + "'" +
            ", montantTotal=" + getMontantTotal() +
            ", dateCreation='" + getDateCreation() + "'" +
            ", dateModification='" + getDateModification() + "'" +
            "}";
    }
}
