package com.realtimechat.realtimechat.controller;

import com.realtimechat.realtimechat.model.User;
import com.realtimechat.realtimechat.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // =========================
    // GET ALL USERS
    // =========================

    @GetMapping
    public List<UserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getProfilePhoto()
                ))
                .toList();
    }


    // =========================
    // UPLOAD PROFILE PHOTO
    // =========================

    @PostMapping("/profile-photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @RequestParam("username") String username,
            @RequestParam("file") MultipartFile file) {

        try {

            if (file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Please select an image.");
            }

            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity
                        .badRequest()
                        .body("Only image files are allowed.");
            }

            User user =
                    userRepository
                            .findByUsername(username)
                            .orElse(null);

            if (user == null) {
                return ResponseEntity
                        .notFound()
                        .build();
            }

            String base64 =
                    Base64.getEncoder()
                            .encodeToString(file.getBytes());

            String imageData =
                    "data:" +
                    file.getContentType() +
                    ";base64," +
                    base64;

            user.setProfilePhoto(imageData);

            userRepository.save(user);

            return ResponseEntity.ok(imageData);

        } catch (IOException e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Could not upload image.");
        }
    }
}