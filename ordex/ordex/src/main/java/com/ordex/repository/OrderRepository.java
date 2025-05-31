package com.ordex.repository;

import com.ordex.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    //pour findByClientId
    List<Order> findByClientUserId(Long clientId);

}
