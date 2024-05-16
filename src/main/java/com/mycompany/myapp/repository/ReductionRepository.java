package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Reduction;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Reduction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReductionRepository extends JpaRepository<Reduction, Long> {}
