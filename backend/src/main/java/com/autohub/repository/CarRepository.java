package com.autohub.repository;

import com.autohub.entity.Car;
import com.autohub.entity.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
    Optional<Car> findByIdAndDeletedFalseAndStatus(Long id, CarStatus status);
}
