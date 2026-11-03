package com.campusbite.backend.controller;

import com.campusbite.backend.dto.ApiResponse;
import com.campusbite.backend.dto.order.CreateOrderRequestDto;
import com.campusbite.backend.dto.order.OrderResponseDto;
import com.campusbite.backend.dto.order.OrderStatusUpdateDto;
import com.campusbite.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponseDto>> placeOrder(
            @Valid @RequestBody CreateOrderRequestDto request
    ) {
        OrderResponseDto created = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order placed successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getAllOrders() {
        List<OrderResponseDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok("Orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderById(@PathVariable Long id) {
        OrderResponseDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok("Order retrieved successfully", order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateDto request
    ) {
        OrderResponseDto updated = orderService.updateOrderStatus(id, request.status(), request.comment());
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", updated));
    }
}
