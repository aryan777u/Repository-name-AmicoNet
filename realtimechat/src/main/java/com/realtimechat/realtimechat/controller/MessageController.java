package com.realtimechat.realtimechat.controller;

import com.realtimechat.realtimechat.model.Message;
import com.realtimechat.realtimechat.repository.MessageRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // =========================
    // SEND MESSAGE (REST)
    // =========================

    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @RequestBody MessageRequest request) {

        Message message = new Message(
                request.sender(),
                request.receiver(),
                request.content()
        );

        Message savedMessage =
                messageRepository.save(message);

        return ResponseEntity.ok(savedMessage);
    }

    // =========================
    // GET CONVERSATION
    // =========================

    @GetMapping
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam String user1,
            @RequestParam String user2) {

        List<Message> sent =
                messageRepository.findBySenderAndReceiver(
                        user1,
                        user2
                );

        List<Message> received =
                messageRepository.findByReceiverAndSender(
                        user1,
                        user2
                );

        List<Message> conversation =
                new ArrayList<>();

        conversation.addAll(sent);
        conversation.addAll(received);

        conversation.sort(
                Comparator.comparing(
                        Message::getTimestamp,
                        Comparator.nullsLast(
                                Comparator.naturalOrder()
                        )
                )
        );

        return ResponseEntity.ok(conversation);
    }

    public record MessageRequest(
            String sender,
            String receiver,
            String content
    ) {
    }
}