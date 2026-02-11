package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.testdrive.TestDriveRequest;
import com.autohub.dto.testdrive.TestDriveResponse;
import com.autohub.mapper.TestDriveMapper;
import com.autohub.service.TestDriveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test-drives") // ✅ FIXED: Removed duplicate /api prefix
public class TestDriveController {

    private final TestDriveService testDriveService;
    private final TestDriveMapper testDriveMapper;

    public TestDriveController(TestDriveService testDriveService, TestDriveMapper testDriveMapper) {
        this.testDriveService = testDriveService;
        this.testDriveMapper = testDriveMapper;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<TestDriveResponse>> bookTestDrive(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid TestDriveRequest request) {
        TestDriveResponse response = testDriveMapper.toResponse(
                testDriveService.bookTestDrive(request, userDetails.getUsername()));
        return ResponseEntity.ok(ApiResponse.success("Test drive booked", response));
    }

    @GetMapping("/my-bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<TestDriveResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Your bookings retrieved",
                testDriveMapper.toResponses(testDriveService.getMyTestDrives(userDetails.getUsername()))));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<Void>> cancelTestDrive(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        try {
            testDriveService.cancelTestDrive(id, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.failure(e.getMessage()));
        }
    }

}
