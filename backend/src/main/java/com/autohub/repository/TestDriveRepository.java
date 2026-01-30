package com.autohub.repository;

import com.autohub.entity.TestDrive;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TestDriveRepository extends JpaRepository<TestDrive, Long> {
    boolean existsByCarIdAndAppointmentDateAndStatusNot(Long carId, LocalDateTime appointmentDate, TestDriveStatus status);
}
