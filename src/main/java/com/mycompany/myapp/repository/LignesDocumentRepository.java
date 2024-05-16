package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.LignesDocument;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LignesDocument entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LignesDocumentRepository extends JpaRepository<LignesDocument, Long> {}
