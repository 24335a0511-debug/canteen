package com.campusbite.backend.dto.order;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateOrderItemDto(
        @NotNull(message = "menuItemId is required")
        Long menuItemId,

        @Positive(message = "quantity must be greater than zero")
        int quantity
) {
}
