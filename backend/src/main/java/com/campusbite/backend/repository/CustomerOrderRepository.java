package com.campusbite.backend.repository;

import com.campusbite.backend.entity.CustomerOrder;
import com.campusbite.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

    @Query("SELECT o FROM CustomerOrder o JOIN FETCH o.customer LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menuItem WHERE o.id = :id")
    Optional<CustomerOrder> findByIdWithDetails(@Param("id") Long id);

    Optional<CustomerOrder> findByOrderNumber(String orderNumber);

    @Query("SELECT DISTINCT o FROM CustomerOrder o JOIN FETCH o.customer LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menuItem ORDER BY o.createdAt DESC")
    List<CustomerOrder> findAllWithDetails();

    @Query("SELECT DISTINCT o FROM CustomerOrder o JOIN FETCH o.customer LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.menuItem WHERE o.status IN :statuses ORDER BY o.createdAt ASC")
    List<CustomerOrder> findByStatusInWithDetails(@Param("statuses") List<OrderStatus> statuses);

    List<CustomerOrder> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
