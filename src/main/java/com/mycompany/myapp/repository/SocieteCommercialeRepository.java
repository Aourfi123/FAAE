package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SocieteCommerciale;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SocieteCommerciale entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SocieteCommercialeRepository extends JpaRepository<SocieteCommerciale, Long> {}
