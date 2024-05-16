package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DemandeRembourssementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DemandeRembourssement.class);
        DemandeRembourssement demandeRembourssement1 = new DemandeRembourssement();
        demandeRembourssement1.setId(1L);
        DemandeRembourssement demandeRembourssement2 = new DemandeRembourssement();
        demandeRembourssement2.setId(demandeRembourssement1.getId());
        assertThat(demandeRembourssement1).isEqualTo(demandeRembourssement2);
        demandeRembourssement2.setId(2L);
        assertThat(demandeRembourssement1).isNotEqualTo(demandeRembourssement2);
        demandeRembourssement1.setId(null);
        assertThat(demandeRembourssement1).isNotEqualTo(demandeRembourssement2);
    }
}
