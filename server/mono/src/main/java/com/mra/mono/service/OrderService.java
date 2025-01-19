package com.mra.mono.service;

import com.mra.mono.dto.entity.*;
import com.mra.mono.dto.request.CreateOrderReq;
import com.mra.mono.dto.request.OrderProductRequest;
import com.mra.mono.dto.request.TableAddReq;
import com.mra.mono.dto.response.OrderDetailDTO;
import com.mra.mono.dto.response.OrderRes;
import com.mra.mono.repository.OrderDetailRepository;
import com.mra.mono.repository.OrderRepository;
import com.mra.mono.repository.ProductRepository;
import com.mra.mono.repository.TableRepository;
import jakarta.annotation.Resource;
import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class OrderService {

    @Resource
    private SimpMessagingTemplate messagingTemplate;
    @Resource
    private final OrderRepository orderRepository;
    @Resource
    private final ProductRepository productRepository;

    @Resource
    private final TableRepository tableRepository;

    @Resource
    private final OrderDetailRepository orderDetailRepository;

    @Transactional
    public OrderRes createOrder(String branchId, String tableId,CreateOrderReq orderReq) {
        log.info("Order request: {}", orderReq.getProducts());
        try {

            Order newOrder = new Order();
            newOrder.setTotalAmount(orderReq.getTotalAmount());
            newOrder.setDiscount(orderReq.getDiscount());
            newOrder.setStatus(orderReq.getStatus());
            newOrder.setTableId(orderReq.getTableId());
            newOrder.setOrderDate(new Date());
            newOrder.setCreateTime(new Date());
            newOrder.setBranchId(orderReq.getBranchId());

            Set<OrderDetail> orderDetails = new HashSet<>();
            for (OrderProductRequest productRequest : orderReq.getProducts()) {
                Product product = productRepository.findById(productRequest.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + productRequest.getProductId()));

                OrderDetail detail = new OrderDetail();
                detail.setOrder(newOrder);
                detail.setProduct(product);
                detail.setQuantity(productRequest.getQuantity());

                orderDetails.add(detail);
            }
            newOrder.setOrderDetails(orderDetails);
            Order savedOrder = orderRepository.save(newOrder);
            orderDetailRepository.saveAll(orderDetails);
            messagingTemplate.convertAndSend("/topic/order/ "+ branchId + "/" + tableId, savedOrder);
            messagingTemplate.convertAndSend("/topic/order/" + branchId, savedOrder);


            OrderRes orderDTO = new OrderRes();
            orderDTO.setOrderId(savedOrder.getOrderId());
            orderDTO.setTable(
                tableRepository.findById(savedOrder.getTableId())
                .map(this::convertToTableDTO)
                .orElse(null)
            );
            orderDTO.setTotalAmount(savedOrder.getTotalAmount());
            orderDTO.setDiscount(savedOrder.getDiscount());
            orderDTO.setStatus(savedOrder.getStatus());
            orderDTO.setBranchId(savedOrder.getBranchId());
            orderDTO.setOrderDetails(orderDetails.stream().map(this::convertToOrderDetailDTO).collect(Collectors.toSet()));
            orderDTO.setOrderDate(savedOrder.getOrderDate());
            orderDTO.setCreateTime(savedOrder.getCreateTime());

            return orderDTO;

        } catch (Exception e) {
            log.error("Error creating order", e);
            throw e;
        }
    }
    @Transactional
    public void changeOrderStatus(UUID orderId, Integer status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);
        messagingTemplate.convertAndSend("/topic/order/" + order.getBranchId() + "/" + order.getTableId(), savedOrder);
    }

    public Optional<Order> getOrderById(UUID orderId) {
        try {
            return orderRepository.findById(orderId);
        } catch (Exception e) {
            log.error("Error retrieving order with id: " + orderId, e);
            throw e;
        }
    }

    public List<OrderRes> getAllOrders(UUID branchId, UUID tableId, Integer status) {
        try {
            List<Order> orders = orderRepository.findAllByBranchIdAndOptionalCriteria(branchId,tableId,status);
            log.info("orders:{}", orders);
            return orders.stream().map(this::convertToOrderRes).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching orders", e);
            throw e;
        }
    }

    public Order updateOrder(Order order) {
        try {
            return orderRepository.save(order);
        } catch (Exception e) {
            log.error("Error updating order", e);
            throw e;
        }
    }

    public void deleteOrder(UUID orderId) {
        try {
            orderRepository.deleteById(orderId);
        } catch (Exception e) {
            log.error("Error deleting order with id: " + orderId, e);
            throw e;
        }
    }

    private OrderRes convertToOrderRes(Order order) {
        OrderRes dto = new OrderRes();
        dto.setOrderId(order.getOrderId());
        dto.setTable(
            tableRepository.findById(order.getTableId())
            .map(this::convertToTableDTO)
            .orElse(null)
        );
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDiscount(order.getDiscount());
        dto.setStatus(order.getStatus());
        dto.setBranchId(order.getBranchId());
        dto.setOrderDetails(order.getOrderDetails().stream()
                .map(this::convertToOrderDetailDTO)
                .collect(Collectors.toSet()));
        dto.setOrderDate(order.getOrderDate());
        dto.setCreateTime(order.getCreateTime());

        return dto;
    }

    private OrderDetailDTO convertToOrderDetailDTO(OrderDetail orderDetail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderDId(orderDetail.getId());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setProduct(orderDetail.getProduct());
        return dto;
    }

    private TableAddReq convertToTableDTO(DiningTable table) {
        TableAddReq dto = new TableAddReq();
        dto.setTableId(table.getTableId());
        dto.setBranchId(table.getBranchId());
        dto.setRegionId(table.getRegionId());
        dto.setTableName(table.getTableName());
        return dto;
    }




}
