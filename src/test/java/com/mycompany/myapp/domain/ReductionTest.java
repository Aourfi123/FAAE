package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReductionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reduction.class);
        Reduction reduction1 = new Reduction();
        reduction1.setId(1L);
        Reduction reduction2 = new Reduction();
        reduction2.setId(reduction1.getId());
        assertThat(reduction1).isEqualTo(reduction2);
        reduction2.setId(2L);
        assertThat(reduction1).isNotEqualTo(reduction2);
        reduction1.setId(null);
        assertThat(reduction1).isNotEqualTo(reduction2);
    }
}
