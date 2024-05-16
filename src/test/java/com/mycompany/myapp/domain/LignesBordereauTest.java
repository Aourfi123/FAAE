package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LignesBordereauTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LignesBordereau.class);
        LignesBordereau lignesBordereau1 = new LignesBordereau();
        lignesBordereau1.setId(1L);
        LignesBordereau lignesBordereau2 = new LignesBordereau();
        lignesBordereau2.setId(lignesBordereau1.getId());
        assertThat(lignesBordereau1).isEqualTo(lignesBordereau2);
        lignesBordereau2.setId(2L);
        assertThat(lignesBordereau1).isNotEqualTo(lignesBordereau2);
        lignesBordereau1.setId(null);
        assertThat(lignesBordereau1).isNotEqualTo(lignesBordereau2);
    }
}
