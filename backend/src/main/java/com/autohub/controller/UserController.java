package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.auth.UserProfileResponse;
import com.autohub.dto.user.UpdateProfileRequest;
import com.autohub.entity.AppUser;
import com.autohub.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid UpdateProfileRequest request) {

        AppUser updatedUser = userService.updateUserProfile(userDetails.getUsername(), request);

        UserProfileResponse response = new UserProfileResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getFullName(),
                updatedUser.getRole());

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }
}
