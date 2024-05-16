package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.SocieteCommerciale;
import com.mycompany.myapp.repository.SocieteCommercialeRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.SocieteCommerciale}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SocieteCommercialeResource {

    private final Logger log = LoggerFactory.getLogger(SocieteCommercialeResource.class);

    private static final String ENTITY_NAME = "societeCommerciale";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SocieteCommercialeRepository societeCommercialeRepository;

    public SocieteCommercialeResource(SocieteCommercialeRepository societeCommercialeRepository) {
        this.societeCommercialeRepository = societeCommercialeRepository;
    }

    /**
     * {@code POST  /societe-commerciales} : Create a new societeCommerciale.
     *
     * @param societeCommerciale the societeCommerciale to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new societeCommerciale, or with status {@code 400 (Bad Request)} if the societeCommerciale has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/societe-commerciales")
    public ResponseEntity<SocieteCommerciale> createSocieteCommerciale(@RequestBody SocieteCommerciale societeCommerciale)
        throws URISyntaxException {
        log.debug("REST request to save SocieteCommerciale : {}", societeCommerciale);
        if (societeCommerciale.getId() != null) {
            throw new BadRequestAlertException("A new societeCommerciale cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SocieteCommerciale result = societeCommercialeRepository.save(societeCommerciale);
        return ResponseEntity
            .created(new URI("/api/societe-commerciales/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /societe-commerciales/:id} : Updates an existing societeCommerciale.
     *
     * @param id the id of the societeCommerciale to save.
     * @param societeCommerciale the societeCommerciale to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated societeCommerciale,
     * or with status {@code 400 (Bad Request)} if the societeCommerciale is not valid,
     * or with status {@code 500 (Internal Server Error)} if the societeCommerciale couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/societe-commerciales/{id}")
    public ResponseEntity<SocieteCommerciale> updateSocieteCommerciale(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SocieteCommerciale societeCommerciale
    ) throws URISyntaxException {
        log.debug("REST request to update SocieteCommerciale : {}, {}", id, societeCommerciale);
        if (societeCommerciale.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, societeCommerciale.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!societeCommercialeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SocieteCommerciale result = societeCommercialeRepository.save(societeCommerciale);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, societeCommerciale.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /societe-commerciales/:id} : Partial updates given fields of an existing societeCommerciale, field will ignore if it is null
     *
     * @param id the id of the societeCommerciale to save.
     * @param societeCommerciale the societeCommerciale to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated societeCommerciale,
     * or with status {@code 400 (Bad Request)} if the societeCommerciale is not valid,
     * or with status {@code 404 (Not Found)} if the societeCommerciale is not found,
     * or with status {@code 500 (Internal Server Error)} if the societeCommerciale couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/societe-commerciales/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SocieteCommerciale> partialUpdateSocieteCommerciale(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SocieteCommerciale societeCommerciale
    ) throws URISyntaxException {
        log.debug("REST request to partial update SocieteCommerciale partially : {}, {}", id, societeCommerciale);
        if (societeCommerciale.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, societeCommerciale.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!societeCommercialeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SocieteCommerciale> result = societeCommercialeRepository
            .findById(societeCommerciale.getId())
            .map(existingSocieteCommerciale -> {
                if (societeCommerciale.getCodePays() != null) {
                    existingSocieteCommerciale.setCodePays(societeCommerciale.getCodePays());
                }
                if (societeCommerciale.getLibelle() != null) {
                    existingSocieteCommerciale.setLibelle(societeCommerciale.getLibelle());
                }
                if (societeCommerciale.getDevise() != null) {
                    existingSocieteCommerciale.setDevise(societeCommerciale.getDevise());
                }

                return existingSocieteCommerciale;
            })
            .map(societeCommercialeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, societeCommerciale.getId().toString())
        );
    }

    /**
     * {@code GET  /societe-commerciales} : get all the societeCommerciales.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of societeCommerciales in body.
     */
    @GetMapping("/societe-commerciales")
    public ResponseEntity<List<SocieteCommerciale>> getAllSocieteCommerciales(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of SocieteCommerciales");
        Page<SocieteCommerciale> page = societeCommercialeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /societe-commerciales/:id} : get the "id" societeCommerciale.
     *
     * @param id the id of the societeCommerciale to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the societeCommerciale, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/societe-commerciales/{id}")
    public ResponseEntity<SocieteCommerciale> getSocieteCommerciale(@PathVariable Long id) {
        log.debug("REST request to get SocieteCommerciale : {}", id);
        Optional<SocieteCommerciale> societeCommerciale = societeCommercialeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(societeCommerciale);
    }

    /**
     * {@code DELETE  /societe-commerciales/:id} : delete the "id" societeCommerciale.
     *
     * @param id the id of the societeCommerciale to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/societe-commerciales/{id}")
    public ResponseEntity<Void> deleteSocieteCommerciale(@PathVariable Long id) {
        log.debug("REST request to delete SocieteCommerciale : {}", id);
        societeCommercialeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
