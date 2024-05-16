package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.DetailsDemande;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DetailsDemande entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DetailsDemandeRepository extends JpaRepository<DetailsDemande, Long> {}
