package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Reduction;
import com.mycompany.myapp.repository.ReductionRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Reduction}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ReductionResource {

    private final Logger log = LoggerFactory.getLogger(ReductionResource.class);

    private static final String ENTITY_NAME = "reduction";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReductionRepository reductionRepository;

    public ReductionResource(ReductionRepository reductionRepository) {
        this.reductionRepository = reductionRepository;
    }

    /**
     * {@code POST  /reductions} : Create a new reduction.
     *
     * @param reduction the reduction to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reduction, or with status {@code 400 (Bad Request)} if the reduction has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/reductions")
    public ResponseEntity<Reduction> createReduction(@RequestBody Reduction reduction) throws URISyntaxException {
        log.debug("REST request to save Reduction : {}", reduction);
        if (reduction.getId() != null) {
            throw new BadRequestAlertException("A new reduction cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Reduction result = reductionRepository.save(reduction);
        return ResponseEntity
            .created(new URI("/api/reductions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /reductions/:id} : Updates an existing reduction.
     *
     * @param id the id of the reduction to save.
     * @param reduction the reduction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reduction,
     * or with status {@code 400 (Bad Request)} if the reduction is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reduction couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/reductions/{id}")
    public ResponseEntity<Reduction> updateReduction(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Reduction reduction
    ) throws URISyntaxException {
        log.debug("REST request to update Reduction : {}, {}", id, reduction);
        if (reduction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reduction.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reductionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Reduction result = reductionRepository.save(reduction);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reduction.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /reductions/:id} : Partial updates given fields of an existing reduction, field will ignore if it is null
     *
     * @param id the id of the reduction to save.
     * @param reduction the reduction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reduction,
     * or with status {@code 400 (Bad Request)} if the reduction is not valid,
     * or with status {@code 404 (Not Found)} if the reduction is not found,
     * or with status {@code 500 (Internal Server Error)} if the reduction couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/reductions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Reduction> partialUpdateReduction(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Reduction reduction
    ) throws URISyntaxException {
        log.debug("REST request to partial update Reduction partially : {}, {}", id, reduction);
        if (reduction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reduction.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reductionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Reduction> result = reductionRepository
            .findById(reduction.getId())
            .map(existingReduction -> {
                if (reduction.getDescription() != null) {
                    existingReduction.setDescription(reduction.getDescription());
                }
                if (reduction.getTypeOperation() != null) {
                    existingReduction.setTypeOperation(reduction.getTypeOperation());
                }
                if (reduction.getPourcentage() != null) {
                    existingReduction.setPourcentage(reduction.getPourcentage());
                }
                if (reduction.getDateDebut() != null) {
                    existingReduction.setDateDebut(reduction.getDateDebut());
                }
                if (reduction.getDateFin() != null) {
                    existingReduction.setDateFin(reduction.getDateFin());
                }

                return existingReduction;
            })
            .map(reductionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, reduction.getId().toString())
        );
    }

    /**
     * {@code GET  /reductions} : get all the reductions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reductions in body.
     */
    @GetMapping("/reductions")
    public ResponseEntity<List<Reduction>> getAllReductions(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Reductions");
        Page<Reduction> page = reductionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reductions/:id} : get the "id" reduction.
     *
     * @param id the id of the reduction to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reduction, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/reductions/{id}")
    public ResponseEntity<Reduction> getReduction(@PathVariable Long id) {
        log.debug("REST request to get Reduction : {}", id);
        Optional<Reduction> reduction = reductionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(reduction);
    }

    /**
     * {@code DELETE  /reductions/:id} : delete the "id" reduction.
     *
     * @param id the id of the reduction to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/reductions/{id}")
    public ResponseEntity<Void> deleteReduction(@PathVariable Long id) {
        log.debug("REST request to delete Reduction : {}", id);
        reductionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
