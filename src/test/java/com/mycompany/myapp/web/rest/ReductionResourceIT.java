package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Reduction;
import com.mycompany.myapp.repository.ReductionRepository;
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
 * Integration tests for the {@link ReductionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReductionResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE_OPERATION = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_OPERATION = "BBBBBBBBBB";

    private static final Float DEFAULT_POURCENTAGE = 1F;
    private static final Float UPDATED_POURCENTAGE = 2F;

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/reductions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ReductionRepository reductionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReductionMockMvc;

    private Reduction reduction;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reduction createEntity(EntityManager em) {
        Reduction reduction = new Reduction()
            .description(DEFAULT_DESCRIPTION)
            .typeOperation(DEFAULT_TYPE_OPERATION)
            .pourcentage(DEFAULT_POURCENTAGE)
            .dateDebut(DEFAULT_DATE_DEBUT)
            .dateFin(DEFAULT_DATE_FIN);
        return reduction;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reduction createUpdatedEntity(EntityManager em) {
        Reduction reduction = new Reduction()
            .description(UPDATED_DESCRIPTION)
            .typeOperation(UPDATED_TYPE_OPERATION)
            .pourcentage(UPDATED_POURCENTAGE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN);
        return reduction;
    }

    @BeforeEach
    public void initTest() {
        reduction = createEntity(em);
    }

    @Test
    @Transactional
    void createReduction() throws Exception {
        int databaseSizeBeforeCreate = reductionRepository.findAll().size();
        // Create the Reduction
        restReductionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reduction)))
            .andExpect(status().isCreated());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeCreate + 1);
        Reduction testReduction = reductionList.get(reductionList.size() - 1);
        assertThat(testReduction.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testReduction.getTypeOperation()).isEqualTo(DEFAULT_TYPE_OPERATION);
        assertThat(testReduction.getPourcentage()).isEqualTo(DEFAULT_POURCENTAGE);
        assertThat(testReduction.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testReduction.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createReductionWithExistingId() throws Exception {
        // Create the Reduction with an existing ID
        reduction.setId(1L);

        int databaseSizeBeforeCreate = reductionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReductionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reduction)))
            .andExpect(status().isBadRequest());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReductions() throws Exception {
        // Initialize the database
        reductionRepository.saveAndFlush(reduction);

        // Get all the reductionList
        restReductionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reduction.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].typeOperation").value(hasItem(DEFAULT_TYPE_OPERATION)))
            .andExpect(jsonPath("$.[*].pourcentage").value(hasItem(DEFAULT_POURCENTAGE.doubleValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getReduction() throws Exception {
        // Initialize the database
        reductionRepository.saveAndFlush(reduction);

        // Get the reduction
        restReductionMockMvc
            .perform(get(ENTITY_API_URL_ID, reduction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reduction.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.typeOperation").value(DEFAULT_TYPE_OPERATION))
            .andExpect(jsonPath("$.pourcentage").value(DEFAULT_POURCENTAGE.doubleValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingReduction() throws Exception {
        // Get the reduction
        restReductionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReduction() throws Exception {
        // Initialize the database
        reductionRepository.saveAndFlush(reduction);

        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();

        // Update the reduction
        Reduction updatedReduction = reductionRepository.findById(reduction.getId()).get();
        // Disconnect from session so that the updates on updatedReduction are not directly saved in db
        em.detach(updatedReduction);
        updatedReduction
            .description(UPDATED_DESCRIPTION)
            .typeOperation(UPDATED_TYPE_OPERATION)
            .pourcentage(UPDATED_POURCENTAGE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN);

        restReductionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedReduction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedReduction))
            )
            .andExpect(status().isOk());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
        Reduction testReduction = reductionList.get(reductionList.size() - 1);
        assertThat(testReduction.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testReduction.getTypeOperation()).isEqualTo(UPDATED_TYPE_OPERATION);
        assertThat(testReduction.getPourcentage()).isEqualTo(UPDATED_POURCENTAGE);
        assertThat(testReduction.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testReduction.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingReduction() throws Exception {
        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();
        reduction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReductionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reduction.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reduction))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReduction() throws Exception {
        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();
        reduction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReductionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(reduction))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReduction() throws Exception {
        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();
        reduction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReductionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(reduction)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReductionWithPatch() throws Exception {
        // Initialize the database
        reductionRepository.saveAndFlush(reduction);

        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();

        // Update the reduction using partial update
        Reduction partialUpdatedReduction = new Reduction();
        partialUpdatedReduction.setId(reduction.getId());

        partialUpdatedReduction
            .description(UPDATED_DESCRIPTION)
            .pourcentage(UPDATED_POURCENTAGE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN);

        restReductionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReduction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReduction))
            )
            .andExpect(status().isOk());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
        Reduction testReduction = reductionList.get(reductionList.size() - 1);
        assertThat(testReduction.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testReduction.getTypeOperation()).isEqualTo(DEFAULT_TYPE_OPERATION);
        assertThat(testReduction.getPourcentage()).isEqualTo(UPDATED_POURCENTAGE);
        assertThat(testReduction.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testReduction.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateReductionWithPatch() throws Exception {
        // Initialize the database
        reductionRepository.saveAndFlush(reduction);

        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();

        // Update the reduction using partial update
        Reduction partialUpdatedReduction = new Reduction();
        partialUpdatedReduction.setId(reduction.getId());

        partialUpdatedReduction
            .description(UPDATED_DESCRIPTION)
            .typeOperation(UPDATED_TYPE_OPERATION)
            .pourcentage(UPDATED_POURCENTAGE)
            .dateDebut(UPDATED_DATE_DEBUT)
            .dateFin(UPDATED_DATE_FIN);

        restReductionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReduction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedReduction))
            )
            .andExpect(status().isOk());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
        Reduction testReduction = reductionList.get(reductionList.size() - 1);
        assertThat(testReduction.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testReduction.getTypeOperation()).isEqualTo(UPDATED_TYPE_OPERATION);
        assertThat(testReduction.getPourcentage()).isEqualTo(UPDATED_POURCENTAGE);
        assertThat(testReduction.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testReduction.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingReduction() throws Exception {
        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();
        reduction.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReductionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reduction.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reduction))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReduction() throws Exception {
        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();
        reduction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReductionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(reduction))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReduction() throws Exception {
        int databaseSizeBeforeUpdate = reductionRepository.findAll().size();
        reduction.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReductionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(reduction))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reduction in the database
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReduction() throws Exception {
        // Initialize the database
        reductionRepository.saveAndFlush(reduction);

        int databaseSizeBeforeDelete = reductionRepository.findAll().size();

        // Delete the reduction
        restReductionMockMvc
            .perform(delete(ENTITY_API_URL_ID, reduction.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Reduction> reductionList = reductionRepository.findAll();
        assertThat(reductionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
