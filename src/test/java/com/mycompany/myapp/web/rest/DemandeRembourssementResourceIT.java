package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.DemandeRembourssement;
import com.mycompany.myapp.repository.DemandeRembourssementRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link DemandeRembourssementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DemandeRembourssementResourceIT {

    private static final String DEFAULT_RAISON = "AAAAAAAAAA";
    private static final String UPDATED_RAISON = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PIECE_JOINTE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PIECE_JOINTE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PIECE_JOINTE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PIECE_JOINTE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_ETAT = "AAAAAAAAAA";
    private static final String UPDATED_ETAT = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE_CREATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_CREATION = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_MODIFICATION = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_MODIFICATION = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/demande-rembourssements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DemandeRembourssementRepository demandeRembourssementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDemandeRembourssementMockMvc;

    private DemandeRembourssement demandeRembourssement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DemandeRembourssement createEntity(EntityManager em) {
        DemandeRembourssement demandeRembourssement = new DemandeRembourssement()
            .raison(DEFAULT_RAISON)
            .pieceJointe(DEFAULT_PIECE_JOINTE)
            .pieceJointeContentType(DEFAULT_PIECE_JOINTE_CONTENT_TYPE)
            .etat(DEFAULT_ETAT)
            .dateCreation(DEFAULT_DATE_CREATION)
            .dateModification(DEFAULT_DATE_MODIFICATION);
        return demandeRembourssement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DemandeRembourssement createUpdatedEntity(EntityManager em) {
        DemandeRembourssement demandeRembourssement = new DemandeRembourssement()
            .raison(UPDATED_RAISON)
            .pieceJointe(UPDATED_PIECE_JOINTE)
            .pieceJointeContentType(UPDATED_PIECE_JOINTE_CONTENT_TYPE)
            .etat(UPDATED_ETAT)
            .dateCreation(UPDATED_DATE_CREATION)
            .dateModification(UPDATED_DATE_MODIFICATION);
        return demandeRembourssement;
    }

    @BeforeEach
    public void initTest() {
        demandeRembourssement = createEntity(em);
    }

    @Test
    @Transactional
    void createDemandeRembourssement() throws Exception {
        int databaseSizeBeforeCreate = demandeRembourssementRepository.findAll().size();
        // Create the DemandeRembourssement
        restDemandeRembourssementMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeRembourssement))
            )
            .andExpect(status().isCreated());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeCreate + 1);
        DemandeRembourssement testDemandeRembourssement = demandeRembourssementList.get(demandeRembourssementList.size() - 1);
        assertThat(testDemandeRembourssement.getRaison()).isEqualTo(DEFAULT_RAISON);
        assertThat(testDemandeRembourssement.getPieceJointe()).isEqualTo(DEFAULT_PIECE_JOINTE);
        assertThat(testDemandeRembourssement.getPieceJointeContentType()).isEqualTo(DEFAULT_PIECE_JOINTE_CONTENT_TYPE);
        assertThat(testDemandeRembourssement.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testDemandeRembourssement.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testDemandeRembourssement.getDateModification()).isEqualTo(DEFAULT_DATE_MODIFICATION);
    }

    @Test
    @Transactional
    void createDemandeRembourssementWithExistingId() throws Exception {
        // Create the DemandeRembourssement with an existing ID
        demandeRembourssement.setId(1L);

        int databaseSizeBeforeCreate = demandeRembourssementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDemandeRembourssementMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeRembourssement))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDemandeRembourssements() throws Exception {
        // Initialize the database
        demandeRembourssementRepository.saveAndFlush(demandeRembourssement);

        // Get all the demandeRembourssementList
        restDemandeRembourssementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(demandeRembourssement.getId().intValue())))
            .andExpect(jsonPath("$.[*].raison").value(hasItem(DEFAULT_RAISON)))
            .andExpect(jsonPath("$.[*].pieceJointeContentType").value(hasItem(DEFAULT_PIECE_JOINTE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].pieceJointe").value(hasItem(Base64Utils.encodeToString(DEFAULT_PIECE_JOINTE))))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT)))
            .andExpect(jsonPath("$.[*].dateCreation").value(hasItem(DEFAULT_DATE_CREATION.toString())))
            .andExpect(jsonPath("$.[*].dateModification").value(hasItem(DEFAULT_DATE_MODIFICATION.toString())));
    }

    @Test
    @Transactional
    void getDemandeRembourssement() throws Exception {
        // Initialize the database
        demandeRembourssementRepository.saveAndFlush(demandeRembourssement);

        // Get the demandeRembourssement
        restDemandeRembourssementMockMvc
            .perform(get(ENTITY_API_URL_ID, demandeRembourssement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(demandeRembourssement.getId().intValue()))
            .andExpect(jsonPath("$.raison").value(DEFAULT_RAISON))
            .andExpect(jsonPath("$.pieceJointeContentType").value(DEFAULT_PIECE_JOINTE_CONTENT_TYPE))
            .andExpect(jsonPath("$.pieceJointe").value(Base64Utils.encodeToString(DEFAULT_PIECE_JOINTE)))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT))
            .andExpect(jsonPath("$.dateCreation").value(DEFAULT_DATE_CREATION.toString()))
            .andExpect(jsonPath("$.dateModification").value(DEFAULT_DATE_MODIFICATION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDemandeRembourssement() throws Exception {
        // Get the demandeRembourssement
        restDemandeRembourssementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDemandeRembourssement() throws Exception {
        // Initialize the database
        demandeRembourssementRepository.saveAndFlush(demandeRembourssement);

        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();

        // Update the demandeRembourssement
        DemandeRembourssement updatedDemandeRembourssement = demandeRembourssementRepository.findById(demandeRembourssement.getId()).get();
        // Disconnect from session so that the updates on updatedDemandeRembourssement are not directly saved in db
        em.detach(updatedDemandeRembourssement);
        updatedDemandeRembourssement
            .raison(UPDATED_RAISON)
            .pieceJointe(UPDATED_PIECE_JOINTE)
            .pieceJointeContentType(UPDATED_PIECE_JOINTE_CONTENT_TYPE)
            .etat(UPDATED_ETAT)
            .dateCreation(UPDATED_DATE_CREATION)
            .dateModification(UPDATED_DATE_MODIFICATION);

        restDemandeRembourssementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDemandeRembourssement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDemandeRembourssement))
            )
            .andExpect(status().isOk());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
        DemandeRembourssement testDemandeRembourssement = demandeRembourssementList.get(demandeRembourssementList.size() - 1);
        assertThat(testDemandeRembourssement.getRaison()).isEqualTo(UPDATED_RAISON);
        assertThat(testDemandeRembourssement.getPieceJointe()).isEqualTo(UPDATED_PIECE_JOINTE);
        assertThat(testDemandeRembourssement.getPieceJointeContentType()).isEqualTo(UPDATED_PIECE_JOINTE_CONTENT_TYPE);
        assertThat(testDemandeRembourssement.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testDemandeRembourssement.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testDemandeRembourssement.getDateModification()).isEqualTo(UPDATED_DATE_MODIFICATION);
    }

    @Test
    @Transactional
    void putNonExistingDemandeRembourssement() throws Exception {
        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();
        demandeRembourssement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeRembourssementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, demandeRembourssement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeRembourssement))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDemandeRembourssement() throws Exception {
        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();
        demandeRembourssement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeRembourssementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeRembourssement))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDemandeRembourssement() throws Exception {
        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();
        demandeRembourssement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeRembourssementMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(demandeRembourssement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDemandeRembourssementWithPatch() throws Exception {
        // Initialize the database
        demandeRembourssementRepository.saveAndFlush(demandeRembourssement);

        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();

        // Update the demandeRembourssement using partial update
        DemandeRembourssement partialUpdatedDemandeRembourssement = new DemandeRembourssement();
        partialUpdatedDemandeRembourssement.setId(demandeRembourssement.getId());

        partialUpdatedDemandeRembourssement.raison(UPDATED_RAISON).dateModification(UPDATED_DATE_MODIFICATION);

        restDemandeRembourssementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemandeRembourssement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDemandeRembourssement))
            )
            .andExpect(status().isOk());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
        DemandeRembourssement testDemandeRembourssement = demandeRembourssementList.get(demandeRembourssementList.size() - 1);
        assertThat(testDemandeRembourssement.getRaison()).isEqualTo(UPDATED_RAISON);
        assertThat(testDemandeRembourssement.getPieceJointe()).isEqualTo(DEFAULT_PIECE_JOINTE);
        assertThat(testDemandeRembourssement.getPieceJointeContentType()).isEqualTo(DEFAULT_PIECE_JOINTE_CONTENT_TYPE);
        assertThat(testDemandeRembourssement.getEtat()).isEqualTo(DEFAULT_ETAT);
        assertThat(testDemandeRembourssement.getDateCreation()).isEqualTo(DEFAULT_DATE_CREATION);
        assertThat(testDemandeRembourssement.getDateModification()).isEqualTo(UPDATED_DATE_MODIFICATION);
    }

    @Test
    @Transactional
    void fullUpdateDemandeRembourssementWithPatch() throws Exception {
        // Initialize the database
        demandeRembourssementRepository.saveAndFlush(demandeRembourssement);

        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();

        // Update the demandeRembourssement using partial update
        DemandeRembourssement partialUpdatedDemandeRembourssement = new DemandeRembourssement();
        partialUpdatedDemandeRembourssement.setId(demandeRembourssement.getId());

        partialUpdatedDemandeRembourssement
            .raison(UPDATED_RAISON)
            .pieceJointe(UPDATED_PIECE_JOINTE)
            .pieceJointeContentType(UPDATED_PIECE_JOINTE_CONTENT_TYPE)
            .etat(UPDATED_ETAT)
            .dateCreation(UPDATED_DATE_CREATION)
            .dateModification(UPDATED_DATE_MODIFICATION);

        restDemandeRembourssementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDemandeRembourssement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDemandeRembourssement))
            )
            .andExpect(status().isOk());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
        DemandeRembourssement testDemandeRembourssement = demandeRembourssementList.get(demandeRembourssementList.size() - 1);
        assertThat(testDemandeRembourssement.getRaison()).isEqualTo(UPDATED_RAISON);
        assertThat(testDemandeRembourssement.getPieceJointe()).isEqualTo(UPDATED_PIECE_JOINTE);
        assertThat(testDemandeRembourssement.getPieceJointeContentType()).isEqualTo(UPDATED_PIECE_JOINTE_CONTENT_TYPE);
        assertThat(testDemandeRembourssement.getEtat()).isEqualTo(UPDATED_ETAT);
        assertThat(testDemandeRembourssement.getDateCreation()).isEqualTo(UPDATED_DATE_CREATION);
        assertThat(testDemandeRembourssement.getDateModification()).isEqualTo(UPDATED_DATE_MODIFICATION);
    }

    @Test
    @Transactional
    void patchNonExistingDemandeRembourssement() throws Exception {
        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();
        demandeRembourssement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDemandeRembourssementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, demandeRembourssement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeRembourssement))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDemandeRembourssement() throws Exception {
        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();
        demandeRembourssement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeRembourssementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeRembourssement))
            )
            .andExpect(status().isBadRequest());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDemandeRembourssement() throws Exception {
        int databaseSizeBeforeUpdate = demandeRembourssementRepository.findAll().size();
        demandeRembourssement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDemandeRembourssementMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(demandeRembourssement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DemandeRembourssement in the database
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDemandeRembourssement() throws Exception {
        // Initialize the database
        demandeRembourssementRepository.saveAndFlush(demandeRembourssement);

        int databaseSizeBeforeDelete = demandeRembourssementRepository.findAll().size();

        // Delete the demandeRembourssement
        restDemandeRembourssementMockMvc
            .perform(delete(ENTITY_API_URL_ID, demandeRembourssement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DemandeRembourssement> demandeRembourssementList = demandeRembourssementRepository.findAll();
        assertThat(demandeRembourssementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
