package com.autohub.dto.car;

import com.autohub.entity.FuelType;
import com.autohub.entity.TransmissionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

import java.math.BigDecimal;

public record CarFilter(
        String make,
        String model,
        @Min(1886) Integer year,
        TransmissionType transmission,
        FuelType fuelType,
        @DecimalMin(value = "0.0", inclusive = true) BigDecimal minPrice,
        @DecimalMin(value = "0.0", inclusive = true) BigDecimal maxPrice
) {
}
