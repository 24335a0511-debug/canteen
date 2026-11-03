package com.campusbite.backend.controller;

import com.campusbite.backend.dto.ApiResponse;
import com.campusbite.backend.dto.HealthResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.application.name:campusbite-backend}")
    private String applicationName;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<HealthResponseDto>> checkHealth() {
        Map<String, String> details = new LinkedHashMap<>();
        details.put("activeProfile", activeProfile);
        details.put("database", "prod".equalsIgnoreCase(activeProfile) ? "PostgreSQL" : "H2 In-Memory (Dev)");
        details.put("security", "Spring Security Active");
        details.put("phase", "Phase 1 - Java Backend Foundation");

        HealthResponseDto health = HealthResponseDto.up(
                applicationName,
                "1.0.0-SNAPSHOT",
                details
        );

        return ResponseEntity.ok(ApiResponse.ok("Service is healthy", health));
    }
}
