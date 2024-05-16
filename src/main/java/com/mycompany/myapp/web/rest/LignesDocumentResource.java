package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.LignesDocument;
import com.mycompany.myapp.repository.LignesDocumentRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.LignesDocument}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LignesDocumentResource {

    private final Logger log = LoggerFactory.getLogger(LignesDocumentResource.class);

    private static final String ENTITY_NAME = "lignesDocument";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LignesDocumentRepository lignesDocumentRepository;

    public LignesDocumentResource(LignesDocumentRepository lignesDocumentRepository) {
        this.lignesDocumentRepository = lignesDocumentRepository;
    }

    /**
     * {@code POST  /lignes-documents} : Create a new lignesDocument.
     *
     * @param lignesDocument the lignesDocument to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lignesDocument, or with status {@code 400 (Bad Request)} if the lignesDocument has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lignes-documents")
    public ResponseEntity<LignesDocument> createLignesDocument(@RequestBody LignesDocument lignesDocument) throws URISyntaxException {
        log.debug("REST request to save LignesDocument : {}", lignesDocument);
        if (lignesDocument.getId() != null) {
            throw new BadRequestAlertException("A new lignesDocument cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LignesDocument result = lignesDocumentRepository.save(lignesDocument);
        return ResponseEntity
            .created(new URI("/api/lignes-documents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lignes-documents/:id} : Updates an existing lignesDocument.
     *
     * @param id the id of the lignesDocument to save.
     * @param lignesDocument the lignesDocument to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lignesDocument,
     * or with status {@code 400 (Bad Request)} if the lignesDocument is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lignesDocument couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lignes-documents/{id}")
    public ResponseEntity<LignesDocument> updateLignesDocument(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LignesDocument lignesDocument
    ) throws URISyntaxException {
        log.debug("REST request to update LignesDocument : {}, {}", id, lignesDocument);
        if (lignesDocument.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lignesDocument.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lignesDocumentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LignesDocument result = lignesDocumentRepository.save(lignesDocument);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lignesDocument.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lignes-documents/:id} : Partial updates given fields of an existing lignesDocument, field will ignore if it is null
     *
     * @param id the id of the lignesDocument to save.
     * @param lignesDocument the lignesDocument to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lignesDocument,
     * or with status {@code 400 (Bad Request)} if the lignesDocument is not valid,
     * or with status {@code 404 (Not Found)} if the lignesDocument is not found,
     * or with status {@code 500 (Internal Server Error)} if the lignesDocument couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lignes-documents/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LignesDocument> partialUpdateLignesDocument(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LignesDocument lignesDocument
    ) throws URISyntaxException {
        log.debug("REST request to partial update LignesDocument partially : {}, {}", id, lignesDocument);
        if (lignesDocument.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lignesDocument.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lignesDocumentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LignesDocument> result = lignesDocumentRepository
            .findById(lignesDocument.getId())
            .map(existingLignesDocument -> {
                if (lignesDocument.getDateDebut() != null) {
                    existingLignesDocument.setDateDebut(lignesDocument.getDateDebut());
                }
                if (lignesDocument.getDateFin() != null) {
                    existingLignesDocument.setDateFin(lignesDocument.getDateFin());
                }

                return existingLignesDocument;
            })
            .map(lignesDocumentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lignesDocument.getId().toString())
        );
    }

    /**
     * {@code GET  /lignes-documents} : get all the lignesDocuments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lignesDocuments in body.
     */
    @GetMapping("/lignes-documents")
    public ResponseEntity<List<LignesDocument>> getAllLignesDocuments(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of LignesDocuments");
        Page<LignesDocument> page = lignesDocumentRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lignes-documents/:id} : get the "id" lignesDocument.
     *
     * @param id the id of the lignesDocument to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lignesDocument, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lignes-documents/{id}")
    public ResponseEntity<LignesDocument> getLignesDocument(@PathVariable Long id) {
        log.debug("REST request to get LignesDocument : {}", id);
        Optional<LignesDocument> lignesDocument = lignesDocumentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(lignesDocument);
    }

    /**
     * {@code DELETE  /lignes-documents/:id} : delete the "id" lignesDocument.
     *
     * @param id the id of the lignesDocument to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lignes-documents/{id}")
    public ResponseEntity<Void> deleteLignesDocument(@PathVariable Long id) {
        log.debug("REST request to delete LignesDocument : {}", id);
        lignesDocumentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
