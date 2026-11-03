package com.campusbite.backend.controller;

import com.campusbite.backend.dto.order.OrderResponseDto;
import com.campusbite.backend.dto.order.OrderStatusUpdateDto;
import com.campusbite.backend.entity.OrderStatus;
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

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(KitchenController.class)
@Import(WebSecurityConfig.class)
class KitchenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private OrderService orderService;

    @Test
    @DisplayName("GET /api/kitchen/orders should return active kitchen tickets")
    void testGetActiveKitchenOrders() throws Exception {
        OrderResponseDto ticket = new OrderResponseDto(
                50L, "CB-20261103-0005", "T-108", 1L, "Ashal Kumar", "ashal@campusbite.edu",
                OrderStatus.PLACED, new BigDecimal("140.00"), null,
                List.of(), List.of(), Instant.now(), Instant.now()
        );

        when(orderService.getKitchenOrders()).thenReturn(List.of(ticket));

        mockMvc.perform(get("/api/kitchen/orders")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].tokenNumber").value("T-108"))
                .andExpect(jsonPath("$.data[0].status").value("PLACED"));
    }

    @Test
    @DisplayName("PATCH /api/kitchen/orders/{id}/status should update ticket status to READY")
    void testUpdateKitchenTicketStatus() throws Exception {
        OrderStatusUpdateDto updateDto = new OrderStatusUpdateDto(OrderStatus.READY, "Food prepared, ready at counter");

        OrderResponseDto responseDto = new OrderResponseDto(
                50L, "CB-20261103-0005", "T-108", 1L, "Ashal Kumar", "ashal@campusbite.edu",
                OrderStatus.READY, new BigDecimal("140.00"), null,
                List.of(), List.of(), Instant.now(), Instant.now()
        );

        when(orderService.updateOrderStatus(eq(50L), eq(OrderStatus.READY), eq("Food prepared, ready at counter")))
                .thenReturn(responseDto);

        mockMvc.perform(patch("/api/kitchen/orders/50/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("READY"));
    }
}
