package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.LignesBordereau;
import com.mycompany.myapp.repository.LignesBordereauRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.LignesBordereau}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LignesBordereauResource {

    private final Logger log = LoggerFactory.getLogger(LignesBordereauResource.class);

    private static final String ENTITY_NAME = "lignesBordereau";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LignesBordereauRepository lignesBordereauRepository;

    public LignesBordereauResource(LignesBordereauRepository lignesBordereauRepository) {
        this.lignesBordereauRepository = lignesBordereauRepository;
    }

    /**
     * {@code POST  /lignes-bordereaus} : Create a new lignesBordereau.
     *
     * @param lignesBordereau the lignesBordereau to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lignesBordereau, or with status {@code 400 (Bad Request)} if the lignesBordereau has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lignes-bordereaus")
    public ResponseEntity<LignesBordereau> createLignesBordereau(@RequestBody LignesBordereau lignesBordereau) throws URISyntaxException {
        log.debug("REST request to save LignesBordereau : {}", lignesBordereau);
        if (lignesBordereau.getId() != null) {
            throw new BadRequestAlertException("A new lignesBordereau cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LignesBordereau result = lignesBordereauRepository.save(lignesBordereau);
        return ResponseEntity
            .created(new URI("/api/lignes-bordereaus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lignes-bordereaus/:id} : Updates an existing lignesBordereau.
     *
     * @param id the id of the lignesBordereau to save.
     * @param lignesBordereau the lignesBordereau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lignesBordereau,
     * or with status {@code 400 (Bad Request)} if the lignesBordereau is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lignesBordereau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lignes-bordereaus/{id}")
    public ResponseEntity<LignesBordereau> updateLignesBordereau(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LignesBordereau lignesBordereau
    ) throws URISyntaxException {
        log.debug("REST request to update LignesBordereau : {}, {}", id, lignesBordereau);
        if (lignesBordereau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lignesBordereau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lignesBordereauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LignesBordereau result = lignesBordereauRepository.save(lignesBordereau);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lignesBordereau.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lignes-bordereaus/:id} : Partial updates given fields of an existing lignesBordereau, field will ignore if it is null
     *
     * @param id the id of the lignesBordereau to save.
     * @param lignesBordereau the lignesBordereau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lignesBordereau,
     * or with status {@code 400 (Bad Request)} if the lignesBordereau is not valid,
     * or with status {@code 404 (Not Found)} if the lignesBordereau is not found,
     * or with status {@code 500 (Internal Server Error)} if the lignesBordereau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lignes-bordereaus/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LignesBordereau> partialUpdateLignesBordereau(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LignesBordereau lignesBordereau
    ) throws URISyntaxException {
        log.debug("REST request to partial update LignesBordereau partially : {}, {}", id, lignesBordereau);
        if (lignesBordereau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lignesBordereau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lignesBordereauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LignesBordereau> result = lignesBordereauRepository
            .findById(lignesBordereau.getId())
            .map(existingLignesBordereau -> {
                if (lignesBordereau.getQuantite() != null) {
                    existingLignesBordereau.setQuantite(lignesBordereau.getQuantite());
                }
                if (lignesBordereau.getDateDebut() != null) {
                    existingLignesBordereau.setDateDebut(lignesBordereau.getDateDebut());
                }
                if (lignesBordereau.getDateFin() != null) {
                    existingLignesBordereau.setDateFin(lignesBordereau.getDateFin());
                }

                return existingLignesBordereau;
            })
            .map(lignesBordereauRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lignesBordereau.getId().toString())
        );
    }

    /**
     * {@code GET  /lignes-bordereaus} : get all the lignesBordereaus.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lignesBordereaus in body.
     */
    @GetMapping("/lignes-bordereaus")
    public ResponseEntity<List<LignesBordereau>> getAllLignesBordereaus(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of LignesBordereaus");
        Page<LignesBordereau> page = lignesBordereauRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lignes-bordereaus/:id} : get the "id" lignesBordereau.
     *
     * @param id the id of the lignesBordereau to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lignesBordereau, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lignes-bordereaus/{id}")
    public ResponseEntity<LignesBordereau> getLignesBordereau(@PathVariable Long id) {
        log.debug("REST request to get LignesBordereau : {}", id);
        Optional<LignesBordereau> lignesBordereau = lignesBordereauRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(lignesBordereau);
    }

    /**
     * {@code DELETE  /lignes-bordereaus/:id} : delete the "id" lignesBordereau.
     *
     * @param id the id of the lignesBordereau to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lignes-bordereaus/{id}")
    public ResponseEntity<Void> deleteLignesBordereau(@PathVariable Long id) {
        log.debug("REST request to delete LignesBordereau : {}", id);
        lignesBordereauRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
