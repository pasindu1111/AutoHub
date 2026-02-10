package com.autohub.controller;

import com.autohub.dto.ApiResponse;
import com.autohub.dto.car.CarResponse;
import com.autohub.dto.favorite.FavoriteResponse;
import com.autohub.mapper.CarMapper;
import com.autohub.mapper.FavoriteMapper;
import com.autohub.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")  // ✅ FIXED: Removed duplicate /api prefix
@PreAuthorize("hasRole('CUSTOMER')")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final FavoriteMapper favoriteMapper;
    private final CarMapper carMapper;

    public FavoriteController(FavoriteService favoriteService, 
                              FavoriteMapper favoriteMapper,
                              CarMapper carMapper) {
        this.favoriteService = favoriteService;
        this.favoriteMapper = favoriteMapper;
        this.carMapper = carMapper;
    }

    @PostMapping("/{carId}")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(@AuthenticationPrincipal UserDetails userDetails,
                                                                     @PathVariable Long carId) {
        FavoriteResponse response = favoriteMapper.toResponse(
                favoriteService.addFavorite(userDetails.getUsername(), carId));
        return ResponseEntity.ok(ApiResponse.success("Favorite added", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> listFavorites(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Favorites retrieved",
                favoriteMapper.toResponses(favoriteService.listFavorites(userDetails.getUsername()))));
    }

    @GetMapping("/with-details")
    public ResponseEntity<ApiResponse<List<CarResponse>>> listFavoritesWithDetails(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Favorites with details retrieved",
                carMapper.toResponses(favoriteService.listFavoritesWithDetails(userDetails.getUsername()))));
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(@AuthenticationPrincipal UserDetails userDetails,
                                                            @PathVariable Long carId) {
        favoriteService.removeFavorite(userDetails.getUsername(), carId);
        return ResponseEntity.ok(ApiResponse.success("Favorite removed", null));
    }
}
