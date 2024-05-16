package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Bordereau;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Bordereau entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BordereauRepository extends JpaRepository<Bordereau, Long> {}
