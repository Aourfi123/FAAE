package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.DemandeRembourssement;
import com.mycompany.myapp.repository.DemandeRembourssementRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.DemandeRembourssement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DemandeRembourssementResource {

    private final Logger log = LoggerFactory.getLogger(DemandeRembourssementResource.class);

    private static final String ENTITY_NAME = "demandeRembourssement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DemandeRembourssementRepository demandeRembourssementRepository;

    public DemandeRembourssementResource(DemandeRembourssementRepository demandeRembourssementRepository) {
        this.demandeRembourssementRepository = demandeRembourssementRepository;
    }

    /**
     * {@code POST  /demande-rembourssements} : Create a new demandeRembourssement.
     *
     * @param demandeRembourssement the demandeRembourssement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new demandeRembourssement, or with status {@code 400 (Bad Request)} if the demandeRembourssement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/demande-rembourssements")
    public ResponseEntity<DemandeRembourssement> createDemandeRembourssement(@RequestBody DemandeRembourssement demandeRembourssement)
        throws URISyntaxException {
        log.debug("REST request to save DemandeRembourssement : {}", demandeRembourssement);
        if (demandeRembourssement.getId() != null) {
            throw new BadRequestAlertException("A new demandeRembourssement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DemandeRembourssement result = demandeRembourssementRepository.save(demandeRembourssement);
        return ResponseEntity
            .created(new URI("/api/demande-rembourssements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /demande-rembourssements/:id} : Updates an existing demandeRembourssement.
     *
     * @param id the id of the demandeRembourssement to save.
     * @param demandeRembourssement the demandeRembourssement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demandeRembourssement,
     * or with status {@code 400 (Bad Request)} if the demandeRembourssement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the demandeRembourssement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/demande-rembourssements/{id}")
    public ResponseEntity<DemandeRembourssement> updateDemandeRembourssement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DemandeRembourssement demandeRembourssement
    ) throws URISyntaxException {
        log.debug("REST request to update DemandeRembourssement : {}, {}", id, demandeRembourssement);
        if (demandeRembourssement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demandeRembourssement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeRembourssementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DemandeRembourssement result = demandeRembourssementRepository.save(demandeRembourssement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demandeRembourssement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /demande-rembourssements/:id} : Partial updates given fields of an existing demandeRembourssement, field will ignore if it is null
     *
     * @param id the id of the demandeRembourssement to save.
     * @param demandeRembourssement the demandeRembourssement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated demandeRembourssement,
     * or with status {@code 400 (Bad Request)} if the demandeRembourssement is not valid,
     * or with status {@code 404 (Not Found)} if the demandeRembourssement is not found,
     * or with status {@code 500 (Internal Server Error)} if the demandeRembourssement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/demande-rembourssements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DemandeRembourssement> partialUpdateDemandeRembourssement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody DemandeRembourssement demandeRembourssement
    ) throws URISyntaxException {
        log.debug("REST request to partial update DemandeRembourssement partially : {}, {}", id, demandeRembourssement);
        if (demandeRembourssement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, demandeRembourssement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!demandeRembourssementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DemandeRembourssement> result = demandeRembourssementRepository
            .findById(demandeRembourssement.getId())
            .map(existingDemandeRembourssement -> {
                if (demandeRembourssement.getRaison() != null) {
                    existingDemandeRembourssement.setRaison(demandeRembourssement.getRaison());
                }
                if (demandeRembourssement.getPieceJointe() != null) {
                    existingDemandeRembourssement.setPieceJointe(demandeRembourssement.getPieceJointe());
                }
                if (demandeRembourssement.getPieceJointeContentType() != null) {
                    existingDemandeRembourssement.setPieceJointeContentType(demandeRembourssement.getPieceJointeContentType());
                }
                if (demandeRembourssement.getEtat() != null) {
                    existingDemandeRembourssement.setEtat(demandeRembourssement.getEtat());
                }
                if (demandeRembourssement.getDateCreation() != null) {
                    existingDemandeRembourssement.setDateCreation(demandeRembourssement.getDateCreation());
                }
                if (demandeRembourssement.getDateModification() != null) {
                    existingDemandeRembourssement.setDateModification(demandeRembourssement.getDateModification());
                }

                return existingDemandeRembourssement;
            })
            .map(demandeRembourssementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, demandeRembourssement.getId().toString())
        );
    }

    /**
     * {@code GET  /demande-rembourssements} : get all the demandeRembourssements.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of demandeRembourssements in body.
     */
    @GetMapping("/demande-rembourssements")
    public ResponseEntity<List<DemandeRembourssement>> getAllDemandeRembourssements(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of DemandeRembourssements");
        Page<DemandeRembourssement> page = demandeRembourssementRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /demande-rembourssements/:id} : get the "id" demandeRembourssement.
     *
     * @param id the id of the demandeRembourssement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the demandeRembourssement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/demande-rembourssements/{id}")
    public ResponseEntity<DemandeRembourssement> getDemandeRembourssement(@PathVariable Long id) {
        log.debug("REST request to get DemandeRembourssement : {}", id);
        Optional<DemandeRembourssement> demandeRembourssement = demandeRembourssementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(demandeRembourssement);
    }

    /**
     * {@code DELETE  /demande-rembourssements/:id} : delete the "id" demandeRembourssement.
     *
     * @param id the id of the demandeRembourssement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/demande-rembourssements/{id}")
    public ResponseEntity<Void> deleteDemandeRembourssement(@PathVariable Long id) {
        log.debug("REST request to delete DemandeRembourssement : {}", id);
        demandeRembourssementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
