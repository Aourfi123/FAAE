package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DetailsDemandeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DetailsDemande.class);
        DetailsDemande detailsDemande1 = new DetailsDemande();
        detailsDemande1.setId(1L);
        DetailsDemande detailsDemande2 = new DetailsDemande();
        detailsDemande2.setId(detailsDemande1.getId());
        assertThat(detailsDemande1).isEqualTo(detailsDemande2);
        detailsDemande2.setId(2L);
        assertThat(detailsDemande1).isNotEqualTo(detailsDemande2);
        detailsDemande1.setId(null);
        assertThat(detailsDemande1).isNotEqualTo(detailsDemande2);
    }
}
