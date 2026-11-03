package com.campusbite.backend.controller;

import com.campusbite.backend.dto.menu.AvailabilityUpdateDto;
import com.campusbite.backend.dto.menu.MenuItemRequestDto;
import com.campusbite.backend.dto.menu.MenuItemResponseDto;
import com.campusbite.backend.security.WebSecurityConfig;
import com.campusbite.backend.service.MenuService;
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

@WebMvcTest(MenuController.class)
@Import(WebSecurityConfig.class)
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MenuService menuService;

    @Test
    @DisplayName("GET /api/menu should return 200 OK with menu items list")
    void testGetMenu() throws Exception {
        MenuItemResponseDto item = new MenuItemResponseDto(
                1L, "Paneer Butter Masala", "Rich gravy", "Meals",
                new BigDecimal("140.00"), true, 12, "Meals Tawa", null, true,
                Instant.now(), Instant.now()
        );

        when(menuService.getMenuItems(null, null)).thenReturn(List.of(item));

        mockMvc.perform(get("/api/menu")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].name").value("Paneer Butter Masala"))
                .andExpect(jsonPath("$.data[0].price").value(140.00));
    }

    @Test
    @DisplayName("POST /api/menu should create dish and return 201 Created")
    void testCreateMenuItem() throws Exception {
        MenuItemRequestDto request = new MenuItemRequestDto(
                "Veg Burger", "Crispy patty", "Fast Food",
                new BigDecimal("80.00"), true, 10, "Quick Snacks", null, true
        );

        MenuItemResponseDto created = new MenuItemResponseDto(
                2L, "Veg Burger", "Crispy patty", "Fast Food",
                new BigDecimal("80.00"), true, 10, "Quick Snacks", null, true,
                Instant.now(), Instant.now()
        );

        when(menuService.createMenuItem(any(MenuItemRequestDto.class))).thenReturn(created);

        mockMvc.perform(post("/api/menu")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(2))
                .andExpect(jsonPath("$.data.name").value("Veg Burger"));
    }

    @Test
    @DisplayName("PATCH /api/menu/{id}/availability should toggle stock and return 200 OK")
    void testUpdateAvailability() throws Exception {
        AvailabilityUpdateDto update = new AvailabilityUpdateDto(false);

        MenuItemResponseDto updated = new MenuItemResponseDto(
                1L, "Paneer Butter Masala", "Rich gravy", "Meals",
                new BigDecimal("140.00"), true, 12, "Meals Tawa", null, false,
                Instant.now(), Instant.now()
        );

        when(menuService.updateAvailability(eq(1L), eq(false))).thenReturn(updated);

        mockMvc.perform(patch("/api/menu/1/availability")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isAvailable").value(false));
    }
}
