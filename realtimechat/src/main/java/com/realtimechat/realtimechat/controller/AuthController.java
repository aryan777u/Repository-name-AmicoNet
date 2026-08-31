package com.realtimechat.realtimechat.controller;

import com.realtimechat.realtimechat.model.User;
import com.realtimechat.realtimechat.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {

        try {
            User user = userService.registerUser(
                    request.username(),
                    request.email(),
                    request.password()
            );

            return ResponseEntity.ok("User created successfully");

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        boolean valid = userService.checkPassword(
                request.username(),
                request.password()
        );

        if (valid) {
            return ResponseEntity.ok("Login successful");
        }

        return ResponseEntity
                .status(401)
                .body("Invalid username or password");
    }

    public record SignupRequest(
            String username,
            String email,
            String password
    ) {
    }

    public record LoginRequest(
            String username,
            String password
    ) {
    }
}