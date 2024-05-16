package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LignesDocumentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LignesDocument.class);
        LignesDocument lignesDocument1 = new LignesDocument();
        lignesDocument1.setId(1L);
        LignesDocument lignesDocument2 = new LignesDocument();
        lignesDocument2.setId(lignesDocument1.getId());
        assertThat(lignesDocument1).isEqualTo(lignesDocument2);
        lignesDocument2.setId(2L);
        assertThat(lignesDocument1).isNotEqualTo(lignesDocument2);
        lignesDocument1.setId(null);
        assertThat(lignesDocument1).isNotEqualTo(lignesDocument2);
    }
}
