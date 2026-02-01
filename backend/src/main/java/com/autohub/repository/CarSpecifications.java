package com.autohub.repository;

import com.autohub.dto.car.CarFilter;
import com.autohub.entity.Car;
import com.autohub.entity.CarStatus;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public final class CarSpecifications {

    private CarSpecifications() {
    }

    @org.springframework.lang.NonNull
    public static Specification<Car> publicListingSpec(CarFilter filter) {
        return Specification.where(notDeleted())
                .and(statusAvailable())
                .and(makeContains(filter.make()))
                .and(modelContains(filter.model()))
                .and(yearEquals(filter.year()))
                .and(transmissionEquals(filter.transmission()))
                .and(fuelTypeEquals(filter.fuelType()))
                .and(priceBetween(filter.minPrice(), filter.maxPrice()));
    }

    @org.springframework.lang.NonNull
    public static Specification<Car> adminListingSpec(CarFilter filter) {
        return Specification.where(makeContains(filter.make()))
                .and(modelContains(filter.model()))
                .and(yearEquals(filter.year()))
                .and(transmissionEquals(filter.transmission()))
                .and(fuelTypeEquals(filter.fuelType()))
                .and(priceBetween(filter.minPrice(), filter.maxPrice()));
    }

    public static Specification<Car> notDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("deleted"));
    }

    public static Specification<Car> statusAvailable() {
        return (root, query, cb) -> cb.equal(root.get("status"), CarStatus.AVAILABLE);
    }

    public static Specification<Car> makeContains(String make) {
        return (root, query, cb) -> make == null || make.isBlank()
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("make")), "%" + make.toLowerCase() + "%");
    }

    public static Specification<Car> modelContains(String model) {
        return (root, query, cb) -> model == null || model.isBlank()
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("model")), "%" + model.toLowerCase() + "%");
    }

    public static Specification<Car> yearEquals(Integer year) {
        return (root, query, cb) -> year == null
                ? cb.conjunction()
                : cb.equal(root.get("year"), year);
    }

    public static Specification<Car> transmissionEquals(Enum<?> transmission) {
        return (root, query, cb) -> transmission == null
                ? cb.conjunction()
                : cb.equal(root.get("transmission"), transmission);
    }

    public static Specification<Car> fuelTypeEquals(Enum<?> fuelType) {
        return (root, query, cb) -> fuelType == null
                ? cb.conjunction()
                : cb.equal(root.get("fuelType"), fuelType);
    }

    public static Specification<Car> priceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) {
                return cb.conjunction();
            }
            if (minPrice != null && maxPrice != null) {
                return cb.between(root.get("price"), minPrice, maxPrice);
            }
            if (minPrice != null) {
                return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            }
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
}
