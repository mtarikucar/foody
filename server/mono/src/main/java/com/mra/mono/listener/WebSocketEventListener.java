package com.mra.mono.listener;


import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.mra.mono.dto.entity.UserBranchInfo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class WebSocketEventListener {

     Map<String, UserBranchInfo> sessionInfoMap = new ConcurrentHashMap<>();

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());

        List<String> userHeaders = sha.getNativeHeader("username");
        List<String> branchHeaders = sha.getNativeHeader("branchId");

        String sessionId = sha.getSessionId();
        String username = (userHeaders != null && !userHeaders.isEmpty()) ? userHeaders.get(0) : "UnknownUser";
        String branchId = (branchHeaders != null && !branchHeaders.isEmpty()) ? branchHeaders.get(0) : "UnknownBranch";

        log.info("New WebSocket connection: sessionId={}, username={}, branchId={}",
                sessionId, username, branchId);

        sessionInfoMap.put(sessionId, new UserBranchInfo(username, branchId));
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String sessionId = StompHeaderAccessor.wrap(event.getMessage()).getSessionId();
        log.info("WebSocket disconnected: sessionId={}", sessionId);

        sessionInfoMap.remove(sessionId);
    }
}
