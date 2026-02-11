package com.autohub.dto.car;

import com.autohub.entity.CarStatus;
import jakarta.validation.constraints.NotNull;

public record CarStatusRequest(
        @NotNull CarStatus status
) {
}
