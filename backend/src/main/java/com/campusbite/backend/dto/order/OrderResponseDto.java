package com.campusbite.backend.dto.order;

import com.campusbite.backend.entity.CustomerOrder;
import com.campusbite.backend.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponseDto(
        Long id,
        String orderNumber,
        String tokenNumber,
        Long customerId,
        String customerName,
        String customerEmail,
        OrderStatus status,
        BigDecimal totalAmount,
        String notes,
        List<OrderItemResponseDto> items,
        List<OrderStatusHistoryDto> statusHistory,
        Instant createdAt,
        Instant updatedAt
) {
    public static OrderResponseDto fromEntity(CustomerOrder order) {
        List<OrderItemResponseDto> items = order.getItems() != null
                ? order.getItems().stream().map(OrderItemResponseDto::fromEntity).toList()
                : List.of();

        List<OrderStatusHistoryDto> history = order.getStatusHistory() != null
                ? order.getStatusHistory().stream().map(OrderStatusHistoryDto::fromEntity).toList()
                : List.of();

        return new OrderResponseDto(
                order.getId(),
                order.getOrderNumber(),
                order.getTokenNumber(),
                order.getCustomer().getId(),
                order.getCustomer().getName(),
                order.getCustomer().getEmail(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getNotes(),
                items,
                history,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
