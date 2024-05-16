package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ClientBordereau;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ClientBordereau entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClientBordereauRepository extends JpaRepository<ClientBordereau, Long> {}
