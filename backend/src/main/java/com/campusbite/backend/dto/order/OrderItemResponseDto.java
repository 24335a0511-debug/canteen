package com.campusbite.backend.dto.order;

import com.campusbite.backend.entity.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponseDto(
        Long id,
        Long menuItemId,
        String menuItemName,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {
    public static OrderItemResponseDto fromEntity(OrderItem item) {
        return new OrderItemResponseDto(
                item.getId(),
                item.getMenuItem().getId(),
                item.getMenuItem().getName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSubtotal()
        );
    }
}
