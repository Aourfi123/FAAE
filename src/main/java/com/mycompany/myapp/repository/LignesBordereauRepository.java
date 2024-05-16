package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.LignesBordereau;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LignesBordereau entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LignesBordereauRepository extends JpaRepository<LignesBordereau, Long> {}
