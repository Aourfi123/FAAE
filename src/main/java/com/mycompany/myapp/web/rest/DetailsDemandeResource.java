package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.DetailsDemande;
import com.mycompany.myapp.repository.DetailsDemandeRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.DetailsDemande}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DetailsDemandeResource {

    private final Logger log = LoggerFactory.getLogger(DetailsDemandeResource.class);

    private static final String ENTITY_NAME = "detailsDemande";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DetailsDemandeRepository detailsDemandeRepository;

    public DetailsDemandeResource(DetailsDemandeRepository detailsDemandeRepository) {
        this.detailsDemandeRepository = detailsDemandeRepository;
    }

    /**
     * {@code POST  /details-demandes} : Create a new detailsDemande.
     *
     * @param detailsDemande the detailsDemande to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new detailsDemande, or with status {@code 400 (Bad Request)} if the detailsDemande has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/details-demandes")
    public ResponseEntity<DetailsDemande> createDetailsDemande(@RequestBody DetailsDemande detailsDemande) throws URISyntaxException {
        log.debug("REST request to save DetailsDemande : {}", detailsDemande);
        if (detailsDemande.getId() != null) {
            throw new BadRequestAlertException("A new detailsDemande cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DetailsDemande result = detailsDemandeRepository.save(detailsDemande);
        return ResponseEntity
            .created(new URI("/api/details-demandes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /details-demandes/:id} : Updates an existing detailsDemande.
     *
     * @param id the id of the detailsDemande to save.
     * @param detailsDemande the detailsDemande to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated detailsDemande,
     * or with status {@code 400 (Bad Request)} if the detailsDemande is not valid,
     * or with status {@code 500 (Internal Server Error)} if the detailsDemande couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/details-demandes/{id}")
    public ResponseEntity<DetailsDemande> updateDetailsDemande(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DetailsDemande detailsDemande
    ) throws URISyntaxException {
        log.debug("REST request to update DetailsDemande : {}, {}", id, detailsDemande);
        if (detailsDemande.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, detailsDemande.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!detailsDemandeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DetailsDemande result = detailsDemandeRepository.save(detailsDemande);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, detailsDemande.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /details-demandes/:id} : Partial updates given fields of an existing detailsDemande, field will ignore if it is null
     *
     * @param id the id of the detailsDemande to save.
     * @param detailsDemande the detailsDemande to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated detailsDemande,
     * or with status {@code 400 (Bad Request)} if the detailsDemande is not valid,
     * or with status {@code 404 (Not Found)} if the detailsDemande is not found,
     * or with status {@code 500 (Internal Server Error)} if the detailsDemande couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/details-demandes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DetailsDemande> partialUpdateDetailsDemande(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DetailsDemande detailsDemande
    ) throws URISyntaxException {
        log.debug("REST request to partial update DetailsDemande partially : {}, {}", id, detailsDemande);
        if (detailsDemande.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, detailsDemande.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!detailsDemandeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DetailsDemande> result = detailsDemandeRepository
            .findById(detailsDemande.getId())
            .map(existingDetailsDemande -> {
                if (detailsDemande.getQuantite() != null) {
                    existingDetailsDemande.setQuantite(detailsDemande.getQuantite());
                }
                if (detailsDemande.getEtat() != null) {
                    existingDetailsDemande.setEtat(detailsDemande.getEtat());
                }

                return existingDetailsDemande;
            })
            .map(detailsDemandeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, detailsDemande.getId().toString())
        );
    }

    /**
     * {@code GET  /details-demandes} : get all the detailsDemandes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of detailsDemandes in body.
     */
    @GetMapping("/details-demandes")
    public ResponseEntity<List<DetailsDemande>> getAllDetailsDemandes(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of DetailsDemandes");
        Page<DetailsDemande> page = detailsDemandeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /details-demandes/:id} : get the "id" detailsDemande.
     *
     * @param id the id of the detailsDemande to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the detailsDemande, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/details-demandes/{id}")
    public ResponseEntity<DetailsDemande> getDetailsDemande(@PathVariable Long id) {
        log.debug("REST request to get DetailsDemande : {}", id);
        Optional<DetailsDemande> detailsDemande = detailsDemandeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(detailsDemande);
    }

    /**
     * {@code DELETE  /details-demandes/:id} : delete the "id" detailsDemande.
     *
     * @param id the id of the detailsDemande to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/details-demandes/{id}")
    public ResponseEntity<Void> deleteDetailsDemande(@PathVariable Long id) {
        log.debug("REST request to delete DetailsDemande : {}", id);
        detailsDemandeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
