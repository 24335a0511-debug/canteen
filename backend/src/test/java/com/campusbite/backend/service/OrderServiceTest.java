package com.campusbite.backend.service;

import com.campusbite.backend.dto.order.CreateOrderItemDto;
import com.campusbite.backend.dto.order.CreateOrderRequestDto;
import com.campusbite.backend.dto.order.OrderResponseDto;
import com.campusbite.backend.entity.*;
import com.campusbite.backend.exception.BadRequestException;
import com.campusbite.backend.repository.CustomerOrderRepository;
import com.campusbite.backend.repository.MenuItemRepository;
import com.campusbite.backend.repository.UserRepository;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private CustomerOrderRepository orderRepository;

    @Mock
    private MenuItemRepository menuItemRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    private User sampleCustomer;
    private MenuItem itemAvailable;
    private MenuItem itemUnavailable;

    @BeforeEach
    void setUp() {
        sampleCustomer = new User("Ashal Kumar", "ashal@campusbite.edu", "9876543210", "STUDENT");
        sampleCustomer.setId(10L);

        itemAvailable = new MenuItem("Veg Biryani", "Fragrant rice dish", "Meals", new BigDecimal("110.00"), true, 15, "Meals Tawa", null, true);
        itemAvailable.setId(100L);

        itemUnavailable = new MenuItem("Cold Coffee", "Chilled espresso", "Beverages", new BigDecimal("55.00"), true, 5, "Beverage Bar", null, false);
        itemUnavailable.setId(101L);
    }

    @Test
    @DisplayName("createOrder should calculate total on backend and save order successfully")
    void testSuccessfulOrderPlacement() {
        CreateOrderRequestDto request = new CreateOrderRequestDto(
                10L,
                "ashal@campusbite.edu",
                "Ashal Kumar",
                List.of(new CreateOrderItemDto(100L, 2)), // 2 * 110.00 = 220.00
                "Less spicy please"
        );

        when(userRepository.findById(10L)).thenReturn(Optional.of(sampleCustomer));
        when(menuItemRepository.findById(100L)).thenReturn(Optional.of(itemAvailable));
        when(orderRepository.save(any(CustomerOrder.class))).thenAnswer(invocation -> {
            CustomerOrder order = invocation.getArgument(0);
            order.setId(1L);
            return order;
        });

        OrderResponseDto response = orderService.createOrder(request);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.totalAmount()).isEqualByComparingTo("220.00");
        assertThat(response.status()).isEqualTo(OrderStatus.PLACED);
        assertThat(response.tokenNumber()).startsWith("T-");
        assertThat(response.orderNumber()).startsWith("CB-");
        assertThat(response.items()).hasSize(1);
        assertThat(response.items().get(0).unitPrice()).isEqualByComparingTo("110.00");
        assertThat(response.items().get(0).subtotal()).isEqualByComparingTo("220.00");

        verify(orderRepository, times(1)).save(any(CustomerOrder.class));
    }

    @Test
    @DisplayName("createOrder should reject unavailable out-of-stock items")
    void testUnavailableItemRejection() {
        CreateOrderRequestDto request = new CreateOrderRequestDto(
                10L,
                "ashal@campusbite.edu",
                "Ashal Kumar",
                List.of(new CreateOrderItemDto(101L, 1)),
                null
        );

        when(userRepository.findById(10L)).thenReturn(Optional.of(sampleCustomer));
        when(menuItemRepository.findById(101L)).thenReturn(Optional.of(itemUnavailable));

        assertThatThrownBy(() -> orderService.createOrder(request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Item 'Cold Coffee' is currently out of stock");

        verify(orderRepository, never()).save(any(CustomerOrder.class));
    }

    @Test
    @DisplayName("updateOrderStatus should update order status and log history")
    void testOrderStatusUpdate() {
        CustomerOrder order = new CustomerOrder("CB-20261103-0001", "T-402", sampleCustomer, new BigDecimal("110.00"), null);
        order.setId(1L);

        when(orderRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(CustomerOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponseDto updated = orderService.updateOrderStatus(1L, OrderStatus.PREPARING, "Chef started cooking");

        assertThat(updated.status()).isEqualTo(OrderStatus.PREPARING);
        assertThat(order.getStatusHistory()).isNotEmpty();
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    @DisplayName("updateOrderStatus should reject modifying completed orders")
    void testCompletedOrderCannotChange() {
        CustomerOrder order = new CustomerOrder("CB-20261103-0001", "T-402", sampleCustomer, new BigDecimal("110.00"), null);
        order.setId(1L);
        order.setStatus(OrderStatus.COMPLETED);

        when(orderRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.updateOrderStatus(1L, OrderStatus.PLACED, "Try reset"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Completed orders cannot change status");

        verify(orderRepository, never()).save(order);
    }
}
