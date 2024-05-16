package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SocieteCommerciale.
 */
@Entity
@Table(name = "societe_commerciale")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SocieteCommerciale implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code_pays")
    private String codePays;

    @Column(name = "libelle")
    private String libelle;

    @Column(name = "devise")
    private String devise;

    @OneToMany(mappedBy = "societeCommercial")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "societeCommercial", "tarifs" }, allowSetters = true)
    private Set<Reduction> societeCommerciales = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SocieteCommerciale id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodePays() {
        return this.codePays;
    }

    public SocieteCommerciale codePays(String codePays) {
        this.setCodePays(codePays);
        return this;
    }

    public void setCodePays(String codePays) {
        this.codePays = codePays;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public SocieteCommerciale libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getDevise() {
        return this.devise;
    }

    public SocieteCommerciale devise(String devise) {
        this.setDevise(devise);
        return this;
    }

    public void setDevise(String devise) {
        this.devise = devise;
    }

    public Set<Reduction> getSocieteCommerciales() {
        return this.societeCommerciales;
    }

    public void setSocieteCommerciales(Set<Reduction> reductions) {
        if (this.societeCommerciales != null) {
            this.societeCommerciales.forEach(i -> i.setSocieteCommercial(null));
        }
        if (reductions != null) {
            reductions.forEach(i -> i.setSocieteCommercial(this));
        }
        this.societeCommerciales = reductions;
    }

    public SocieteCommerciale societeCommerciales(Set<Reduction> reductions) {
        this.setSocieteCommerciales(reductions);
        return this;
    }

    public SocieteCommerciale addSocieteCommerciale(Reduction reduction) {
        this.societeCommerciales.add(reduction);
        reduction.setSocieteCommercial(this);
        return this;
    }

    public SocieteCommerciale removeSocieteCommerciale(Reduction reduction) {
        this.societeCommerciales.remove(reduction);
        reduction.setSocieteCommercial(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SocieteCommerciale)) {
            return false;
        }
        return id != null && id.equals(((SocieteCommerciale) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SocieteCommerciale{" +
            "id=" + getId() +
            ", codePays='" + getCodePays() + "'" +
            ", libelle='" + getLibelle() + "'" +
            ", devise='" + getDevise() + "'" +
            "}";
    }
}
