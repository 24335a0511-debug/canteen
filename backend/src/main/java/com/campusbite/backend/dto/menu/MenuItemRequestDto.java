package com.campusbite.backend.dto.menu;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MenuItemRequestDto(
        @NotBlank(message = "Item name is required")
        @Size(max = 150, message = "Item name must not exceed 150 characters")
        String name,

        String description,

        @NotBlank(message = "Category is required")
        @Size(max = 50, message = "Category must not exceed 50 characters")
        String category,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than zero")
        BigDecimal price,

        boolean isVeg,

        int prepTimeMinutes,

        @NotBlank(message = "Station is required")
        @Size(max = 50)
        String station,

        @Size(max = 500)
        String imageUrl,

        boolean isAvailable
) {
}
