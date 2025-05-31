package com.ordex.services.interfaces;
import java.util.List;
import com.ordex.entities.Order;

public interface IOrderService extends ICrudBaseService<Order,Long>{
    //ajouter la méthode pour getOrdersByClientId
    List<Order> getOrdersByClientUserId(Long clientId);
}
