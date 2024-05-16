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
 * A Article.
 */
@Entity
@Table(name = "article")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Article implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "modele")
    private String modele;

    @Column(name = "largeur_pneus")
    private Float largeurPneus;

    @Column(name = "hauteur_pneus")
    private Float hauteurPneus;

    @Column(name = "type_pneus")
    private String typePneus;

    @Column(name = "diametre")
    private Float diametre;

    @Lob
    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photo_content_type")
    private String photoContentType;

    @Column(name = "date_creation")
    private LocalDate dateCreation;

    @OneToMany(mappedBy = "articles")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reductions", "articles" }, allowSetters = true)
    private Set<Tarif> tarifs = new HashSet<>();

    @OneToMany(mappedBy = "articles")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bordereaus", "articles" }, allowSetters = true)
    private Set<LignesBordereau> lignesBordereaus = new HashSet<>();

    @OneToMany(mappedBy = "articles")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "articles", "demandeRemboursements" }, allowSetters = true)
    private Set<DetailsDemande> detailsDemandes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Article id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModele() {
        return this.modele;
    }

    public Article modele(String modele) {
        this.setModele(modele);
        return this;
    }

    public void setModele(String modele) {
        this.modele = modele;
    }

    public Float getLargeurPneus() {
        return this.largeurPneus;
    }

    public Article largeurPneus(Float largeurPneus) {
        this.setLargeurPneus(largeurPneus);
        return this;
    }

    public void setLargeurPneus(Float largeurPneus) {
        this.largeurPneus = largeurPneus;
    }

    public Float getHauteurPneus() {
        return this.hauteurPneus;
    }

    public Article hauteurPneus(Float hauteurPneus) {
        this.setHauteurPneus(hauteurPneus);
        return this;
    }

    public void setHauteurPneus(Float hauteurPneus) {
        this.hauteurPneus = hauteurPneus;
    }

    public String getTypePneus() {
        return this.typePneus;
    }

    public Article typePneus(String typePneus) {
        this.setTypePneus(typePneus);
        return this;
    }

    public void setTypePneus(String typePneus) {
        this.typePneus = typePneus;
    }

    public Float getDiametre() {
        return this.diametre;
    }

    public Article diametre(Float diametre) {
        this.setDiametre(diametre);
        return this;
    }

    public void setDiametre(Float diametre) {
        this.diametre = diametre;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Article photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Article photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public LocalDate getDateCreation() {
        return this.dateCreation;
    }

    public Article dateCreation(LocalDate dateCreation) {
        this.setDateCreation(dateCreation);
        return this;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public Set<Tarif> getTarifs() {
        return this.tarifs;
    }

    public void setTarifs(Set<Tarif> tarifs) {
        if (this.tarifs != null) {
            this.tarifs.forEach(i -> i.setArticles(null));
        }
        if (tarifs != null) {
            tarifs.forEach(i -> i.setArticles(this));
        }
        this.tarifs = tarifs;
    }

    public Article tarifs(Set<Tarif> tarifs) {
        this.setTarifs(tarifs);
        return this;
    }

    public Article addTarifs(Tarif tarif) {
        this.tarifs.add(tarif);
        tarif.setArticles(this);
        return this;
    }

    public Article removeTarifs(Tarif tarif) {
        this.tarifs.remove(tarif);
        tarif.setArticles(null);
        return this;
    }

    public Set<LignesBordereau> getLignesBordereaus() {
        return this.lignesBordereaus;
    }

    public void setLignesBordereaus(Set<LignesBordereau> lignesBordereaus) {
        if (this.lignesBordereaus != null) {
            this.lignesBordereaus.forEach(i -> i.setArticles(null));
        }
        if (lignesBordereaus != null) {
            lignesBordereaus.forEach(i -> i.setArticles(this));
        }
        this.lignesBordereaus = lignesBordereaus;
    }

    public Article lignesBordereaus(Set<LignesBordereau> lignesBordereaus) {
        this.setLignesBordereaus(lignesBordereaus);
        return this;
    }

    public Article addLignesBordereau(LignesBordereau lignesBordereau) {
        this.lignesBordereaus.add(lignesBordereau);
        lignesBordereau.setArticles(this);
        return this;
    }

    public Article removeLignesBordereau(LignesBordereau lignesBordereau) {
        this.lignesBordereaus.remove(lignesBordereau);
        lignesBordereau.setArticles(null);
        return this;
    }

    public Set<DetailsDemande> getDetailsDemandes() {
        return this.detailsDemandes;
    }

    public void setDetailsDemandes(Set<DetailsDemande> detailsDemandes) {
        if (this.detailsDemandes != null) {
            this.detailsDemandes.forEach(i -> i.setArticles(null));
        }
        if (detailsDemandes != null) {
            detailsDemandes.forEach(i -> i.setArticles(this));
        }
        this.detailsDemandes = detailsDemandes;
    }

    public Article detailsDemandes(Set<DetailsDemande> detailsDemandes) {
        this.setDetailsDemandes(detailsDemandes);
        return this;
    }

    public Article addDetailsDemandes(DetailsDemande detailsDemande) {
        this.detailsDemandes.add(detailsDemande);
        detailsDemande.setArticles(this);
        return this;
    }

    public Article removeDetailsDemandes(DetailsDemande detailsDemande) {
        this.detailsDemandes.remove(detailsDemande);
        detailsDemande.setArticles(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Article)) {
            return false;
        }
        return id != null && id.equals(((Article) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Article{" +
            "id=" + getId() +
            ", modele='" + getModele() + "'" +
            ", largeurPneus=" + getLargeurPneus() +
            ", hauteurPneus=" + getHauteurPneus() +
            ", typePneus='" + getTypePneus() + "'" +
            ", diametre=" + getDiametre() +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            ", dateCreation='" + getDateCreation() + "'" +
            "}";
    }
}
