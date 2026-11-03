package com.campusbite.backend.service;

import com.campusbite.backend.dto.order.CreateOrderItemDto;
import com.campusbite.backend.dto.order.CreateOrderRequestDto;
import com.campusbite.backend.dto.order.OrderResponseDto;
import com.campusbite.backend.entity.*;
import com.campusbite.backend.exception.BadRequestException;
import com.campusbite.backend.exception.ResourceNotFoundException;
import com.campusbite.backend.repository.CustomerOrderRepository;
import com.campusbite.backend.repository.MenuItemRepository;
import com.campusbite.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Transactional(readOnly = true)
public class OrderService {

    private final CustomerOrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    private static final AtomicLong ORDER_COUNTER = new AtomicLong(System.currentTimeMillis() % 10000);

    public OrderService(CustomerOrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAllWithDetails().stream()
                .map(OrderResponseDto::fromEntity)
                .toList();
    }

    public OrderResponseDto getOrderById(Long id) {
        CustomerOrder order = orderRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", "id", id));
        return OrderResponseDto.fromEntity(order);
    }

    public List<OrderResponseDto> getKitchenOrders() {
        List<OrderStatus> activeStatuses = List.of(
                OrderStatus.PLACED,
                OrderStatus.PREPARING,
                OrderStatus.READY
        );
        return orderRepository.findByStatusInWithDetails(activeStatuses).stream()
                .map(OrderResponseDto::fromEntity)
                .toList();
    }

    @Transactional
    public OrderResponseDto createOrder(CreateOrderRequestDto request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }

        User customer = resolveCustomer(request);

        String orderNumber = generateOrderNumber();
        String tokenNumber = generateTokenNumber();

        CustomerOrder order = new CustomerOrder(
                orderNumber,
                tokenNumber,
                customer,
                BigDecimal.ZERO,
                request.notes()
        );

        BigDecimal computedTotal = BigDecimal.ZERO;

        for (CreateOrderItemDto itemDto : request.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemDto.menuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemDto.menuItemId()));

            // Business rule: Validate item availability before ordering
            if (!menuItem.isAvailable()) {
                throw new BadRequestException(String.format("Item '%s' is currently out of stock and cannot be ordered.", menuItem.getName()));
            }

            if (itemDto.quantity() <= 0) {
                throw new BadRequestException("Quantity must be greater than zero for item: " + menuItem.getName());
            }

            // Business rule: Calculate totals on backend; never trust frontend
            BigDecimal unitPrice = menuItem.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemDto.quantity()));
            computedTotal = computedTotal.add(subtotal);

            OrderItem orderItem = new OrderItem(order, menuItem, itemDto.quantity(), unitPrice, subtotal);
            order.addItem(orderItem);
        }

        order.setTotalAmount(computedTotal);

        CustomerOrder savedOrder = orderRepository.save(order);
        return OrderResponseDto.fromEntity(savedOrder);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatus newStatus, String comment) {
        CustomerOrder order = orderRepository.findByIdWithDetails(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("CustomerOrder", "id", orderId));

        if (order.getStatus() == OrderStatus.COMPLETED && newStatus != OrderStatus.COMPLETED) {
            throw new BadRequestException("Completed orders cannot change status");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cancelled orders cannot be reopened");
        }

        order.updateStatus(newStatus, comment != null ? comment : "Status updated to " + newStatus);
        CustomerOrder updated = orderRepository.save(order);
        return OrderResponseDto.fromEntity(updated);
    }

    private User resolveCustomer(CreateOrderRequestDto request) {
        if (request.customerId() != null) {
            return userRepository.findById(request.customerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.customerId()));
        }

        if (request.customerEmail() != null && !request.customerEmail().isBlank()) {
            return userRepository.findByEmail(request.customerEmail())
                    .orElseGet(() -> {
                        String name = (request.customerName() != null && !request.customerName().isBlank())
                                ? request.customerName()
                                : "Student Customer";
                        User newUser = new User(name, request.customerEmail(), null, "STUDENT");
                        return userRepository.save(newUser);
                    });
        }

        // Default to seeded demo user
        return userRepository.findByEmail("ashal@campusbite.edu")
                .orElseGet(() -> {
                    User defaultUser = new User("Ashal Kumar", "ashal@campusbite.edu", "9876543210", "STUDENT");
                    return userRepository.save(defaultUser);
                });
    }

    private String generateOrderNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long seq = ORDER_COUNTER.incrementAndGet() % 10000;
        return String.format("CB-%s-%04d", datePart, seq);
    }

    private String generateTokenNumber() {
        int token = ThreadLocalRandom.current().nextInt(101, 999);
        return "T-" + token;
    }
}
