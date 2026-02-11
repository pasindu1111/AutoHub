package com.autohub.dto.car;

import jakarta.validation.constraints.NotNull;

public record CarImageResponse(
        @NotNull Long id,
        @NotNull String imagePath,
        @NotNull boolean primaryImage
) {
}
