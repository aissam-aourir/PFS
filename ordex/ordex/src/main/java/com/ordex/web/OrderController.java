package com.ordex.web;

import com.ordex.entities.Order;
import com.ordex.entities.OrderProduct;
import com.ordex.entities.Product;
import com.ordex.helpers.OrderListResponseDTO;
import com.ordex.helpers.OrderResponseDTO;
import com.ordex.repository.OrderProductRepository;
import com.ordex.security.entities.Utilisateur;
import com.ordex.security.service.AccountServiceImpl;
import com.ordex.services.interfaces.*;
import com.ordex.services.implementations.EmailServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
//impopter orderrepository
import com.ordex.repository.OrderRepository;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;
    private final IOrderProductService orderProductService;
    private final IProductService productService;
    private final AccountServiceImpl accountService;
    private final EmailServiceImpl emailService;
    private final OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderResponseDTO dto) {
        try {
            // Validate client
            Utilisateur client = accountService.findById(dto.getClient().getId());
            if (client == null) {
                return ResponseEntity.badRequest().body("Client not found.");
            }

            // Create Order
            Order order = new Order();
            order.setTotal(dto.getTotal());
            order.setStatus(dto.getStatus());
            order.setPhone(dto.getPhone());
            order.setPaymentMethod(dto.getPaymentMethod());
            order.setCreatedAt(dto.getCreatedAt());
            order.setClient(client);

            // Save Order to get ID
            Order savedOrder = orderService.save(order);
            // Map and save OrderProduct entities
            List<OrderProduct> savedOrderProducts = dto.getOrderProducts().stream().map(item -> {
                Product product = productService.getById(item.getProduct().getId());
                if (product == null) {
                    throw new IllegalArgumentException("Product not found: ID " + item.getProduct().getId());
                }
                OrderProduct op = new OrderProduct();
                op.setOrder(savedOrder);
                op.setProduct(product);
                op.setQuantity(item.getQuantity().longValue());
                op.setPriceAtPurchases(item.getPriceAtPurchases());
                //je veux faire reduire le nombre des unites achetes/ajoutee
                product.setStock(product.getStock() - item.getQuantity().intValue());
                return orderProductService.save(op);
            }).collect(Collectors.toList());
            savedOrder.setOrderProducts(savedOrderProducts);
            // ✅ Prepare the response DTO
            OrderResponseDTO response = new OrderResponseDTO();
            response.setId(savedOrder.getId());
            response.setTotal(savedOrder.getTotal());
            response.setStatus(savedOrder.getStatus());
            response.setPhone(savedOrder.getPhone());
            response.setPaymentMethod(savedOrder.getPaymentMethod());
            response.setCreatedAt(savedOrder.getCreatedAt());
            // Map client
            OrderResponseDTO.ClientDTO clientDTO = new OrderResponseDTO.ClientDTO();
            clientDTO.setId(client.getUserId());
            clientDTO.setUsername(client.getUsername());
            clientDTO.setEmail(client.getEmail());
            response.setClient(clientDTO);
            // Map order products
            List<OrderResponseDTO.OrderProductDTO> orderProductDTOs = savedOrderProducts.stream().map(op -> {
                OrderResponseDTO.OrderProductDTO dtoOp = new OrderResponseDTO.OrderProductDTO();
                dtoOp.setQuantity(op.getQuantity());
                dtoOp.setPriceAtPurchases(op.getPriceAtPurchases());
                OrderResponseDTO.OrderProductDTO.ProductDTO productDTO = new OrderResponseDTO.OrderProductDTO.ProductDTO();
                productDTO.setId(op.getProduct().getId());
                productDTO.setName(op.getProduct().getName());
                dtoOp.setProduct(productDTO);
                return dtoOp;
            }).collect(Collectors.toList());
            response.setOrderProducts(orderProductDTOs);
            emailService.sendOrderConfirmation(client.getEmail(), response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to place order: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderListResponseDTO>> getAllOrders() {
        List<OrderListResponseDTO> orderList = orderService.getAll().stream().map(order -> {
            OrderListResponseDTO response = new OrderListResponseDTO();
            response.setId(order.getId());
            response.setTotal(order.getTotal());
            response.setStatus(order.getStatus());
            response.setPhone(order.getPhone());
            response.setPaymentMethod(order.getPaymentMethod());
            response.setCreatedAt(order.getCreatedAt());

            // Map client information (simplified for list view)
            OrderListResponseDTO.ClientDTO clientDTO = new OrderListResponseDTO.ClientDTO();
            clientDTO.setId(order.getClient().getUserId());
            clientDTO.setUsername(order.getClient().getUsername());
            response.setClient(clientDTO);

            // Map order products
            List<OrderListResponseDTO.OrderProductDTO> orderProductDTOList = order.getOrderProducts().stream().map(orderProduct -> {
                OrderListResponseDTO.OrderProductDTO productDTO = new OrderListResponseDTO.OrderProductDTO();
                productDTO.setQuantity(orderProduct.getQuantity());
                productDTO.setPriceAtPurchases(orderProduct.getPriceAtPurchases());

                // Map product details (simplified for list view)
                OrderListResponseDTO.OrderProductDTO.ProductDTO product = new OrderListResponseDTO.OrderProductDTO.ProductDTO();
                product.setId(orderProduct.getProduct().getId());
                product.setName(orderProduct.getProduct().getName());
                productDTO.setProduct(product);

                return productDTO;
            }).collect(Collectors.toList());

            response.setOrderProducts(orderProductDTOList);

            return response;
        }).collect(Collectors.toList());
        // Reverse the list so the last order comes first
        Collections.reverse(orderList);
        return ResponseEntity.ok(orderList);

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            Order order = orderService.getById(id);
            if (order == null) {
                return ResponseEntity.badRequest().body("Order not found.");
            }

            // Update the order status
            order.setStatus(status);
            orderService.save(order);

            // Return the updated order details
            OrderResponseDTO response = new OrderResponseDTO();
            response.setId(order.getId());
            response.setTotal(order.getTotal());
            response.setStatus(order.getStatus());
            response.setPhone(order.getPhone());
            response.setPaymentMethod(order.getPaymentMethod());
            response.setCreatedAt(order.getCreatedAt());

            OrderResponseDTO.ClientDTO clientDTO = new OrderResponseDTO.ClientDTO();
            clientDTO.setId(order.getClient().getUserId());
            clientDTO.setUsername(order.getClient().getUsername());
            clientDTO.setEmail(order.getClient().getEmail());
            response.setClient(clientDTO);
            String email=order.getClient().getEmail();
            System.out.println("ggggggggggggggggggggggggggggggggg");
            System.out.println("Client Email: " + email);
//            //afficher le status de la commande
//            System.out.println("Order ID: " + order.getId());
//            System.out.println("Order Status: " + order.getStatus());
            //ici je vais envoyer un email au client pour l'informer de la mise a jour de sa commande
            if (status.equals("Completed")){
                System.out.println("Order completed successfully.");
                emailService.sendOrderAccepted(email, response);
            } else if (status.equals("Canceled")) {
                System.out.println("Order canceled successfully.");
                emailService.sendOrderRejected(email, response);
            }
//            this.emailService.sendOrderConfirmation(email, response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update order status: " + e.getMessage());
        }
    }
    //ajoute
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUserId(@PathVariable Long clientId) {
        System.out.println("Client ID: " + clientId);

        // Récupérer les commandes pour le clientId
        List<Order> orders = orderRepository.findByClientUserId(clientId);

        // Afficher les commandes pour le débogage
        for (Order order : orders) {
            System.out.println("Order ID: " + order.getId());
            System.out.println("Order Total: " + order.getTotal());
            System.out.println("Order Status: " + order.getStatus());
            System.out.println("Client ID: " + order.getClient().getUserId());
            System.out.println("Client Phone: " + order.getPhone());
            System.out.println("Payment Method: " + order.getPaymentMethod());
            System.out.println("Created At: " + order.getCreatedAt());
            for (OrderProduct orderProduct : order.getOrderProducts()) {
                System.out.println("Product ID: " + orderProduct.getProduct().getId());
                System.out.println("Product Name: " + orderProduct.getProduct().getName());
                System.out.println("Quantity: " + orderProduct.getQuantity());
                System.out.println("Price at Purchases: " + orderProduct.getPriceAtPurchases());
            }
            System.out.println("--------------------------------------------------");
        }

        // Mapper les commandes vers OrderResponseDTO
        List<OrderResponseDTO> orderList = orders.stream().map(order -> {
            OrderResponseDTO response = new OrderResponseDTO();
            response.setId(order.getId());
            response.setTotal(order.getTotal());
            response.setStatus(order.getStatus());
            response.setPhone(order.getPhone());
            response.setPaymentMethod(order.getPaymentMethod());
            response.setCreatedAt(order.getCreatedAt());

            // Mapper les informations du client
            OrderResponseDTO.ClientDTO clientDTO = new OrderResponseDTO.ClientDTO();
            clientDTO.setId(order.getClient().getUserId());
            clientDTO.setUsername(order.getClient().getUsername());
            clientDTO.setEmail(order.getClient().getEmail());
            response.setClient(clientDTO);

            // Mapper les produits de la commande
            List<OrderResponseDTO.OrderProductDTO> orderProductDTOList = order.getOrderProducts().stream().map(orderProduct -> {
                OrderResponseDTO.OrderProductDTO productDTO = new OrderResponseDTO.OrderProductDTO();
                productDTO.setQuantity(orderProduct.getQuantity());
                productDTO.setPriceAtPurchases(orderProduct.getPriceAtPurchases());

                // Mapper les détails du produit
                OrderResponseDTO.OrderProductDTO.ProductDTO product = new OrderResponseDTO.OrderProductDTO.ProductDTO();
                product.setId(orderProduct.getProduct().getId());
                product.setName(orderProduct.getProduct().getName());
                product.setImageURL(orderProduct.getProduct().getImageURL());
                productDTO.setProduct(product);

                return productDTO;
            }).collect(Collectors.toList());

            response.setOrderProducts(orderProductDTOList);

            return response;
        }).collect(Collectors.toList());

        // Inverser la liste pour que la dernière commande apparaisse en premier
        Collections.reverse(orderList);

        return ResponseEntity.ok(orderList);
    }



}
