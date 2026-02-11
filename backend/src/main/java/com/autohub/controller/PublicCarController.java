package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.PagedResponse;
import com.autohub.dto.car.CarFilter;
import com.autohub.dto.car.CarResponse;
import com.autohub.entity.Car;
import com.autohub.entity.FuelType;
import com.autohub.entity.TransmissionType;
import com.autohub.mapper.CarMapper;
import com.autohub.service.CarService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/cars") // ✅ FIXED: Removed duplicate /api prefix
public class PublicCarController {

    private final CarService carService;
    private final CarMapper carMapper;

    public PublicCarController(CarService carService, CarMapper carMapper) {
        this.carService = carService;
        this.carMapper = carMapper;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CarResponse>>> listCars(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) TransmissionType transmission,
            @RequestParam(required = false) FuelType fuelType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        CarFilter filter = new CarFilter(make, model, year, transmission, fuelType, minPrice, maxPrice);
        Sort sort = sortDir.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        try {
            Page<Car> carPage = carService.listCarsForPublicPaged(filter, pageable);
            List<CarResponse> carResponses = carMapper.toResponses(carPage.getContent());

            PagedResponse<CarResponse> pagedResponse = new PagedResponse<>(
                    carResponses,
                    carPage.getNumber(),
                    carPage.getSize(),
                    carPage.getTotalElements(),
                    carPage.getTotalPages(),
                    carPage.isLast());

            return ResponseEntity.ok(ApiResponse.success("Cars retrieved", pagedResponse));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.failure("Internal Server Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Car retrieved", carMapper.toResponse(carService.getCar(id))));
    }
}
