package com.realtimechat.realtimechat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

            // Disable CSRF
            .csrf(AbstractHttpConfigurer::disable)

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PAGES
                // =========================

                .requestMatchers(
                        "/",
                        "/index.html",
                        "/signup.html",
                        "/login.html",
                        "/chat.html"
                ).permitAll()

                // =========================
                // STATIC FILES
                // =========================

                .requestMatchers(
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/favicon.ico"
                ).permitAll()

                // =========================
                // AUTH
                // =========================

                .requestMatchers(
                        "/api/auth/**"
                ).permitAll()

                // =========================
                // USERS
                // =========================

                .requestMatchers(
                        "/api/users/**"
                ).permitAll()

                // =========================
                // MESSAGES
                // =========================

                .requestMatchers(
                        "/api/messages/**"
                ).permitAll()

                // =========================
                // WEBSOCKET
                // =========================

                .requestMatchers(
                        "/ws",
                        "/ws/**"
                ).permitAll()

                // =========================
                // EVERYTHING ELSE
                // =========================

                .anyRequest().permitAll()
            );

        return http.build();
    }
}