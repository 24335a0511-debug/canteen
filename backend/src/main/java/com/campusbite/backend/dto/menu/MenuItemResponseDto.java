package com.campusbite.backend.dto.menu;

import com.campusbite.backend.entity.MenuItem;

import java.math.BigDecimal;
import java.time.Instant;

public record MenuItemResponseDto(
        Long id,
        String name,
        String description,
        String category,
        BigDecimal price,
        boolean isVeg,
        int prepTimeMinutes,
        String station,
        String imageUrl,
        boolean isAvailable,
        Instant createdAt,
        Instant updatedAt
) {
    public static MenuItemResponseDto fromEntity(MenuItem item) {
        return new MenuItemResponseDto(
                item.getId(),
                item.getName(),
                item.getDescription(),
                item.getCategory(),
                item.getPrice(),
                item.isVeg(),
                item.getPrepTimeMinutes(),
                item.getStation(),
                item.getImageUrl(),
                item.isAvailable(),
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }
}
