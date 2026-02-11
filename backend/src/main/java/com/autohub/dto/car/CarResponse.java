package com.autohub.dto.car;

import com.autohub.entity.CarStatus;
import com.autohub.entity.FuelType;
import com.autohub.entity.TransmissionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CarResponse(
        @NotNull Long id,
        @NotNull String make,
        @NotNull String model,
        @Min(1886) int year,
        @NotNull BigDecimal price,
        @NotNull TransmissionType transmission,
        @NotNull FuelType fuelType,
        @NotNull CarStatus status,
        String description,
        String primaryImage,
        List<CarImageResponse> images,
        boolean deleted
) {
}
