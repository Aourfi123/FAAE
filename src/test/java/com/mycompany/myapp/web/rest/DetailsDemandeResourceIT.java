package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.DetailsDemande;
import com.mycompany.myapp.repository.DetailsDemandeRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DetailsDemandeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DetailsDemandeResourceIT {

    private static final Integer DEFAULT_QUANTITE = 1;
    private static final Integer UPDATED_QUANTITE = 2;

    private static final String DEFAULT_ETAT = "AAAAAAAAAA";
    private static final String UPDATED_ETAT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/details-demandes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DetailsDemandeRepository detailsDemandeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDetailsDemandeMockMvc;

    private DetailsDemande detailsDemande;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DetailsDemande createEntity(EntityManager em) {
        DetailsDemande detailsDemande = new DetailsDemande().quantite(DEFAULT_QUANTITE).etat(DEFAULT_ETAT);
        return detailsDemande;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DetailsDemande createUpdatedEntity(EntityManager em) {
        DetailsDemande detailsDemande = new DetailsDemande().quantite(UPDATED_QUANTITE).etat(UPDATED_ETAT);
        return detailsDemande;
    }

    @BeforeEach
    public void initTest() {
        detailsDemande = createEntity(em);
    }

    @Test
    @Transactional
    void createDetailsDemande() throws Exception {
        int databaseSizeBeforeCreate = detailsDemandeRepository.findAll().size();
        // Create the DetailsDemande
        restDetailsDemandeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(detailsDemande))
            )
            .andExpect(status().isCreated());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeCreate + 1);
        DetailsDemande testDetailsDemande = detailsDemandeList.get(detailsDemandeList.size() - 1);
        assertThat(testDetailsDemande.getQuantite()).isEqualTo(DEFAULT_QUANTITE);
        assertThat(testDetailsDemande.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void createDetailsDemandeWithExistingId() throws Exception {
        // Create the DetailsDemande with an existing ID
        detailsDemande.setId(1L);

        int databaseSizeBeforeCreate = detailsDemandeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDetailsDemandeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(detailsDemande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDetailsDemandes() throws Exception {
        // Initialize the database
        detailsDemandeRepository.saveAndFlush(detailsDemande);

        // Get all the detailsDemandeList
        restDetailsDemandeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(detailsDemande.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantite").value(hasItem(DEFAULT_QUANTITE)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT)));
    }

    @Test
    @Transactional
    void getDetailsDemande() throws Exception {
        // Initialize the database
        detailsDemandeRepository.saveAndFlush(detailsDemande);

        // Get the detailsDemande
        restDetailsDemandeMockMvc
            .perform(get(ENTITY_API_URL_ID, detailsDemande.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(detailsDemande.getId().intValue()))
            .andExpect(jsonPath("$.quantite").value(DEFAULT_QUANTITE))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT));
    }

    @Test
    @Transactional
    void getNonExistingDetailsDemande() throws Exception {
        // Get the detailsDemande
        restDetailsDemandeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDetailsDemande() throws Exception {
        // Initialize the database
        detailsDemandeRepository.saveAndFlush(detailsDemande);

        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();

        // Update the detailsDemande
        DetailsDemande updatedDetailsDemande = detailsDemandeRepository.findById(detailsDemande.getId()).get();
        // Disconnect from session so that the updates on updatedDetailsDemande are not directly saved in db
        em.detach(updatedDetailsDemande);
        updatedDetailsDemande.quantite(UPDATED_QUANTITE).etat(UPDATED_ETAT);

        restDetailsDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDetailsDemande.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDetailsDemande))
            )
            .andExpect(status().isOk());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
        DetailsDemande testDetailsDemande = detailsDemandeList.get(detailsDemandeList.size() - 1);
        assertThat(testDetailsDemande.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testDetailsDemande.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void putNonExistingDetailsDemande() throws Exception {
        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();
        detailsDemande.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetailsDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, detailsDemande.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(detailsDemande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDetailsDemande() throws Exception {
        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();
        detailsDemande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailsDemandeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(detailsDemande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDetailsDemande() throws Exception {
        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();
        detailsDemande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailsDemandeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(detailsDemande)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDetailsDemandeWithPatch() throws Exception {
        // Initialize the database
        detailsDemandeRepository.saveAndFlush(detailsDemande);

        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();

        // Update the detailsDemande using partial update
        DetailsDemande partialUpdatedDetailsDemande = new DetailsDemande();
        partialUpdatedDetailsDemande.setId(detailsDemande.getId());

        partialUpdatedDetailsDemande.quantite(UPDATED_QUANTITE).etat(UPDATED_ETAT);

        restDetailsDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetailsDemande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDetailsDemande))
            )
            .andExpect(status().isOk());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
        DetailsDemande testDetailsDemande = detailsDemandeList.get(detailsDemandeList.size() - 1);
        assertThat(testDetailsDemande.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testDetailsDemande.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void fullUpdateDetailsDemandeWithPatch() throws Exception {
        // Initialize the database
        detailsDemandeRepository.saveAndFlush(detailsDemande);

        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();

        // Update the detailsDemande using partial update
        DetailsDemande partialUpdatedDetailsDemande = new DetailsDemande();
        partialUpdatedDetailsDemande.setId(detailsDemande.getId());

        partialUpdatedDetailsDemande.quantite(UPDATED_QUANTITE).etat(UPDATED_ETAT);

        restDetailsDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetailsDemande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDetailsDemande))
            )
            .andExpect(status().isOk());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
        DetailsDemande testDetailsDemande = detailsDemandeList.get(detailsDemandeList.size() - 1);
        assertThat(testDetailsDemande.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testDetailsDemande.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void patchNonExistingDetailsDemande() throws Exception {
        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();
        detailsDemande.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetailsDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, detailsDemande.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(detailsDemande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDetailsDemande() throws Exception {
        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();
        detailsDemande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailsDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(detailsDemande))
            )
            .andExpect(status().isBadRequest());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDetailsDemande() throws Exception {
        int databaseSizeBeforeUpdate = detailsDemandeRepository.findAll().size();
        detailsDemande.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailsDemandeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(detailsDemande))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DetailsDemande in the database
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDetailsDemande() throws Exception {
        // Initialize the database
        detailsDemandeRepository.saveAndFlush(detailsDemande);

        int databaseSizeBeforeDelete = detailsDemandeRepository.findAll().size();

        // Delete the detailsDemande
        restDetailsDemandeMockMvc
            .perform(delete(ENTITY_API_URL_ID, detailsDemande.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DetailsDemande> detailsDemandeList = detailsDemandeRepository.findAll();
        assertThat(detailsDemandeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
