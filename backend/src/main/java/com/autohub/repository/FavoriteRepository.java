package com.autohub.repository;

import com.autohub.entity.Favorite;
import com.autohub.entity.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    List<Favorite> findAllByUserId(Long userId);
    boolean existsByUserIdAndCarId(Long userId, Long carId);
    void deleteByUserIdAndCarId(Long userId, Long carId);
}
