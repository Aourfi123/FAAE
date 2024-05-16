package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SocieteCommercialeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SocieteCommerciale.class);
        SocieteCommerciale societeCommerciale1 = new SocieteCommerciale();
        societeCommerciale1.setId(1L);
        SocieteCommerciale societeCommerciale2 = new SocieteCommerciale();
        societeCommerciale2.setId(societeCommerciale1.getId());
        assertThat(societeCommerciale1).isEqualTo(societeCommerciale2);
        societeCommerciale2.setId(2L);
        assertThat(societeCommerciale1).isNotEqualTo(societeCommerciale2);
        societeCommerciale1.setId(null);
        assertThat(societeCommerciale1).isNotEqualTo(societeCommerciale2);
    }
}
