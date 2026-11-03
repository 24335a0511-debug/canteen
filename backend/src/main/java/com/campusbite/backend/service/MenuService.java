package com.campusbite.backend.service;

import com.campusbite.backend.dto.menu.MenuItemRequestDto;
import com.campusbite.backend.dto.menu.MenuItemResponseDto;
import com.campusbite.backend.entity.MenuItem;
import com.campusbite.backend.exception.ResourceNotFoundException;
import com.campusbite.backend.repository.MenuItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public MenuService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public List<MenuItemResponseDto> getMenuItems(String category, Boolean availableOnly) {
        List<MenuItem> items;

        if (category != null && !category.isBlank()) {
            if (Boolean.TRUE.equals(availableOnly)) {
                items = menuItemRepository.findByCategoryIgnoreCaseAndIsAvailableTrue(category);
            } else {
                items = menuItemRepository.findByCategoryIgnoreCase(category);
            }
        } else {
            if (Boolean.TRUE.equals(availableOnly)) {
                items = menuItemRepository.findByIsAvailableTrue();
            } else {
                items = menuItemRepository.findAll();
            }
        }

        return items.stream()
                .map(MenuItemResponseDto::fromEntity)
                .toList();
    }

    public MenuItemResponseDto getMenuItemById(Long id) {
        MenuItem item = findMenuItemOrThrow(id);
        return MenuItemResponseDto.fromEntity(item);
    }

    @Transactional
    public MenuItemResponseDto createMenuItem(MenuItemRequestDto dto) {
        MenuItem item = new MenuItem(
                dto.name(),
                dto.description(),
                dto.category(),
                dto.price(),
                dto.isVeg(),
                dto.prepTimeMinutes() > 0 ? dto.prepTimeMinutes() : 10,
                dto.station(),
                dto.imageUrl(),
                dto.isAvailable()
        );
        MenuItem saved = menuItemRepository.save(item);
        return MenuItemResponseDto.fromEntity(saved);
    }

    @Transactional
    public MenuItemResponseDto updateMenuItem(Long id, MenuItemRequestDto dto) {
        MenuItem item = findMenuItemOrThrow(id);
        item.setName(dto.name());
        item.setDescription(dto.description());
        item.setCategory(dto.category());
        item.setPrice(dto.price());
        item.setVeg(dto.isVeg());
        item.setPrepTimeMinutes(dto.prepTimeMinutes() > 0 ? dto.prepTimeMinutes() : 10);
        item.setStation(dto.station());
        item.setImageUrl(dto.imageUrl());
        item.setAvailable(dto.isAvailable());

        MenuItem updated = menuItemRepository.save(item);
        return MenuItemResponseDto.fromEntity(updated);
    }

    @Transactional
    public MenuItemResponseDto updateAvailability(Long id, boolean isAvailable) {
        MenuItem item = findMenuItemOrThrow(id);
        item.setAvailable(isAvailable);
        MenuItem updated = menuItemRepository.save(item);
        return MenuItemResponseDto.fromEntity(updated);
    }

    private MenuItem findMenuItemOrThrow(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
    }
}
