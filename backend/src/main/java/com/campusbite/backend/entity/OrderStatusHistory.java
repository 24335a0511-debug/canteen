package com.campusbite.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "order_status_history")
public class OrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 50)
    private OrderStatus fromStatus;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 50)
    private OrderStatus toStatus;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "changed_at", nullable = false, updatable = false)
    private Instant changedAt;

    public OrderStatusHistory() {
    }

    public OrderStatusHistory(CustomerOrder order, OrderStatus fromStatus, OrderStatus toStatus, String comment) {
        this.order = order;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.comment = comment;
        this.changedAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.changedAt == null) {
            this.changedAt = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CustomerOrder getOrder() {
        return order;
    }

    public void setOrder(CustomerOrder order) {
        this.order = order;
    }

    public OrderStatus getFromStatus() {
        return fromStatus;
    }

    public void setFromStatus(OrderStatus fromStatus) {
        this.fromStatus = fromStatus;
    }

    public OrderStatus getToStatus() {
        return toStatus;
    }

    public void setToStatus(OrderStatus toStatus) {
        this.toStatus = toStatus;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Instant getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(Instant changedAt) {
        this.changedAt = changedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderStatusHistory that = (OrderStatusHistory) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
