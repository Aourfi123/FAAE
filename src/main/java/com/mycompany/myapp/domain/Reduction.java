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
 * A Reduction.
 */
@Entity
@Table(name = "reduction")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Reduction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "type_operation")
    private String typeOperation;

    @Column(name = "pourcentage")
    private Float pourcentage;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "societeCommerciales" }, allowSetters = true)
    private SocieteCommerciale societeCommercial;

    @OneToMany(mappedBy = "reductions")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reductions", "articles" }, allowSetters = true)
    private Set<Tarif> tarifs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reduction id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Reduction description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTypeOperation() {
        return this.typeOperation;
    }

    public Reduction typeOperation(String typeOperation) {
        this.setTypeOperation(typeOperation);
        return this;
    }

    public void setTypeOperation(String typeOperation) {
        this.typeOperation = typeOperation;
    }

    public Float getPourcentage() {
        return this.pourcentage;
    }

    public Reduction pourcentage(Float pourcentage) {
        this.setPourcentage(pourcentage);
        return this;
    }

    public void setPourcentage(Float pourcentage) {
        this.pourcentage = pourcentage;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public Reduction dateDebut(LocalDate dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return this.dateFin;
    }

    public Reduction dateFin(LocalDate dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public SocieteCommerciale getSocieteCommercial() {
        return this.societeCommercial;
    }

    public void setSocieteCommercial(SocieteCommerciale societeCommerciale) {
        this.societeCommercial = societeCommerciale;
    }

    public Reduction societeCommercial(SocieteCommerciale societeCommerciale) {
        this.setSocieteCommercial(societeCommerciale);
        return this;
    }

    public Set<Tarif> getTarifs() {
        return this.tarifs;
    }

    public void setTarifs(Set<Tarif> tarifs) {
        if (this.tarifs != null) {
            this.tarifs.forEach(i -> i.setReductions(null));
        }
        if (tarifs != null) {
            tarifs.forEach(i -> i.setReductions(this));
        }
        this.tarifs = tarifs;
    }

    public Reduction tarifs(Set<Tarif> tarifs) {
        this.setTarifs(tarifs);
        return this;
    }

    public Reduction addTarifs(Tarif tarif) {
        this.tarifs.add(tarif);
        tarif.setReductions(this);
        return this;
    }

    public Reduction removeTarifs(Tarif tarif) {
        this.tarifs.remove(tarif);
        tarif.setReductions(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reduction)) {
            return false;
        }
        return id != null && id.equals(((Reduction) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reduction{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", typeOperation='" + getTypeOperation() + "'" +
            ", pourcentage=" + getPourcentage() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            "}";
    }
}
