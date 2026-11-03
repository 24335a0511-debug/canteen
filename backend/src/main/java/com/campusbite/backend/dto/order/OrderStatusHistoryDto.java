package com.campusbite.backend.dto.order;

import com.campusbite.backend.entity.OrderStatus;
import com.campusbite.backend.entity.OrderStatusHistory;

import java.time.Instant;

public record OrderStatusHistoryDto(
        Long id,
        OrderStatus fromStatus,
        OrderStatus toStatus,
        String comment,
        Instant changedAt
) {
    public static OrderStatusHistoryDto fromEntity(OrderStatusHistory history) {
        return new OrderStatusHistoryDto(
                history.getId(),
                history.getFromStatus(),
                history.getToStatus(),
                history.getComment(),
                history.getChangedAt()
        );
    }
}
