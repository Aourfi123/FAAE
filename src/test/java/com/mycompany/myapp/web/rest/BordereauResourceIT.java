package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Bordereau;
import com.mycompany.myapp.repository.BordereauRepository;
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
 * Integration tests for the {@link BordereauResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BordereauResourceIT {

    private static final String DEFAULT_REFERENCE = "AAAAAAAAAA";
    private static final String UPDATED_REFERENCE = "BBBBBBBBBB";

    private static final String DEFAULT_ETAT = "AAAAAAAAAA";
    private static final String UPDATED_ETAT = "BBBBBBBBBB";

    private static final Float DEFAULT_MONTANT_TOTAL = 1F;
    private static final Float UPDATED_MONTANT_TOTAL = 2F;

    private static final LocalDate DEFAULT_DATE_CREATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CREATION = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_MODIFICATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_MODIFICATION = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/bordereaus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BordereauRepository bordereauRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBordereauMockMvc;

    private Bordereau bordereau;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bordereau createEntity(EntityManager em) {
        Bordereau bordereau = new Bordereau()
            .reference(DEFAULT_REFERENCE)
            .etat(DEFAULT_ETAT)
            .montantTotal(DEFAULT_MONTANT_TOTAL)
            .dateCreation(DEFAULT_DATE_CREATION)
            .dateModification(DEFAULT_DATE_MODIFICATION);
        return bordereau;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bordereau createUpdatedEntity(EntityManager em) {
        Bordereau bordereau = new Bordereau()
            .reference(UPDATED_REFERENCE)
            .etat(UPDATED_ETAT)
            .montantTotal(UPDATED_MONTANT_TOTAL)
            .dateCreation(UPDATED_DATE_CREATION)
            .dateModification(UPDATED_DATE_MODIFICATION);
        return bordereau;
    }

    @BeforeEach
    public void initTest() {
        bordereau = createEntity(em);
    }

    @Test
    @Transactional
    void createBordereau() throws Exception {
        int databaseSizeBeforeCreate = bordereauRepository.findAll().size();
        // Create the Bordereau
        restBordereauMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bordereau)))
            .andExpect(status().isCreated());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeCreate + 1);
        Bordereau testBordereau = bordereauList.get(bordereauList.size() - 1);
        assertThat(testBordereau.getReference()).isEqualTo(DEFAULT_REFERENCE);
        assertThat(testBordereau.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testBordereau.getMontantTotal()).isEqualTo(DEFAULT_MONTANT_TOTAL);
        assertThat(testBordereau.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testBordereau.getDateModification()).isEqualTo(DEFAULT_DATE_MODIFICATION);
    }

    @Test
    @Transactional
    void createBordereauWithExistingId() throws Exception {
        // Create the Bordereau with an existing ID
        bordereau.setId(1L);

        int databaseSizeBeforeCreate = bordereauRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBordereauMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bordereau)))
            .andExpect(status().isBadRequest());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBordereaus() throws Exception {
        // Initialize the database
        bordereauRepository.saveAndFlush(bordereau);

        // Get all the bordereauList
        restBordereauMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bordereau.getId().intValue())))
            .andExpect(jsonPath("$.[*].reference").value(hasItem(DEFAULT_REFERENCE)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT)))
            .andExpect(jsonPath("$.[*].montantTotal").value(hasItem(DEFAULT_MONTANT_TOTAL.doubleValue())))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].dateModification").value(hasItem(DEFAULT_DATE_MODIFICATION.toString())));
    }

    @Test
    @Transactional
    void getBordereau() throws Exception {
        // Initialize the database
        bordereauRepository.saveAndFlush(bordereau);

        // Get the bordereau
        restBordereauMockMvc
            .perform(get(ENTITY_API_URL_ID, bordereau.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bordereau.getId().intValue()))
            .andExpect(jsonPath("$.reference").value(DEFAULT_REFERENCE))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT))
            .andExpect(jsonPath("$.montantTotal").value(DEFAULT_MONTANT_TOTAL.doubleValue()))
            .andExpect(jsonPath("$.dateCreation").value(DEFAULT_DATE_CREATION.toString()))
            .andExpect(jsonPath("$.dateModification").value(DEFAULT_DATE_MODIFICATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBordereau() throws Exception {
        // Get the bordereau
        restBordereauMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBordereau() throws Exception {
        // Initialize the database
        bordereauRepository.saveAndFlush(bordereau);

        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();

        // Update the bordereau
        Bordereau updatedBordereau = bordereauRepository.findById(bordereau.getId()).get();
        // Disconnect from session so that the updates on updatedBordereau are not directly saved in db
        em.detach(updatedBordereau);
        updatedBordereau
            .reference(UPDATED_REFERENCE)
            .etat(UPDATED_ETAT)
            .montantTotal(UPDATED_MONTANT_TOTAL)
            .dateCreation(UPDATED_DATE_CREATION)
            .dateModification(UPDATED_DATE_MODIFICATION);

        restBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBordereau.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBordereau))
            )
            .andExpect(status().isOk());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
        Bordereau testBordereau = bordereauList.get(bordereauList.size() - 1);
        assertThat(testBordereau.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testBordereau.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testBordereau.getMontantTotal()).isEqualTo(UPDATED_MONTANT_TOTAL);
        assertThat(testBordereau.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testBordereau.getDateModification()).isEqualTo(UPDATED_DATE_MODIFICATION);
    }

    @Test
    @Transactional
    void putNonExistingBordereau() throws Exception {
        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();
        bordereau.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bordereau.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBordereau() throws Exception {
        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();
        bordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBordereau() throws Exception {
        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();
        bordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBordereauMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bordereau)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBordereauWithPatch() throws Exception {
        // Initialize the database
        bordereauRepository.saveAndFlush(bordereau);

        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();

        // Update the bordereau using partial update
        Bordereau partialUpdatedBordereau = new Bordereau();
        partialUpdatedBordereau.setId(bordereau.getId());

        partialUpdatedBordereau.reference(UPDATED_REFERENCE).montantTotal(UPDATED_MONTANT_TOTAL);

        restBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBordereau))
            )
            .andExpect(status().isOk());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
        Bordereau testBordereau = bordereauList.get(bordereauList.size() - 1);
        assertThat(testBordereau.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testBordereau.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testBordereau.getMontantTotal()).isEqualTo(UPDATED_MONTANT_TOTAL);
        assertThat(testBordereau.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testBordereau.getDateModification()).isEqualTo(DEFAULT_DATE_MODIFICATION);
    }

    @Test
    @Transactional
    void fullUpdateBordereauWithPatch() throws Exception {
        // Initialize the database
        bordereauRepository.saveAndFlush(bordereau);

        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();

        // Update the bordereau using partial update
        Bordereau partialUpdatedBordereau = new Bordereau();
        partialUpdatedBordereau.setId(bordereau.getId());

        partialUpdatedBordereau
            .reference(UPDATED_REFERENCE)
            .etat(UPDATED_ETAT)
            .montantTotal(UPDATED_MONTANT_TOTAL)
            .dateCreation(UPDATED_DATE_CREATION)
            .dateModification(UPDATED_DATE_MODIFICATION);

        restBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBordereau))
            )
            .andExpect(status().isOk());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
        Bordereau testBordereau = bordereauList.get(bordereauList.size() - 1);
        assertThat(testBordereau.getReference()).isEqualTo(UPDATED_REFERENCE);
        assertThat(testBordereau.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testBordereau.getMontantTotal()).isEqualTo(UPDATED_MONTANT_TOTAL);
        assertThat(testBordereau.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testBordereau.getDateModification()).isEqualTo(UPDATED_DATE_MODIFICATION);
    }

    @Test
    @Transactional
    void patchNonExistingBordereau() throws Exception {
        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();
        bordereau.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBordereau() throws Exception {
        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();
        bordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBordereau() throws Exception {
        int databaseSizeBeforeUpdate = bordereauRepository.findAll().size();
        bordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bordereau))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bordereau in the database
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBordereau() throws Exception {
        // Initialize the database
        bordereauRepository.saveAndFlush(bordereau);

        int databaseSizeBeforeDelete = bordereauRepository.findAll().size();

        // Delete the bordereau
        restBordereauMockMvc
            .perform(delete(ENTITY_API_URL_ID, bordereau.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bordereau> bordereauList = bordereauRepository.findAll();
        assertThat(bordereauList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
