package com.autohub.dto.security;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthTokens {

    @NotNull
    private final String accessToken;

    @NotNull
    private final String refreshToken;
}
