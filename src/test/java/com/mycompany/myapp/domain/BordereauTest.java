package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BordereauTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bordereau.class);
        Bordereau bordereau1 = new Bordereau();
        bordereau1.setId(1L);
        Bordereau bordereau2 = new Bordereau();
        bordereau2.setId(bordereau1.getId());
        assertThat(bordereau1).isEqualTo(bordereau2);
        bordereau2.setId(2L);
        assertThat(bordereau1).isNotEqualTo(bordereau2);
        bordereau1.setId(null);
        assertThat(bordereau1).isNotEqualTo(bordereau2);
    }
}
