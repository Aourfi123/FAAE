package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DemandeRembourssement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DemandeRembourssement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DemandeRembourssementRepository extends JpaRepository<DemandeRembourssement, Long> {}
