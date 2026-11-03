package com.campusbite.backend.dto;

import java.time.Instant;
import java.util.List;

public record ErrorResponseDto(
        int status,
        String error,
        String message,
        String path,
        Instant timestamp,
        List<String> validationErrors
) {
    public static ErrorResponseDto of(int status, String error, String message, String path) {
        return new ErrorResponseDto(status, error, message, path, Instant.now(), null);
    }

    public static ErrorResponseDto of(int status, String error, String message, String path, List<String> validationErrors) {
        return new ErrorResponseDto(status, error, message, path, Instant.now(), validationErrors);
    }
}
