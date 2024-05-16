package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.LignesBordereau;
import com.mycompany.myapp.repository.LignesBordereauRepository;
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
 * Integration tests for the {@link LignesBordereauResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LignesBordereauResourceIT {

    private static final Integer DEFAULT_QUANTITE = 1;
    private static final Integer UPDATED_QUANTITE = 2;

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/lignes-bordereaus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LignesBordereauRepository lignesBordereauRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLignesBordereauMockMvc;

    private LignesBordereau lignesBordereau;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LignesBordereau createEntity(EntityManager em) {
        LignesBordereau lignesBordereau = new LignesBordereau()
            .quantite(DEFAULT_QUANTITE)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN);
        return lignesBordereau;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LignesBordereau createUpdatedEntity(EntityManager em) {
        LignesBordereau lignesBordereau = new LignesBordereau()
            .quantite(UPDATED_QUANTITE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN);
        return lignesBordereau;
    }

    @BeforeEach
    public void initTest() {
        lignesBordereau = createEntity(em);
    }

    @Test
    @Transactional
    void createLignesBordereau() throws Exception {
        int databaseSizeBeforeCreate = lignesBordereauRepository.findAll().size();
        // Create the LignesBordereau
        restLignesBordereauMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lignesBordereau))
            )
            .andExpect(status().isCreated());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeCreate + 1);
        LignesBordereau testLignesBordereau = lignesBordereauList.get(lignesBordereauList.size() - 1);
        assertThat(testLignesBordereau.getQuantite()).isEqualTo(DEFAULT_QUANTITE);
        assertThat(testLignesBordereau.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testLignesBordereau.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createLignesBordereauWithExistingId() throws Exception {
        // Create the LignesBordereau with an existing ID
        lignesBordereau.setId(1L);

        int databaseSizeBeforeCreate = lignesBordereauRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLignesBordereauMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lignesBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLignesBordereaus() throws Exception {
        // Initialize the database
        lignesBordereauRepository.saveAndFlush(lignesBordereau);

        // Get all the lignesBordereauList
        restLignesBordereauMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lignesBordereau.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantite").value(hasItem(DEFAULT_QUANTITE)))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getLignesBordereau() throws Exception {
        // Initialize the database
        lignesBordereauRepository.saveAndFlush(lignesBordereau);

        // Get the lignesBordereau
        restLignesBordereauMockMvc
            .perform(get(ENTITY_API_URL_ID, lignesBordereau.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lignesBordereau.getId().intValue()))
            .andExpect(jsonPath("$.quantite").value(DEFAULT_QUANTITE))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLignesBordereau() throws Exception {
        // Get the lignesBordereau
        restLignesBordereauMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLignesBordereau() throws Exception {
        // Initialize the database
        lignesBordereauRepository.saveAndFlush(lignesBordereau);

        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();

        // Update the lignesBordereau
        LignesBordereau updatedLignesBordereau = lignesBordereauRepository.findById(lignesBordereau.getId()).get();
        // Disconnect from session so that the updates on updatedLignesBordereau are not directly saved in db
        em.detach(updatedLignesBordereau);
        updatedLignesBordereau.quantite(UPDATED_QUANTITE).dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restLignesBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLignesBordereau.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLignesBordereau))
            )
            .andExpect(status().isOk());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
        LignesBordereau testLignesBordereau = lignesBordereauList.get(lignesBordereauList.size() - 1);
        assertThat(testLignesBordereau.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testLignesBordereau.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testLignesBordereau.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingLignesBordereau() throws Exception {
        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();
        lignesBordereau.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLignesBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lignesBordereau.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lignesBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLignesBordereau() throws Exception {
        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();
        lignesBordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLignesBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lignesBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLignesBordereau() throws Exception {
        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();
        lignesBordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLignesBordereauMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lignesBordereau))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLignesBordereauWithPatch() throws Exception {
        // Initialize the database
        lignesBordereauRepository.saveAndFlush(lignesBordereau);

        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();

        // Update the lignesBordereau using partial update
        LignesBordereau partialUpdatedLignesBordereau = new LignesBordereau();
        partialUpdatedLignesBordereau.setId(lignesBordereau.getId());

        partialUpdatedLignesBordereau.quantite(UPDATED_QUANTITE);

        restLignesBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLignesBordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLignesBordereau))
            )
            .andExpect(status().isOk());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
        LignesBordereau testLignesBordereau = lignesBordereauList.get(lignesBordereauList.size() - 1);
        assertThat(testLignesBordereau.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testLignesBordereau.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testLignesBordereau.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateLignesBordereauWithPatch() throws Exception {
        // Initialize the database
        lignesBordereauRepository.saveAndFlush(lignesBordereau);

        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();

        // Update the lignesBordereau using partial update
        LignesBordereau partialUpdatedLignesBordereau = new LignesBordereau();
        partialUpdatedLignesBordereau.setId(lignesBordereau.getId());

        partialUpdatedLignesBordereau.quantite(UPDATED_QUANTITE).dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restLignesBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLignesBordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLignesBordereau))
            )
            .andExpect(status().isOk());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
        LignesBordereau testLignesBordereau = lignesBordereauList.get(lignesBordereauList.size() - 1);
        assertThat(testLignesBordereau.getQuantite()).isEqualTo(UPDATED_QUANTITE);
        assertThat(testLignesBordereau.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testLignesBordereau.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingLignesBordereau() throws Exception {
        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();
        lignesBordereau.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLignesBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lignesBordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lignesBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLignesBordereau() throws Exception {
        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();
        lignesBordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLignesBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lignesBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLignesBordereau() throws Exception {
        int databaseSizeBeforeUpdate = lignesBordereauRepository.findAll().size();
        lignesBordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLignesBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lignesBordereau))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LignesBordereau in the database
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLignesBordereau() throws Exception {
        // Initialize the database
        lignesBordereauRepository.saveAndFlush(lignesBordereau);

        int databaseSizeBeforeDelete = lignesBordereauRepository.findAll().size();

        // Delete the lignesBordereau
        restLignesBordereauMockMvc
            .perform(delete(ENTITY_API_URL_ID, lignesBordereau.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LignesBordereau> lignesBordereauList = lignesBordereauRepository.findAll();
        assertThat(lignesBordereauList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
