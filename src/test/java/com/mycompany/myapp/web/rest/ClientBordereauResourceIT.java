package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ClientBordereau;
import com.mycompany.myapp.repository.ClientBordereauRepository;
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
 * Integration tests for the {@link ClientBordereauResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClientBordereauResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/client-bordereaus";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClientBordereauRepository clientBordereauRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClientBordereauMockMvc;

    private ClientBordereau clientBordereau;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientBordereau createEntity(EntityManager em) {
        ClientBordereau clientBordereau = new ClientBordereau().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return clientBordereau;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientBordereau createUpdatedEntity(EntityManager em) {
        ClientBordereau clientBordereau = new ClientBordereau().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return clientBordereau;
    }

    @BeforeEach
    public void initTest() {
        clientBordereau = createEntity(em);
    }

    @Test
    @Transactional
    void createClientBordereau() throws Exception {
        int databaseSizeBeforeCreate = clientBordereauRepository.findAll().size();
        // Create the ClientBordereau
        restClientBordereauMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientBordereau))
            )
            .andExpect(status().isCreated());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeCreate + 1);
        ClientBordereau testClientBordereau = clientBordereauList.get(clientBordereauList.size() - 1);
        assertThat(testClientBordereau.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testClientBordereau.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createClientBordereauWithExistingId() throws Exception {
        // Create the ClientBordereau with an existing ID
        clientBordereau.setId(1L);

        int databaseSizeBeforeCreate = clientBordereauRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClientBordereauMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClientBordereaus() throws Exception {
        // Initialize the database
        clientBordereauRepository.saveAndFlush(clientBordereau);

        // Get all the clientBordereauList
        restClientBordereauMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clientBordereau.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getClientBordereau() throws Exception {
        // Initialize the database
        clientBordereauRepository.saveAndFlush(clientBordereau);

        // Get the clientBordereau
        restClientBordereauMockMvc
            .perform(get(ENTITY_API_URL_ID, clientBordereau.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clientBordereau.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingClientBordereau() throws Exception {
        // Get the clientBordereau
        restClientBordereauMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClientBordereau() throws Exception {
        // Initialize the database
        clientBordereauRepository.saveAndFlush(clientBordereau);

        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();

        // Update the clientBordereau
        ClientBordereau updatedClientBordereau = clientBordereauRepository.findById(clientBordereau.getId()).get();
        // Disconnect from session so that the updates on updatedClientBordereau are not directly saved in db
        em.detach(updatedClientBordereau);
        updatedClientBordereau.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restClientBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClientBordereau.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClientBordereau))
            )
            .andExpect(status().isOk());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
        ClientBordereau testClientBordereau = clientBordereauList.get(clientBordereauList.size() - 1);
        assertThat(testClientBordereau.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testClientBordereau.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingClientBordereau() throws Exception {
        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();
        clientBordereau.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clientBordereau.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClientBordereau() throws Exception {
        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();
        clientBordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientBordereauMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clientBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClientBordereau() throws Exception {
        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();
        clientBordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientBordereauMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clientBordereau))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClientBordereauWithPatch() throws Exception {
        // Initialize the database
        clientBordereauRepository.saveAndFlush(clientBordereau);

        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();

        // Update the clientBordereau using partial update
        ClientBordereau partialUpdatedClientBordereau = new ClientBordereau();
        partialUpdatedClientBordereau.setId(clientBordereau.getId());

        partialUpdatedClientBordereau.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restClientBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientBordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClientBordereau))
            )
            .andExpect(status().isOk());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
        ClientBordereau testClientBordereau = clientBordereauList.get(clientBordereauList.size() - 1);
        assertThat(testClientBordereau.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testClientBordereau.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateClientBordereauWithPatch() throws Exception {
        // Initialize the database
        clientBordereauRepository.saveAndFlush(clientBordereau);

        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();

        // Update the clientBordereau using partial update
        ClientBordereau partialUpdatedClientBordereau = new ClientBordereau();
        partialUpdatedClientBordereau.setId(clientBordereau.getId());

        partialUpdatedClientBordereau.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restClientBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientBordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClientBordereau))
            )
            .andExpect(status().isOk());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
        ClientBordereau testClientBordereau = clientBordereauList.get(clientBordereauList.size() - 1);
        assertThat(testClientBordereau.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testClientBordereau.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingClientBordereau() throws Exception {
        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();
        clientBordereau.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clientBordereau.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClientBordereau() throws Exception {
        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();
        clientBordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientBordereau))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClientBordereau() throws Exception {
        int databaseSizeBeforeUpdate = clientBordereauRepository.findAll().size();
        clientBordereau.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientBordereauMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clientBordereau))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientBordereau in the database
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClientBordereau() throws Exception {
        // Initialize the database
        clientBordereauRepository.saveAndFlush(clientBordereau);

        int databaseSizeBeforeDelete = clientBordereauRepository.findAll().size();

        // Delete the clientBordereau
        restClientBordereauMockMvc
            .perform(delete(ENTITY_API_URL_ID, clientBordereau.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClientBordereau> clientBordereauList = clientBordereauRepository.findAll();
        assertThat(clientBordereauList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
