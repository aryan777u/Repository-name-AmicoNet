package com.realtimechat.realtimechat.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketPresenceEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    private final Set<String> onlineUsers =
            ConcurrentHashMap.newKeySet();

    public WebSocketPresenceEventListener(
            SimpMessageSendingOperations messagingTemplate) {

        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnect(
            SessionConnectedEvent event) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        String username =
                accessor.getFirstNativeHeader("username");

        String sessionId =
                accessor.getSessionId();

        if (username == null || username.isBlank()) {
            return;
        }

        if (sessionId != null) {

            sessions.put(sessionId, username);

            onlineUsers.add(username);

            broadcastStatus(username, true);
        }
    }

    @EventListener
    public void handleWebSocketDisconnect(
            SessionDisconnectEvent event) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        String sessionId =
                accessor.getSessionId();

        if (sessionId == null) {
            return;
        }

        String username =
                sessions.remove(sessionId);

        if (username == null) {
            return;
        }

        boolean stillConnected =
                sessions.containsValue(username);

        if (!stillConnected) {

            onlineUsers.remove(username);

            broadcastStatus(username, false);
        }
    }

    private void broadcastStatus(
            String username,
            boolean online) {

        PresenceMessage presence =
                new PresenceMessage(
                        username,
                        online
                );

        messagingTemplate.convertAndSend(
                "/topic/presence",
                presence
        );
    }

    public record PresenceMessage(
            String username,
            boolean online
    ) {
    }
}