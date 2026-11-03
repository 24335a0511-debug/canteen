package com.campusbite.backend.dto;

import java.time.Instant;
import java.util.Map;

public record HealthResponseDto(
        String status,
        String appName,
        String version,
        String javaVersion,
        Instant timestamp,
        Map<String, String> details
) {
    public static HealthResponseDto up(String appName, String version, Map<String, String> details) {
        return new HealthResponseDto(
                "UP",
                appName,
                version,
                System.getProperty("java.version"),
                Instant.now(),
                details
        );
    }
}
