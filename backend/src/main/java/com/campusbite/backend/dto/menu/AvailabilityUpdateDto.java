package com.campusbite.backend.dto.menu;

import jakarta.validation.constraints.NotNull;

public record AvailabilityUpdateDto(
        @NotNull(message = "isAvailable field is required")
        Boolean isAvailable
) {
}
