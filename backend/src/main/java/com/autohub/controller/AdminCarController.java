package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.car.CarFilter;
import com.autohub.dto.car.CarRequest;
import com.autohub.dto.car.CarResponse;
import com.autohub.dto.car.CarStatusRequest;
import com.autohub.entity.FuelType;
import com.autohub.entity.TransmissionType;
import com.autohub.mapper.CarMapper;
import com.autohub.service.CarService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/admin/cars")  // ✅ FIXED: Removed duplicate /api prefix
@PreAuthorize("hasRole('ADMIN')")
public class AdminCarController {

    private final CarService carService;
    private final CarMapper carMapper;

    public AdminCarController(CarService carService, CarMapper carMapper) {
        this.carService = carService;
        this.carMapper = carMapper;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CarResponse>>> listCars(@RequestParam(required = false) String make,
                                                                   @RequestParam(required = false) String model,
                                                                   @RequestParam(required = false) Integer year,
                                                                   @RequestParam(required = false) TransmissionType transmission,
                                                                   @RequestParam(required = false) FuelType fuelType,
                                                                   @RequestParam(required = false) BigDecimal minPrice,
                                                                   @RequestParam(required = false) BigDecimal maxPrice) {
        CarFilter filter = new CarFilter(make, model, year, transmission, fuelType, minPrice, maxPrice);
        return ResponseEntity.ok(ApiResponse.success("Cars retrieved", carMapper.toResponses(carService.listCarsForAdmin(filter))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> getCar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Car retrieved", carMapper.toResponse(carService.getCar(id))));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CarResponse>> createCar(@RequestPart("data") @Valid CarRequest request,
                                                              @RequestPart(value = "images", required = false) List<MultipartFile> images,
                                                              @RequestParam(value = "primaryIndex", required = false) Integer primaryIndex) throws IOException {
        return ResponseEntity.ok(ApiResponse.success("Car created",
                carMapper.toResponse(carService.createCar(request, images, primaryIndex))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> updateCar(@PathVariable Long id,
                                                              @RequestBody @Valid CarRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Car updated",
                carMapper.toResponse(carService.updateCar(id, request))));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) throws IOException {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.success("Car deleted", null));
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<CarResponse>> restoreCar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Car restored",
                carMapper.toResponse(carService.restoreCar(id))));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CarResponse>> updateStatus(@PathVariable Long id,
                                                                 @RequestBody @Valid CarStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Car status updated",
                carMapper.toResponse(carService.updateCarStatus(id, request.status()))));
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<CarResponse>> addImages(@PathVariable Long id,
                                                              @RequestPart("images") List<MultipartFile> images,
                                                              @RequestParam(value = "primaryIndex", required = false) Integer primaryIndex) throws IOException {
        return ResponseEntity.ok(ApiResponse.success("Images added",
                carMapper.toResponse(carService.addImages(id, images, primaryIndex))));
    }

    @PatchMapping("/{carId}/images/{imageId}/primary")
    public ResponseEntity<ApiResponse<CarResponse>> setPrimary(@PathVariable Long carId,
                                                               @PathVariable Long imageId) {
        return ResponseEntity.ok(ApiResponse.success("Primary image updated",
                carMapper.toResponse(carService.setPrimaryImage(carId, imageId))));
    }

    @DeleteMapping("/{carId}/images/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable Long carId,
                                                         @PathVariable Long imageId) throws IOException {
        carService.removeImage(carId, imageId);
        return ResponseEntity.ok(ApiResponse.success("Image deleted", null));
    }
}
