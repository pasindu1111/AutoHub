package com.autohub.dto.testdrive;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record TestDriveRequest(
        @NotNull @Min(1) Long carId,
        @NotNull @Future LocalDateTime appointmentDate
) {
}
