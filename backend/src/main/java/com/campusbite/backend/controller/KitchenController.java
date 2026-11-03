package com.campusbite.backend.controller;

import com.campusbite.backend.dto.ApiResponse;
import com.campusbite.backend.dto.order.OrderResponseDto;
import com.campusbite.backend.dto.order.OrderStatusUpdateDto;
import com.campusbite.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
public class KitchenController {

    private final OrderService orderService;

    public KitchenController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getActiveKitchenOrders() {
        List<OrderResponseDto> activeOrders = orderService.getKitchenOrders();
        return ResponseEntity.ok(ApiResponse.ok("Active kitchen tickets retrieved successfully", activeOrders));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateKitchenOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDto request
    ) {
        OrderResponseDto updated = orderService.updateOrderStatus(id, request.status(), request.comment());
        return ResponseEntity.ok(ApiResponse.ok("Kitchen ticket status updated successfully", updated));
    }
}
