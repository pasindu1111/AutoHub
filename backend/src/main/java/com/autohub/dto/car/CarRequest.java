package com.autohub.dto.car;

import com.autohub.entity.FuelType;
import com.autohub.entity.TransmissionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CarRequest(
        @NotBlank String make,
        @NotBlank String model,
        @Min(1886) int year,
        @NotNull BigDecimal price,
        @NotNull TransmissionType transmission,
        @NotNull FuelType fuelType,
        String description
) {
}
