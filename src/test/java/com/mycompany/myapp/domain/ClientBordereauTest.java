package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClientBordereauTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClientBordereau.class);
        ClientBordereau clientBordereau1 = new ClientBordereau();
        clientBordereau1.setId(1L);
        ClientBordereau clientBordereau2 = new ClientBordereau();
        clientBordereau2.setId(clientBordereau1.getId());
        assertThat(clientBordereau1).isEqualTo(clientBordereau2);
        clientBordereau2.setId(2L);
        assertThat(clientBordereau1).isNotEqualTo(clientBordereau2);
        clientBordereau1.setId(null);
        assertThat(clientBordereau1).isNotEqualTo(clientBordereau2);
    }
}
