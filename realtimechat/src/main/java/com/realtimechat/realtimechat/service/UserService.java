package com.realtimechat.realtimechat.service;

import com.realtimechat.realtimechat.model.User;
import com.realtimechat.realtimechat.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(
            String username,
            String email,
            String password) {

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String encryptedPassword =
                passwordEncoder.encode(password);

        User user = new User(
                username,
                encryptedPassword,
                email
        );

        return userRepository.save(user);
    }

    public User findByUsername(String username) {

        return userRepository.findByUsername(username)
                .orElse(null);
    }

    public boolean checkPassword(
            String username,
            String password) {

        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null) {
            return false;
        }

        return passwordEncoder.matches(
                password,
                user.getPassword()
        );
    }
}