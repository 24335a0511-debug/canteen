package com.campusbite.backend.controller;

import com.campusbite.backend.dto.order.*;
import com.campusbite.backend.entity.OrderStatus;
import com.campusbite.backend.exception.BadRequestException;
import com.campusbite.backend.security.WebSecurityConfig;
import com.campusbite.backend.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@Import(WebSecurityConfig.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private OrderService orderService;

    @Test
    @DisplayName("POST /api/orders should place order and return 201 Created")
    void testPlaceOrderSuccess() throws Exception {
        CreateOrderRequestDto request = new CreateOrderRequestDto(
                1L, "ashal@campusbite.edu", "Ashal Kumar",
                List.of(new CreateOrderItemDto(10L, 2)),
                "Special request"
        );

        OrderItemResponseDto itemDto = new OrderItemResponseDto(1L, 10L, "Biryani", 2, new BigDecimal("110.00"), new BigDecimal("220.00"));
        OrderResponseDto responseDto = new OrderResponseDto(
                100L, "CB-20261103-0001", "T-402", 1L, "Ashal Kumar", "ashal@campusbite.edu",
                OrderStatus.PLACED, new BigDecimal("220.00"), "Special request",
                List.of(itemDto), List.of(), Instant.now(), Instant.now()
        );

        when(orderService.createOrder(any(CreateOrderRequestDto.class))).thenReturn(responseDto);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value("CB-20261103-0001"))
                .andExpect(jsonPath("$.data.totalAmount").value(220.00))
                .andExpect(jsonPath("$.data.status").value("PLACED"));
    }

    @Test
    @DisplayName("POST /api/orders with unavailable item should return 400 Bad Request")
    void testPlaceOrderUnavailableItem() throws Exception {
        CreateOrderRequestDto request = new CreateOrderRequestDto(
                1L, "ashal@campusbite.edu", "Ashal Kumar",
                List.of(new CreateOrderItemDto(10L, 1)),
                null
        );

        when(orderService.createOrder(any(CreateOrderRequestDto.class)))
                .thenThrow(new BadRequestException("Item 'Cold Coffee' is currently out of stock and cannot be ordered."));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Item 'Cold Coffee' is currently out of stock and cannot be ordered."));
    }

    @Test
    @DisplayName("PATCH /api/orders/{id}/status should update status and return 200 OK")
    void testUpdateOrderStatus() throws Exception {
        OrderStatusUpdateDto updateDto = new OrderStatusUpdateDto(OrderStatus.PREPARING, "Started cooking");

        OrderResponseDto responseDto = new OrderResponseDto(
                100L, "CB-20261103-0001", "T-402", 1L, "Ashal Kumar", "ashal@campusbite.edu",
                OrderStatus.PREPARING, new BigDecimal("220.00"), null,
                List.of(), List.of(), Instant.now(), Instant.now()
        );

        when(orderService.updateOrderStatus(eq(100L), eq(OrderStatus.PREPARING), eq("Started cooking")))
                .thenReturn(responseDto);

        mockMvc.perform(patch("/api/orders/100/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PREPARING"));
    }
}
