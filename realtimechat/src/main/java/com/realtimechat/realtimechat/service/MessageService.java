package com.realtimechat.realtimechat.service;

import com.realtimechat.realtimechat.model.Message;
import com.realtimechat.realtimechat.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    // =========================
    // SEND MESSAGE
    // =========================

    public Message sendMessage(
            String sender,
            String receiver,
            String content) {

        Message message = new Message();

        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }


    // =========================
    // GET CONVERSATION
    // =========================

    public List<Message> getConversation(
            String user1,
            String user2) {

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
                Comparator.comparing(Message::getTimestamp)
        );

        return conversation;
    }
}