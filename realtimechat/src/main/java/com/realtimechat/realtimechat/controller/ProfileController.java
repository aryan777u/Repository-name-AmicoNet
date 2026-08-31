package com.realtimechat.realtimechat.controller;

import com.realtimechat.realtimechat.model.User;
import com.realtimechat.realtimechat.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/profile");

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/photo")
    public ResponseEntity<String> uploadPhoto(
            @RequestParam("username") String username,
            @RequestParam("file") MultipartFile file) {

        try {

            User user = userRepository
                    .findByUsername(username)
                    .orElse(null);

            if (user == null) {
                return ResponseEntity
                        .badRequest()
                        .body("User not found");
            }

            if (file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Please select an image");
            }

            String contentType = file.getContentType();

            if (contentType == null ||
                    !contentType.startsWith("image/")) {

                return ResponseEntity
                        .badRequest()
                        .body("Only image files are allowed");
            }

            Files.createDirectories(uploadDirectory);

            String fileName =
                    user.getId() + "_" + file.getOriginalFilename();

            Path filePath =
                    uploadDirectory.resolve(fileName);

            Files.write(
                    filePath,
                    file.getBytes()
            );

            String photoUrl =
                    "/uploads/profile/" + fileName;

            user.setProfilePhoto(photoUrl);

            userRepository.save(user);

            return ResponseEntity.ok(photoUrl);

        } catch (IOException e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Could not upload image");
        }
    }
}