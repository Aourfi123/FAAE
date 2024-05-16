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
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "cin")
    private String cin;

    @Lob
    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photo_content_type")
    private String photoContentType;

    @Column(name = "numero_telephone")
    private Double numeroTelephone;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(name = "nationalite")
    private String nationalite;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "genre")
    private String genre;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "clients")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bordereaus", "clients" }, allowSetters = true)
    private Set<ClientBordereau> clientBordereaus = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCin() {
        return this.cin;
    }

    public Client cin(String cin) {
        this.setCin(cin);
        return this;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Client photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Client photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public Double getNumeroTelephone() {
        return this.numeroTelephone;
    }

    public Client numeroTelephone(Double numeroTelephone) {
        this.setNumeroTelephone(numeroTelephone);
        return this;
    }

    public void setNumeroTelephone(Double numeroTelephone) {
        this.numeroTelephone = numeroTelephone;
    }

    public LocalDate getDateNaissance() {
        return this.dateNaissance;
    }

    public Client dateNaissance(LocalDate dateNaissance) {
        this.setDateNaissance(dateNaissance);
        return this;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getNationalite() {
        return this.nationalite;
    }

    public Client nationalite(String nationalite) {
        this.setNationalite(nationalite);
        return this;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public Client adresse(String adresse) {
        this.setAdresse(adresse);
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getGenre() {
        return this.genre;
    }

    public Client genre(String genre) {
        this.setGenre(genre);
        return this;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Client user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<ClientBordereau> getClientBordereaus() {
        return this.clientBordereaus;
    }

    public void setClientBordereaus(Set<ClientBordereau> clientBordereaus) {
        if (this.clientBordereaus != null) {
            this.clientBordereaus.forEach(i -> i.setClients(null));
        }
        if (clientBordereaus != null) {
            clientBordereaus.forEach(i -> i.setClients(this));
        }
        this.clientBordereaus = clientBordereaus;
    }

    public Client clientBordereaus(Set<ClientBordereau> clientBordereaus) {
        this.setClientBordereaus(clientBordereaus);
        return this;
    }

    public Client addClientBordereaus(ClientBordereau clientBordereau) {
        this.clientBordereaus.add(clientBordereau);
        clientBordereau.setClients(this);
        return this;
    }

    public Client removeClientBordereaus(ClientBordereau clientBordereau) {
        this.clientBordereaus.remove(clientBordereau);
        clientBordereau.setClients(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return id != null && id.equals(((Client) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", cin='" + getCin() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            ", numeroTelephone=" + getNumeroTelephone() +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", nationalite='" + getNationalite() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", genre='" + getGenre() + "'" +
            "}";
    }
}
