package com.autohub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Getter
@NoArgsConstructor
@EqualsAndHashCode
public class FavoriteId implements Serializable {

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "car_id")
    private Long carId;

    public FavoriteId(Long userId, Long carId) {
        this.userId = userId;
        this.carId = carId;
    }
}
