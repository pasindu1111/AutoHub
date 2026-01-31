package com.autohub.dto.testdrive;

import com.autohub.entity.TestDriveStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record TestDriveResponse(
        @NotNull Long id,
        @NotNull Long carId,
        String carMake,
        String carModel,
        @NotNull Long customerId,
        String customerName,
        String customerEmail,
        @NotNull LocalDateTime appointmentDate,
        @NotNull TestDriveStatus status
) {
}
