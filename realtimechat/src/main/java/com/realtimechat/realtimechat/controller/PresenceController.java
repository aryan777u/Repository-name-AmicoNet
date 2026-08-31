package com.realtimechat.realtimechat.controller;

import com.realtimechat.realtimechat.service.PresenceService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class PresenceController {

    private final PresenceService presenceService;

    public PresenceController(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @MessageMapping("/presence")
    @SendTo("/topic/presence")
    public PresenceMessage updatePresence(PresenceMessage message) {

        if ("ONLINE".equals(message.status())) {

            presenceService.userOnline(
                    message.username()
            );

        } else if ("OFFLINE".equals(message.status())) {

            presenceService.userOffline(
                    message.username()
            );
        }

        return new PresenceMessage(
                message.username(),
                message.status()
        );
    }

    public record PresenceMessage(
            String username,
            String status
    ) {
    }
}