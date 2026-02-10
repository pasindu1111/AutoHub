package com.autohub.dto.favorite;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record FavoriteResponse(
        @NotNull Long userId,
        @NotNull Long carId,
        @NotNull Instant createdAt
) {
}
