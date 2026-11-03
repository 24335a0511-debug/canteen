package com.campusbite.backend.service;

import com.campusbite.backend.dto.menu.MenuItemRequestDto;
import com.campusbite.backend.dto.menu.MenuItemResponseDto;
import com.campusbite.backend.entity.MenuItem;
import com.campusbite.backend.repository.MenuItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private MenuItemRepository menuItemRepository;

    @InjectMocks
    private MenuService menuService;

    private MenuItem sampleItem;

    @BeforeEach
    void setUp() {
        sampleItem = new MenuItem(
                "Masala Dosa",
                "Crispy crepe with potato filling",
                "Breakfast",
                new BigDecimal("65.00"),
                true,
                8,
                "Meals Tawa",
                "http://example.com/dosa.jpg",
                true
        );
        sampleItem.setId(1L);
    }

    @Test
    @DisplayName("getMenuItems should return list of mapped DTOs")
    void testGetMenuItems() {
        when(menuItemRepository.findAll()).thenReturn(List.of(sampleItem));

        List<MenuItemResponseDto> results = menuService.getMenuItems(null, false);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).name()).isEqualTo("Masala Dosa");
        assertThat(results.get(0).price()).isEqualByComparingTo("65.00");
    }

    @Test
    @DisplayName("getMenuItemById should return item when found")
    void testGetMenuItemById() {
        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));

        MenuItemResponseDto result = menuService.getMenuItemById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Masala Dosa");
    }

    @Test
    @DisplayName("createMenuItem should save and return created item")
    void testCreateMenuItem() {
        MenuItemRequestDto request = new MenuItemRequestDto(
                "Filter Coffee",
                "South Indian filter coffee",
                "Beverages",
                new BigDecimal("25.00"),
                true,
                5,
                "Beverage Bar",
                null,
                true
        );

        when(menuItemRepository.save(any(MenuItem.class))).thenAnswer(invocation -> {
            MenuItem item = invocation.getArgument(0);
            item.setId(2L);
            return item;
        });

        MenuItemResponseDto created = menuService.createMenuItem(request);

        assertThat(created.id()).isEqualTo(2L);
        assertThat(created.name()).isEqualTo("Filter Coffee");
        assertThat(created.price()).isEqualByComparingTo("25.00");
    }

    @Test
    @DisplayName("updateAvailability should toggle isAvailable flag")
    void testUpdateAvailability() {
        when(menuItemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));
        when(menuItemRepository.save(any(MenuItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MenuItemResponseDto updated = menuService.updateAvailability(1L, false);

        assertThat(updated.isAvailable()).isFalse();
        verify(menuItemRepository, times(1)).save(sampleItem);
    }
}
