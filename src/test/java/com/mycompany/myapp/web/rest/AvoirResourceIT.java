package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Avoir;
import com.mycompany.myapp.repository.AvoirRepository;
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
 * Integration tests for the {@link AvoirResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AvoirResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/avoirs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AvoirRepository avoirRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAvoirMockMvc;

    private Avoir avoir;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Avoir createEntity(EntityManager em) {
        Avoir avoir = new Avoir().code(DEFAULT_CODE);
        return avoir;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Avoir createUpdatedEntity(EntityManager em) {
        Avoir avoir = new Avoir().code(UPDATED_CODE);
        return avoir;
    }

    @BeforeEach
    public void initTest() {
        avoir = createEntity(em);
    }

    @Test
    @Transactional
    void createAvoir() throws Exception {
        int databaseSizeBeforeCreate = avoirRepository.findAll().size();
        // Create the Avoir
        restAvoirMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(avoir)))
            .andExpect(status().isCreated());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeCreate + 1);
        Avoir testAvoir = avoirList.get(avoirList.size() - 1);
        assertThat(testAvoir.getCode()).isEqualTo(DEFAULT_CODE);
    }

    @Test
    @Transactional
    void createAvoirWithExistingId() throws Exception {
        // Create the Avoir with an existing ID
        avoir.setId(1L);

        int databaseSizeBeforeCreate = avoirRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAvoirMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(avoir)))
            .andExpect(status().isBadRequest());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAvoirs() throws Exception {
        // Initialize the database
        avoirRepository.saveAndFlush(avoir);

        // Get all the avoirList
        restAvoirMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(avoir.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)));
    }

    @Test
    @Transactional
    void getAvoir() throws Exception {
        // Initialize the database
        avoirRepository.saveAndFlush(avoir);

        // Get the avoir
        restAvoirMockMvc
            .perform(get(ENTITY_API_URL_ID, avoir.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(avoir.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE));
    }

    @Test
    @Transactional
    void getNonExistingAvoir() throws Exception {
        // Get the avoir
        restAvoirMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAvoir() throws Exception {
        // Initialize the database
        avoirRepository.saveAndFlush(avoir);

        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();

        // Update the avoir
        Avoir updatedAvoir = avoirRepository.findById(avoir.getId()).get();
        // Disconnect from session so that the updates on updatedAvoir are not directly saved in db
        em.detach(updatedAvoir);
        updatedAvoir.code(UPDATED_CODE);

        restAvoirMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAvoir.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAvoir))
            )
            .andExpect(status().isOk());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
        Avoir testAvoir = avoirList.get(avoirList.size() - 1);
        assertThat(testAvoir.getCode()).isEqualTo(UPDATED_CODE);
    }

    @Test
    @Transactional
    void putNonExistingAvoir() throws Exception {
        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();
        avoir.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvoirMockMvc
            .perform(
                put(ENTITY_API_URL_ID, avoir.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(avoir))
            )
            .andExpect(status().isBadRequest());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAvoir() throws Exception {
        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();
        avoir.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvoirMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(avoir))
            )
            .andExpect(status().isBadRequest());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAvoir() throws Exception {
        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();
        avoir.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvoirMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(avoir)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAvoirWithPatch() throws Exception {
        // Initialize the database
        avoirRepository.saveAndFlush(avoir);

        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();

        // Update the avoir using partial update
        Avoir partialUpdatedAvoir = new Avoir();
        partialUpdatedAvoir.setId(avoir.getId());

        restAvoirMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAvoir.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAvoir))
            )
            .andExpect(status().isOk());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
        Avoir testAvoir = avoirList.get(avoirList.size() - 1);
        assertThat(testAvoir.getCode()).isEqualTo(DEFAULT_CODE);
    }

    @Test
    @Transactional
    void fullUpdateAvoirWithPatch() throws Exception {
        // Initialize the database
        avoirRepository.saveAndFlush(avoir);

        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();

        // Update the avoir using partial update
        Avoir partialUpdatedAvoir = new Avoir();
        partialUpdatedAvoir.setId(avoir.getId());

        partialUpdatedAvoir.code(UPDATED_CODE);

        restAvoirMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAvoir.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAvoir))
            )
            .andExpect(status().isOk());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
        Avoir testAvoir = avoirList.get(avoirList.size() - 1);
        assertThat(testAvoir.getCode()).isEqualTo(UPDATED_CODE);
    }

    @Test
    @Transactional
    void patchNonExistingAvoir() throws Exception {
        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();
        avoir.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvoirMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, avoir.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(avoir))
            )
            .andExpect(status().isBadRequest());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAvoir() throws Exception {
        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();
        avoir.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvoirMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(avoir))
            )
            .andExpect(status().isBadRequest());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAvoir() throws Exception {
        int databaseSizeBeforeUpdate = avoirRepository.findAll().size();
        avoir.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvoirMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(avoir)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Avoir in the database
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAvoir() throws Exception {
        // Initialize the database
        avoirRepository.saveAndFlush(avoir);

        int databaseSizeBeforeDelete = avoirRepository.findAll().size();

        // Delete the avoir
        restAvoirMockMvc
            .perform(delete(ENTITY_API_URL_ID, avoir.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Avoir> avoirList = avoirRepository.findAll();
        assertThat(avoirList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
