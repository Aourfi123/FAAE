package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Bordereau;
import com.mycompany.myapp.repository.BordereauRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Bordereau}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BordereauResource {

    private final Logger log = LoggerFactory.getLogger(BordereauResource.class);

    private static final String ENTITY_NAME = "bordereau";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BordereauRepository bordereauRepository;

    public BordereauResource(BordereauRepository bordereauRepository) {
        this.bordereauRepository = bordereauRepository;
    }

    /**
     * {@code POST  /bordereaus} : Create a new bordereau.
     *
     * @param bordereau the bordereau to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bordereau, or with status {@code 400 (Bad Request)} if the bordereau has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bordereaus")
    public ResponseEntity<Bordereau> createBordereau(@RequestBody Bordereau bordereau) throws URISyntaxException {
        log.debug("REST request to save Bordereau : {}", bordereau);
        if (bordereau.getId() != null) {
            throw new BadRequestAlertException("A new bordereau cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Bordereau result = bordereauRepository.save(bordereau);
        return ResponseEntity
            .created(new URI("/api/bordereaus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bordereaus/:id} : Updates an existing bordereau.
     *
     * @param id the id of the bordereau to save.
     * @param bordereau the bordereau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bordereau,
     * or with status {@code 400 (Bad Request)} if the bordereau is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bordereau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bordereaus/{id}")
    public ResponseEntity<Bordereau> updateBordereau(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bordereau bordereau
    ) throws URISyntaxException {
        log.debug("REST request to update Bordereau : {}, {}", id, bordereau);
        if (bordereau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bordereau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bordereauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bordereau result = bordereauRepository.save(bordereau);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bordereau.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bordereaus/:id} : Partial updates given fields of an existing bordereau, field will ignore if it is null
     *
     * @param id the id of the bordereau to save.
     * @param bordereau the bordereau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bordereau,
     * or with status {@code 400 (Bad Request)} if the bordereau is not valid,
     * or with status {@code 404 (Not Found)} if the bordereau is not found,
     * or with status {@code 500 (Internal Server Error)} if the bordereau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bordereaus/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bordereau> partialUpdateBordereau(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Bordereau bordereau
    ) throws URISyntaxException {
        log.debug("REST request to partial update Bordereau partially : {}, {}", id, bordereau);
        if (bordereau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bordereau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bordereauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bordereau> result = bordereauRepository
            .findById(bordereau.getId())
            .map(existingBordereau -> {
                if (bordereau.getReference() != null) {
                    existingBordereau.setReference(bordereau.getReference());
                }
                if (bordereau.getEtat() != null) {
                    existingBordereau.setEtat(bordereau.getEtat());
                }
                if (bordereau.getMontantTotal() != null) {
                    existingBordereau.setMontantTotal(bordereau.getMontantTotal());
                }
                if (bordereau.getDateCreation() != null) {
                    existingBordereau.setDateCreation(bordereau.getDateCreation());
                }
                if (bordereau.getDateModification() != null) {
                    existingBordereau.setDateModification(bordereau.getDateModification());
                }

                return existingBordereau;
            })
            .map(bordereauRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bordereau.getId().toString())
        );
    }

    /**
     * {@code GET  /bordereaus} : get all the bordereaus.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bordereaus in body.
     */
    @GetMapping("/bordereaus")
    public ResponseEntity<List<Bordereau>> getAllBordereaus(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Bordereaus");
        Page<Bordereau> page = bordereauRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /bordereaus/:id} : get the "id" bordereau.
     *
     * @param id the id of the bordereau to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bordereau, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bordereaus/{id}")
    public ResponseEntity<Bordereau> getBordereau(@PathVariable Long id) {
        log.debug("REST request to get Bordereau : {}", id);
        Optional<Bordereau> bordereau = bordereauRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(bordereau);
    }

    /**
     * {@code DELETE  /bordereaus/:id} : delete the "id" bordereau.
     *
     * @param id the id of the bordereau to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bordereaus/{id}")
    public ResponseEntity<Void> deleteBordereau(@PathVariable Long id) {
        log.debug("REST request to delete Bordereau : {}", id);
        bordereauRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
