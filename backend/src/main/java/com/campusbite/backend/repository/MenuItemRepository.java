package com.campusbite.backend.repository;

import com.campusbite.backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByIsAvailableTrue();
    List<MenuItem> findByCategoryIgnoreCase(String category);
    List<MenuItem> findByCategoryIgnoreCaseAndIsAvailableTrue(String category);
}
