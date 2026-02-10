package com.autohub.mapper;

import com.autohub.dto.favorite.FavoriteResponse;
import com.autohub.entity.Favorite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FavoriteMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "carId", source = "car.id")
    FavoriteResponse toResponse(Favorite favorite);

    List<FavoriteResponse> toResponses(List<Favorite> favorites);
}
