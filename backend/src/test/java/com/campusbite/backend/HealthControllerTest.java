package com.campusbite.backend;

import com.campusbite.backend.controller.HealthController;
import com.campusbite.backend.security.WebSecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HealthController.class)
@Import(WebSecurityConfig.class)
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("GET /api/health should return 200 OK with UP status and valid JSON payload")
    void shouldReturnHealthStatusUp() throws Exception {
        mockMvc.perform(get("/api/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.appName").exists())
                .andExpect(jsonPath("$.data.version").value("1.0.0-SNAPSHOT"));
    }
}
