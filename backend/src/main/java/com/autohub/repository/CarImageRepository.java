package com.autohub.repository;

import com.autohub.entity.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarImageRepository extends JpaRepository<CarImage, Long> {
    Optional<CarImage> findFirstByCarIdAndPrimaryImageTrue(Long carId);
}
