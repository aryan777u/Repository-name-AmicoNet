package com.realtimechat.realtimechat.controller;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String profilePhoto;

    public UserResponse(
            Long id,
            String username,
            String email,
            String profilePhoto) {

        this.id = id;
        this.username = username;
        this.email = email;
        this.profilePhoto = profilePhoto;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }
}