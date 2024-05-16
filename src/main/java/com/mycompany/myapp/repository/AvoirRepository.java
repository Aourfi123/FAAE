package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Avoir;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Avoir entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AvoirRepository extends JpaRepository<Avoir, Long> {}
