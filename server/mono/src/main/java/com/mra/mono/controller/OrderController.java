package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.dto.entity.Order;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.CreateOrderReq;
import com.mra.mono.dto.response.OrderRes;
import com.mra.mono.service.OrderService;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@Slf4j
@AllArgsConstructor
public class OrderController  extends BaseController {

    @Resource
    private final OrderService orderService;


    @MessageMapping("/order/{branchId}/{tableId}")
    @SendTo("/topic/order/{branchId}/{tableId}")
    public ResponseEntity<Message<OrderRes>> createOrder(@DestinationVariable String branchId, @DestinationVariable String tableId, @RequestBody CreateOrderReq order) {
        try {
            OrderRes newOrder = orderService.createOrder(branchId, tableId,order);
            return buildSuccessReturnEntity(newOrder);
        } catch (Exception e) {
            log.error("Error creating order", e);
            return buildFailureReturnEntity("Error creating order");
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<Message<Order>> getOrderById(@PathVariable UUID id) {
        try {
            Order order = orderService.getOrderById(id).orElseThrow(() -> new Exception("Order not found"));
            return buildSuccessReturnEntity(order);
        } catch (Exception e) {
            log.error("Error retrieving order with id: " + id, e);
            return buildFailureReturnEntity("Error retrieving order with id: " + id);
        }
    }

    @GetMapping
    public ResponseEntity<Message<List<OrderRes>>> getAllOrders(
            @RequestParam UUID branchId,
            @RequestParam (required = false) UUID tableId,
            @RequestParam (required = false) Integer status

    ) {
        try {
            List<OrderRes> orders = orderService.getAllOrders(branchId,tableId,status);
            return buildSuccessReturnEntity(orders);
        } catch (Exception e) {
            log.error("Error retrieving all orders", e);
            return buildFailureReturnEntity("Error retrieving all orders");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message<Order>> updateOrder(@PathVariable UUID id, @RequestBody Order order) {
        try {
            if (!orderService.getOrderById(id).isPresent()) {
                return buildFailureReturnEntity("Order not found with id: " + id);
            }
            order.setOrderId(id);
            Order updatedOrder = orderService.updateOrder(order);
            return buildSuccessReturnEntity(updatedOrder);
        } catch (Exception e) {
            log.error("Error updating order with id: " + id, e);
            return buildFailureReturnEntity("Error updating order with id: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message<Void>> deleteOrder(@PathVariable UUID id) {
        try {
            if (!orderService.getOrderById(id).isPresent()) {
                return buildFailureReturnEntity("Order not found with id: " + id);
            }
            orderService.deleteOrder(id);
            return buildSuccessReturnEntity(null);
        } catch (Exception e) {
            log.error("Error deleting order with id: " + id, e);
            return buildFailureReturnEntity("Error deleting order with id: " + id);
        }
    }
}

