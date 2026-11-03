package com.campusbite.backend.controller;

import com.campusbite.backend.dto.ApiResponse;
import com.campusbite.backend.dto.menu.AvailabilityUpdateDto;
import com.campusbite.backend.dto.menu.MenuItemRequestDto;
import com.campusbite.backend.dto.menu.MenuItemResponseDto;
import com.campusbite.backend.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemResponseDto>>> getMenu(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean availableOnly
    ) {
        List<MenuItemResponseDto> items = menuService.getMenuItems(category, availableOnly);
        return ResponseEntity.ok(ApiResponse.ok("Menu items retrieved successfully", items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponseDto>> getMenuItemById(@PathVariable Long id) {
        MenuItemResponseDto item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.ok("Menu item retrieved successfully", item));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemResponseDto>> createMenuItem(
            @Valid @RequestBody MenuItemRequestDto request
    ) {
        MenuItemResponseDto created = menuService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Menu item created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponseDto>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequestDto request
    ) {
        MenuItemResponseDto updated = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Menu item updated successfully", updated));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<MenuItemResponseDto>> updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody AvailabilityUpdateDto request
    ) {
        MenuItemResponseDto updated = menuService.updateAvailability(id, request.isAvailable());
        return ResponseEntity.ok(ApiResponse.ok("Menu item availability updated successfully", updated));
    }
}
