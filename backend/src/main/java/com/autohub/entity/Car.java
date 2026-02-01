package com.autohub.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cars", indexes = {
        @Index(name = "idx_cars_make", columnList = "make"),
        @Index(name = "idx_cars_model", columnList = "model"),
        @Index(name = "idx_cars_price", columnList = "price"),
        @Index(name = "idx_cars_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TransmissionType transmission;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CarStatus status = CarStatus.AVAILABLE;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted;

    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CarImage> images = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public void addImage(CarImage image) {
        images.add(image);
        image.setCar(this);
    }

    public void removeImage(CarImage image) {
        images.remove(image);
        image.setCar(null);
    }

    public void markPrimaryImage(CarImage image) {
        images.forEach(img -> img.setPrimaryImage(false));
        image.setPrimaryImage(true);
    }
}
