package com.realtimechat.realtimechat.controller;

import com.realtimechat.realtimechat.model.Message;
import com.realtimechat.realtimechat.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @RequestBody MessageRequest request) {

        Message message = messageService.sendMessage(
                request.sender(),
                request.receiver(),
                request.content()
        );

        return ResponseEntity.ok(message);
    }

    @GetMapping
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam String user1,
            @RequestParam String user2) {

        List<Message> messages =
                messageService.getConversation(user1, user2);

        return ResponseEntity.ok(messages);
    }

    public record MessageRequest(
            String sender,
            String receiver,
            String content
    ) {
    }
}