package com.realtimechat.realtimechat.repository;

import com.realtimechat.realtimechat.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderAndReceiver(
            String sender,
            String receiver
    );

    List<Message> findByReceiverAndSender(
            String receiver,
            String sender
    );
}