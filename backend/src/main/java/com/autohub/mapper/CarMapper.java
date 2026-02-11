package com.autohub.mapper;

import com.autohub.dto.car.CarImageResponse;
import com.autohub.dto.car.CarResponse;
import com.autohub.entity.Car;
import com.autohub.entity.CarImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CarMapper {

    @Mapping(target = "primaryImage", expression = "java(resolvePrimaryImage(car.getImages()))")
    @Mapping(target = "images", expression = "java(mapImages(car.getImages()))")
    CarResponse toResponse(Car car);

    CarImageResponse toImageResponse(CarImage image);

    List<CarResponse> toResponses(List<Car> cars);

    default String resolvePrimaryImage(List<CarImage> images) {
        if (images == null || images.isEmpty()) {
            return null;
        }
        return images.stream()
                .filter(CarImage::isPrimaryImage)
                .findFirst()
                .map(CarImage::getImagePath)
                .orElse(null);
    }

    default List<CarImageResponse> mapImages(List<CarImage> images) {
        if (images == null) {
            return null;
        }
        return images.stream()
                .map(this::toImageResponse)
                .toList();
    }
}
