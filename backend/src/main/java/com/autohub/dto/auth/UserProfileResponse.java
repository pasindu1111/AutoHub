package com.autohub.dto.auth;

import com.autohub.entity.Role;
import jakarta.validation.constraints.NotNull;

public record UserProfileResponse(
        @NotNull Long id,
        @NotNull String email,
        @NotNull String fullName,
        @NotNull Role role
) {
}
