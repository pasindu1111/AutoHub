package com.autohub.dto.testdrive;

import com.autohub.entity.TestDriveStatus;
import jakarta.validation.constraints.NotNull;

public record TestDriveStatusRequest(
        @NotNull TestDriveStatus status
) {
}
