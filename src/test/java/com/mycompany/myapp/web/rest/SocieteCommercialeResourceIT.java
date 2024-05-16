package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.SocieteCommerciale;
import com.mycompany.myapp.repository.SocieteCommercialeRepository;
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
 * Integration tests for the {@link SocieteCommercialeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SocieteCommercialeResourceIT {

    private static final String DEFAULT_CODE_PAYS = "AAAAAAAAAA";
    private static final String UPDATED_CODE_PAYS = "BBBBBBBBBB";

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String DEFAULT_DEVISE = "AAAAAAAAAA";
    private static final String UPDATED_DEVISE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/societe-commerciales";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SocieteCommercialeRepository societeCommercialeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSocieteCommercialeMockMvc;

    private SocieteCommerciale societeCommerciale;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocieteCommerciale createEntity(EntityManager em) {
        SocieteCommerciale societeCommerciale = new SocieteCommerciale()
            .codePays(DEFAULT_CODE_PAYS)
            .libelle(DEFAULT_LIBELLE)
            .devise(DEFAULT_DEVISE);
        return societeCommerciale;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocieteCommerciale createUpdatedEntity(EntityManager em) {
        SocieteCommerciale societeCommerciale = new SocieteCommerciale()
            .codePays(UPDATED_CODE_PAYS)
            .libelle(UPDATED_LIBELLE)
            .devise(UPDATED_DEVISE);
        return societeCommerciale;
    }

    @BeforeEach
    public void initTest() {
        societeCommerciale = createEntity(em);
    }

    @Test
    @Transactional
    void createSocieteCommerciale() throws Exception {
        int databaseSizeBeforeCreate = societeCommercialeRepository.findAll().size();
        // Create the SocieteCommerciale
        restSocieteCommercialeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(societeCommerciale))
            )
            .andExpect(status().isCreated());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeCreate + 1);
        SocieteCommerciale testSocieteCommerciale = societeCommercialeList.get(societeCommercialeList.size() - 1);
        assertThat(testSocieteCommerciale.getCodePays()).isEqualTo(DEFAULT_CODE_PAYS);
        assertThat(testSocieteCommerciale.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testSocieteCommerciale.getDevise()).isEqualTo(DEFAULT_DEVISE);
    }

    @Test
    @Transactional
    void createSocieteCommercialeWithExistingId() throws Exception {
        // Create the SocieteCommerciale with an existing ID
        societeCommerciale.setId(1L);

        int databaseSizeBeforeCreate = societeCommercialeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSocieteCommercialeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(societeCommerciale))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSocieteCommerciales() throws Exception {
        // Initialize the database
        societeCommercialeRepository.saveAndFlush(societeCommerciale);

        // Get all the societeCommercialeList
        restSocieteCommercialeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(societeCommerciale.getId().intValue())))
            .andExpect(jsonPath("$.[*].codePays").value(hasItem(DEFAULT_CODE_PAYS)))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].devise").value(hasItem(DEFAULT_DEVISE)));
    }

    @Test
    @Transactional
    void getSocieteCommerciale() throws Exception {
        // Initialize the database
        societeCommercialeRepository.saveAndFlush(societeCommerciale);

        // Get the societeCommerciale
        restSocieteCommercialeMockMvc
            .perform(get(ENTITY_API_URL_ID, societeCommerciale.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(societeCommerciale.getId().intValue()))
            .andExpect(jsonPath("$.codePays").value(DEFAULT_CODE_PAYS))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.devise").value(DEFAULT_DEVISE));
    }

    @Test
    @Transactional
    void getNonExistingSocieteCommerciale() throws Exception {
        // Get the societeCommerciale
        restSocieteCommercialeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSocieteCommerciale() throws Exception {
        // Initialize the database
        societeCommercialeRepository.saveAndFlush(societeCommerciale);

        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();

        // Update the societeCommerciale
        SocieteCommerciale updatedSocieteCommerciale = societeCommercialeRepository.findById(societeCommerciale.getId()).get();
        // Disconnect from session so that the updates on updatedSocieteCommerciale are not directly saved in db
        em.detach(updatedSocieteCommerciale);
        updatedSocieteCommerciale.codePays(UPDATED_CODE_PAYS).libelle(UPDATED_LIBELLE).devise(UPDATED_DEVISE);

        restSocieteCommercialeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSocieteCommerciale.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSocieteCommerciale))
            )
            .andExpect(status().isOk());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
        SocieteCommerciale testSocieteCommerciale = societeCommercialeList.get(societeCommercialeList.size() - 1);
        assertThat(testSocieteCommerciale.getCodePays()).isEqualTo(UPDATED_CODE_PAYS);
        assertThat(testSocieteCommerciale.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testSocieteCommerciale.getDevise()).isEqualTo(UPDATED_DEVISE);
    }

    @Test
    @Transactional
    void putNonExistingSocieteCommerciale() throws Exception {
        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();
        societeCommerciale.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocieteCommercialeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, societeCommerciale.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(societeCommerciale))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSocieteCommerciale() throws Exception {
        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();
        societeCommerciale.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocieteCommercialeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(societeCommerciale))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSocieteCommerciale() throws Exception {
        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();
        societeCommerciale.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocieteCommercialeMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(societeCommerciale))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSocieteCommercialeWithPatch() throws Exception {
        // Initialize the database
        societeCommercialeRepository.saveAndFlush(societeCommerciale);

        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();

        // Update the societeCommerciale using partial update
        SocieteCommerciale partialUpdatedSocieteCommerciale = new SocieteCommerciale();
        partialUpdatedSocieteCommerciale.setId(societeCommerciale.getId());

        restSocieteCommercialeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocieteCommerciale.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSocieteCommerciale))
            )
            .andExpect(status().isOk());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
        SocieteCommerciale testSocieteCommerciale = societeCommercialeList.get(societeCommercialeList.size() - 1);
        assertThat(testSocieteCommerciale.getCodePays()).isEqualTo(DEFAULT_CODE_PAYS);
        assertThat(testSocieteCommerciale.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testSocieteCommerciale.getDevise()).isEqualTo(DEFAULT_DEVISE);
    }

    @Test
    @Transactional
    void fullUpdateSocieteCommercialeWithPatch() throws Exception {
        // Initialize the database
        societeCommercialeRepository.saveAndFlush(societeCommerciale);

        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();

        // Update the societeCommerciale using partial update
        SocieteCommerciale partialUpdatedSocieteCommerciale = new SocieteCommerciale();
        partialUpdatedSocieteCommerciale.setId(societeCommerciale.getId());

        partialUpdatedSocieteCommerciale.codePays(UPDATED_CODE_PAYS).libelle(UPDATED_LIBELLE).devise(UPDATED_DEVISE);

        restSocieteCommercialeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocieteCommerciale.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSocieteCommerciale))
            )
            .andExpect(status().isOk());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
        SocieteCommerciale testSocieteCommerciale = societeCommercialeList.get(societeCommercialeList.size() - 1);
        assertThat(testSocieteCommerciale.getCodePays()).isEqualTo(UPDATED_CODE_PAYS);
        assertThat(testSocieteCommerciale.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testSocieteCommerciale.getDevise()).isEqualTo(UPDATED_DEVISE);
    }

    @Test
    @Transactional
    void patchNonExistingSocieteCommerciale() throws Exception {
        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();
        societeCommerciale.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocieteCommercialeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, societeCommerciale.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(societeCommerciale))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSocieteCommerciale() throws Exception {
        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();
        societeCommerciale.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocieteCommercialeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(societeCommerciale))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSocieteCommerciale() throws Exception {
        int databaseSizeBeforeUpdate = societeCommercialeRepository.findAll().size();
        societeCommerciale.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocieteCommercialeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(societeCommerciale))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocieteCommerciale in the database
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSocieteCommerciale() throws Exception {
        // Initialize the database
        societeCommercialeRepository.saveAndFlush(societeCommerciale);

        int databaseSizeBeforeDelete = societeCommercialeRepository.findAll().size();

        // Delete the societeCommerciale
        restSocieteCommercialeMockMvc
            .perform(delete(ENTITY_API_URL_ID, societeCommerciale.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SocieteCommerciale> societeCommercialeList = societeCommercialeRepository.findAll();
        assertThat(societeCommercialeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
