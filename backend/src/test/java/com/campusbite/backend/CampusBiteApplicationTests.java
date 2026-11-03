package com.campusbite.backend;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class CampusBiteApplicationTests {

    @Test
    @DisplayName("Verify Spring Boot application context loads cleanly with H2 dev profile")
    void contextLoads() {
        // Successfully verifies Spring Boot 3 context, JPA entity mapping, and Flyway migration on H2
    }
}
