package com.autohub.service;

import com.autohub.entity.AppUser;
import com.autohub.entity.Car;
import com.autohub.entity.Favorite;
import com.autohub.repository.AppUserRepository;
import com.autohub.repository.CarRepository;
import com.autohub.repository.FavoriteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final AppUserRepository appUserRepository;
    private final CarRepository carRepository;

    public FavoriteService(FavoriteRepository favoriteRepository,
                           AppUserRepository appUserRepository,
                           CarRepository carRepository) {
        this.favoriteRepository = favoriteRepository;
        this.appUserRepository = appUserRepository;
        this.carRepository = carRepository;
    }

    @Transactional
    public Favorite addFavorite(String email, Long carId) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Car car = carRepository.findByIdAndDeletedFalseAndStatus(carId, com.autohub.entity.CarStatus.AVAILABLE)
                .orElseThrow(() -> new IllegalArgumentException("Car not available"));
        if (favoriteRepository.existsByUserIdAndCarId(user.getId(), carId)) {
            return favoriteRepository.findById(new com.autohub.entity.FavoriteId(user.getId(), carId))
                    .orElseThrow();
        }
        Favorite favorite = new Favorite(user, car);
        return favoriteRepository.save(favorite);
    }

    public List<Favorite> listFavorites(String email) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return favoriteRepository.findAllByUserId(user.getId());
    }

    public List<Car> listFavoritesWithDetails(String email) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<Favorite> favorites = favoriteRepository.findAllByUserId(user.getId());
        return favorites.stream()
                .map(Favorite::getCar)
                .toList();
    }

    @Transactional
    public void removeFavorite(String email, Long carId) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        favoriteRepository.deleteByUserIdAndCarId(user.getId(), carId);
    }
}
