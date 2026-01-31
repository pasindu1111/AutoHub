package com.autohub.dto.auth;

import jakarta.validation.constraints.NotNull;

public record UserProfileResponse(
        @NotNull Long id,
        @NotNull String email,
        @NotNull String fullName,
        @NotNull Role role
) {
}
