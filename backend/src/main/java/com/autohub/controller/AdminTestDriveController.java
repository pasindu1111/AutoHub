package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.testdrive.TestDriveResponse;
import com.autohub.dto.testdrive.TestDriveStatusRequest;
import com.autohub.mapper.TestDriveMapper;
import com.autohub.service.TestDriveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/test-drives")  // ✅ FIXED: Removed duplicate /api prefix
@PreAuthorize("hasRole('ADMIN')")
public class AdminTestDriveController {

    private final TestDriveService testDriveService;
    private final TestDriveMapper testDriveMapper;

    public AdminTestDriveController(TestDriveService testDriveService, TestDriveMapper testDriveMapper) {
        this.testDriveService = testDriveService;
        this.testDriveMapper = testDriveMapper;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TestDriveResponse>>> getAllTestDrives() {
        return ResponseEntity.ok(ApiResponse.success("Test drives retrieved",
                testDriveMapper.toResponses(testDriveService.getAllTestDrives())));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TestDriveResponse>> updateStatus(@PathVariable Long id,
                                                                       @RequestBody @Valid TestDriveStatusRequest request) {
        TestDriveResponse response = testDriveMapper.toResponse(
                testDriveService.updateStatus(id, request.status()));
        return ResponseEntity.ok(ApiResponse.success("Test drive status updated", response));
    }
}
