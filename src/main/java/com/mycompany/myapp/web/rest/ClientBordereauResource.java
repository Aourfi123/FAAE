package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ClientBordereau;
import com.mycompany.myapp.repository.ClientBordereauRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ClientBordereau}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClientBordereauResource {

    private final Logger log = LoggerFactory.getLogger(ClientBordereauResource.class);

    private static final String ENTITY_NAME = "clientBordereau";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClientBordereauRepository clientBordereauRepository;

    public ClientBordereauResource(ClientBordereauRepository clientBordereauRepository) {
        this.clientBordereauRepository = clientBordereauRepository;
    }

    /**
     * {@code POST  /client-bordereaus} : Create a new clientBordereau.
     *
     * @param clientBordereau the clientBordereau to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clientBordereau, or with status {@code 400 (Bad Request)} if the clientBordereau has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/client-bordereaus")
    public ResponseEntity<ClientBordereau> createClientBordereau(@RequestBody ClientBordereau clientBordereau) throws URISyntaxException {
        log.debug("REST request to save ClientBordereau : {}", clientBordereau);
        if (clientBordereau.getId() != null) {
            throw new BadRequestAlertException("A new clientBordereau cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClientBordereau result = clientBordereauRepository.save(clientBordereau);
        return ResponseEntity
            .created(new URI("/api/client-bordereaus/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /client-bordereaus/:id} : Updates an existing clientBordereau.
     *
     * @param id the id of the clientBordereau to save.
     * @param clientBordereau the clientBordereau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clientBordereau,
     * or with status {@code 400 (Bad Request)} if the clientBordereau is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clientBordereau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/client-bordereaus/{id}")
    public ResponseEntity<ClientBordereau> updateClientBordereau(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClientBordereau clientBordereau
    ) throws URISyntaxException {
        log.debug("REST request to update ClientBordereau : {}, {}", id, clientBordereau);
        if (clientBordereau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clientBordereau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientBordereauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClientBordereau result = clientBordereauRepository.save(clientBordereau);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clientBordereau.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /client-bordereaus/:id} : Partial updates given fields of an existing clientBordereau, field will ignore if it is null
     *
     * @param id the id of the clientBordereau to save.
     * @param clientBordereau the clientBordereau to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clientBordereau,
     * or with status {@code 400 (Bad Request)} if the clientBordereau is not valid,
     * or with status {@code 404 (Not Found)} if the clientBordereau is not found,
     * or with status {@code 500 (Internal Server Error)} if the clientBordereau couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/client-bordereaus/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClientBordereau> partialUpdateClientBordereau(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClientBordereau clientBordereau
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClientBordereau partially : {}, {}", id, clientBordereau);
        if (clientBordereau.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clientBordereau.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientBordereauRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClientBordereau> result = clientBordereauRepository
            .findById(clientBordereau.getId())
            .map(existingClientBordereau -> {
                if (clientBordereau.getDateDebut() != null) {
                    existingClientBordereau.setDateDebut(clientBordereau.getDateDebut());
                }
                if (clientBordereau.getDateFin() != null) {
                    existingClientBordereau.setDateFin(clientBordereau.getDateFin());
                }

                return existingClientBordereau;
            })
            .map(clientBordereauRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clientBordereau.getId().toString())
        );
    }

    /**
     * {@code GET  /client-bordereaus} : get all the clientBordereaus.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clientBordereaus in body.
     */
    @GetMapping("/client-bordereaus")
    public ResponseEntity<List<ClientBordereau>> getAllClientBordereaus(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ClientBordereaus");
        Page<ClientBordereau> page = clientBordereauRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /client-bordereaus/:id} : get the "id" clientBordereau.
     *
     * @param id the id of the clientBordereau to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clientBordereau, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/client-bordereaus/{id}")
    public ResponseEntity<ClientBordereau> getClientBordereau(@PathVariable Long id) {
        log.debug("REST request to get ClientBordereau : {}", id);
        Optional<ClientBordereau> clientBordereau = clientBordereauRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(clientBordereau);
    }

    /**
     * {@code DELETE  /client-bordereaus/:id} : delete the "id" clientBordereau.
     *
     * @param id the id of the clientBordereau to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/client-bordereaus/{id}")
    public ResponseEntity<Void> deleteClientBordereau(@PathVariable Long id) {
        log.debug("REST request to delete ClientBordereau : {}", id);
        clientBordereauRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
