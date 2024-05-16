package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Avoir;
import com.mycompany.myapp.repository.AvoirRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Avoir}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AvoirResource {

    private final Logger log = LoggerFactory.getLogger(AvoirResource.class);

    private static final String ENTITY_NAME = "avoir";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AvoirRepository avoirRepository;

    public AvoirResource(AvoirRepository avoirRepository) {
        this.avoirRepository = avoirRepository;
    }

    /**
     * {@code POST  /avoirs} : Create a new avoir.
     *
     * @param avoir the avoir to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new avoir, or with status {@code 400 (Bad Request)} if the avoir has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/avoirs")
    public ResponseEntity<Avoir> createAvoir(@RequestBody Avoir avoir) throws URISyntaxException {
        log.debug("REST request to save Avoir : {}", avoir);
        if (avoir.getId() != null) {
            throw new BadRequestAlertException("A new avoir cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Avoir result = avoirRepository.save(avoir);
        return ResponseEntity
            .created(new URI("/api/avoirs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /avoirs/:id} : Updates an existing avoir.
     *
     * @param id the id of the avoir to save.
     * @param avoir the avoir to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated avoir,
     * or with status {@code 400 (Bad Request)} if the avoir is not valid,
     * or with status {@code 500 (Internal Server Error)} if the avoir couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/avoirs/{id}")
    public ResponseEntity<Avoir> updateAvoir(@PathVariable(value = "id", required = false) final Long id, @RequestBody Avoir avoir)
        throws URISyntaxException {
        log.debug("REST request to update Avoir : {}, {}", id, avoir);
        if (avoir.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, avoir.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!avoirRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Avoir result = avoirRepository.save(avoir);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, avoir.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /avoirs/:id} : Partial updates given fields of an existing avoir, field will ignore if it is null
     *
     * @param id the id of the avoir to save.
     * @param avoir the avoir to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated avoir,
     * or with status {@code 400 (Bad Request)} if the avoir is not valid,
     * or with status {@code 404 (Not Found)} if the avoir is not found,
     * or with status {@code 500 (Internal Server Error)} if the avoir couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/avoirs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Avoir> partialUpdateAvoir(@PathVariable(value = "id", required = false) final Long id, @RequestBody Avoir avoir)
        throws URISyntaxException {
        log.debug("REST request to partial update Avoir partially : {}, {}", id, avoir);
        if (avoir.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, avoir.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!avoirRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Avoir> result = avoirRepository
            .findById(avoir.getId())
            .map(existingAvoir -> {
                if (avoir.getCode() != null) {
                    existingAvoir.setCode(avoir.getCode());
                }

                return existingAvoir;
            })
            .map(avoirRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, avoir.getId().toString())
        );
    }

    /**
     * {@code GET  /avoirs} : get all the avoirs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of avoirs in body.
     */
    @GetMapping("/avoirs")
    public ResponseEntity<List<Avoir>> getAllAvoirs(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Avoirs");
        Page<Avoir> page = avoirRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /avoirs/:id} : get the "id" avoir.
     *
     * @param id the id of the avoir to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the avoir, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/avoirs/{id}")
    public ResponseEntity<Avoir> getAvoir(@PathVariable Long id) {
        log.debug("REST request to get Avoir : {}", id);
        Optional<Avoir> avoir = avoirRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(avoir);
    }

    /**
     * {@code DELETE  /avoirs/:id} : delete the "id" avoir.
     *
     * @param id the id of the avoir to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/avoirs/{id}")
    public ResponseEntity<Void> deleteAvoir(@PathVariable Long id) {
        log.debug("REST request to delete Avoir : {}", id);
        avoirRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
