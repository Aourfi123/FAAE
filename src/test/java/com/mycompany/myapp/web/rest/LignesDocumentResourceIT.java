package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.LignesDocument;
import com.mycompany.myapp.repository.LignesDocumentRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link LignesDocumentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LignesDocumentResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/lignes-documents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LignesDocumentRepository lignesDocumentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLignesDocumentMockMvc;

    private LignesDocument lignesDocument;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LignesDocument createEntity(EntityManager em) {
        LignesDocument lignesDocument = new LignesDocument().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return lignesDocument;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LignesDocument createUpdatedEntity(EntityManager em) {
        LignesDocument lignesDocument = new LignesDocument().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return lignesDocument;
    }

    @BeforeEach
    public void initTest() {
        lignesDocument = createEntity(em);
    }

    @Test
    @Transactional
    void createLignesDocument() throws Exception {
        int databaseSizeBeforeCreate = lignesDocumentRepository.findAll().size();
        // Create the LignesDocument
        restLignesDocumentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lignesDocument))
            )
            .andExpect(status().isCreated());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeCreate + 1);
        LignesDocument testLignesDocument = lignesDocumentList.get(lignesDocumentList.size() - 1);
        assertThat(testLignesDocument.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testLignesDocument.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createLignesDocumentWithExistingId() throws Exception {
        // Create the LignesDocument with an existing ID
        lignesDocument.setId(1L);

        int databaseSizeBeforeCreate = lignesDocumentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLignesDocumentMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lignesDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLignesDocuments() throws Exception {
        // Initialize the database
        lignesDocumentRepository.saveAndFlush(lignesDocument);

        // Get all the lignesDocumentList
        restLignesDocumentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lignesDocument.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getLignesDocument() throws Exception {
        // Initialize the database
        lignesDocumentRepository.saveAndFlush(lignesDocument);

        // Get the lignesDocument
        restLignesDocumentMockMvc
            .perform(get(ENTITY_API_URL_ID, lignesDocument.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lignesDocument.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLignesDocument() throws Exception {
        // Get the lignesDocument
        restLignesDocumentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLignesDocument() throws Exception {
        // Initialize the database
        lignesDocumentRepository.saveAndFlush(lignesDocument);

        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();

        // Update the lignesDocument
        LignesDocument updatedLignesDocument = lignesDocumentRepository.findById(lignesDocument.getId()).get();
        // Disconnect from session so that the updates on updatedLignesDocument are not directly saved in db
        em.detach(updatedLignesDocument);
        updatedLignesDocument.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restLignesDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLignesDocument.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLignesDocument))
            )
            .andExpect(status().isOk());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
        LignesDocument testLignesDocument = lignesDocumentList.get(lignesDocumentList.size() - 1);
        assertThat(testLignesDocument.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testLignesDocument.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingLignesDocument() throws Exception {
        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();
        lignesDocument.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLignesDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lignesDocument.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lignesDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLignesDocument() throws Exception {
        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();
        lignesDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLignesDocumentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lignesDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLignesDocument() throws Exception {
        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();
        lignesDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLignesDocumentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lignesDocument)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLignesDocumentWithPatch() throws Exception {
        // Initialize the database
        lignesDocumentRepository.saveAndFlush(lignesDocument);

        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();

        // Update the lignesDocument using partial update
        LignesDocument partialUpdatedLignesDocument = new LignesDocument();
        partialUpdatedLignesDocument.setId(lignesDocument.getId());

        partialUpdatedLignesDocument.dateDebut(UPDATED_DATE_DEBUT);

        restLignesDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLignesDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLignesDocument))
            )
            .andExpect(status().isOk());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
        LignesDocument testLignesDocument = lignesDocumentList.get(lignesDocumentList.size() - 1);
        assertThat(testLignesDocument.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testLignesDocument.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateLignesDocumentWithPatch() throws Exception {
        // Initialize the database
        lignesDocumentRepository.saveAndFlush(lignesDocument);

        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();

        // Update the lignesDocument using partial update
        LignesDocument partialUpdatedLignesDocument = new LignesDocument();
        partialUpdatedLignesDocument.setId(lignesDocument.getId());

        partialUpdatedLignesDocument.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restLignesDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLignesDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLignesDocument))
            )
            .andExpect(status().isOk());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
        LignesDocument testLignesDocument = lignesDocumentList.get(lignesDocumentList.size() - 1);
        assertThat(testLignesDocument.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testLignesDocument.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingLignesDocument() throws Exception {
        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();
        lignesDocument.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLignesDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lignesDocument.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lignesDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLignesDocument() throws Exception {
        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();
        lignesDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLignesDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lignesDocument))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLignesDocument() throws Exception {
        int databaseSizeBeforeUpdate = lignesDocumentRepository.findAll().size();
        lignesDocument.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLignesDocumentMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lignesDocument))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LignesDocument in the database
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLignesDocument() throws Exception {
        // Initialize the database
        lignesDocumentRepository.saveAndFlush(lignesDocument);

        int databaseSizeBeforeDelete = lignesDocumentRepository.findAll().size();

        // Delete the lignesDocument
        restLignesDocumentMockMvc
            .perform(delete(ENTITY_API_URL_ID, lignesDocument.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LignesDocument> lignesDocumentList = lignesDocumentRepository.findAll();
        assertThat(lignesDocumentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
