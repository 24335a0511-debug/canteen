package com.campusbite.backend.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateOrderRequestDto(
        Long customerId,
        String customerEmail,
        String customerName,

        @NotEmpty(message = "Order must contain at least one item")
        @Valid
        List<CreateOrderItemDto> items,

        String notes
) {
}
