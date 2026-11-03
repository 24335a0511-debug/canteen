package com.campusbite.backend.dto.order;

import com.campusbite.backend.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateDto(
        @NotNull(message = "status is required")
        OrderStatus status,

        String comment
) {
}
