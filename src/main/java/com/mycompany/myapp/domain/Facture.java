package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Facture.
 */
@Entity
@Table(name = "facture")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Facture implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "etat")
    private String etat;

    @JsonIgnoreProperties(value = { "avoir", "facture", "lignesDocuments" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Document document;

    @JsonIgnoreProperties(value = { "facture" }, allowSetters = true)
    @OneToOne(mappedBy = "facture")
    private Paiement paiement;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Facture id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Facture code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEtat() {
        return this.etat;
    }

    public Facture etat(String etat) {
        this.setEtat(etat);
        return this;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public Document getDocument() {
        return this.document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public Facture document(Document document) {
        this.setDocument(document);
        return this;
    }

    public Paiement getPaiement() {
        return this.paiement;
    }

    public void setPaiement(Paiement paiement) {
        if (this.paiement != null) {
            this.paiement.setFacture(null);
        }
        if (paiement != null) {
            paiement.setFacture(this);
        }
        this.paiement = paiement;
    }

    public Facture paiement(Paiement paiement) {
        this.setPaiement(paiement);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Facture)) {
            return false;
        }
        return id != null && id.equals(((Facture) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Facture{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", etat='" + getEtat() + "'" +
            "}";
    }
}
