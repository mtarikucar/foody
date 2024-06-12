package com.mra.mono.service;

import com.mra.mono.dto.entity.Branch;
import com.mra.mono.dto.entity.Notification;
import com.mra.mono.dto.request.NotificationAddReq;
import com.mra.mono.repository.NotificationRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Not;
import org.springframework.beans.BeanUtils;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class NotificationService {
    @Resource
    private NotificationRepository notificationRepository;

    @Resource
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Notification save(NotificationAddReq notificationAddReq) {
        try {
            Notification notification =new Notification();
            BeanUtils.copyProperties(notificationAddReq, notification);
            notification.setCreateTime(new java.util.Date());

            messagingTemplate.convertAndSend("/topic/notification/ "+ notificationAddReq.getUserId(), notification);

            return notificationRepository.save(notification);

        } catch (Exception e) {
            log.error("Error saving branch: ", e);
            throw e;
        }
    }

    public List<Notification> findAll(Optional<UUID> userId) {
        try {
            return notificationRepository.findAllByUserIdOrderByCreateTimeDesc(userId);
        } catch (Exception e) {
            log.error("Error finding all branches", e);
            throw e;
        }
    }

    public void markAsRead(UUID notificationId) {
        try {
            Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new RuntimeException("Notification not found"));
            notification.setRead(true);
            notificationRepository.save(notification);
        } catch (Exception e) {
            log.error("Error marking notification as read", e);
            throw e;
        }
    }

    /*public List<Notification> findLast10(Optional<UUID> userId) {
        try {
            return notificationRepository.findTop10ByUserIdOrderByCreateTimeDesc(userId);
        } catch (Exception e) {
            log.error("Error finding last 10 branches", e);
            throw e;
        }
    }*/



}
