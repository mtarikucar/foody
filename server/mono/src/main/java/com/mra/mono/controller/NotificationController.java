package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.dto.entity.Notification;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.CreateOrderReq;
import com.mra.mono.dto.request.NotificationAddReq;
import com.mra.mono.dto.response.OrderRes;
import com.mra.mono.service.NotificationService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/notification")
@Slf4j
public class NotificationController extends BaseController {
    @Resource
    private NotificationService notificationService;

    @MessageMapping("/notification/{userId}")
    @SendTo("/topic/notification/{userId}")
    public ResponseEntity<Message<Notification>> createOrder(@DestinationVariable String userId, @RequestBody NotificationAddReq notificationAddReq) {
        try {
            Notification savedNotification = notificationService.save(notificationAddReq);
            return buildSuccessReturnEntity(savedNotification);
        } catch (Exception e) {
            log.error("Error creating notification", e);
            return buildFailureReturnEntity("Error creating notification");
        }
    }

    @GetMapping
    public ResponseEntity<Message<List<Notification>>> getAllNotifications(@RequestParam Optional<UUID> userId) {
        try {
            List<Notification> notifications = notificationService.findAll(userId);
            if (notifications.isEmpty()) {
                return buildReturnEntity("Notificationes are not found", 301);
            }
            return buildSuccessReturnEntity(notifications);
        } catch (Exception e) {
            log.error("Error while fetching branches", e);
            return buildFailureReturnEntity("Error fetching branches: " + e.getMessage());
        }
    }
}

