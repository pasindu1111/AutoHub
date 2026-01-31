package com.autohub.mapper;

import com.autohub.entity.TestDrive;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TestDriveMapper {
    @Mapping(target = "carId", source = "car.id")
    @Mapping(target = "carMake", source = "car.make")
    @Mapping(target = "carModel", source = "car.model")
    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerName", source = "customer.fullName")
    @Mapping(target = "customerEmail", source = "customer.email")
    TestDriveResponse toResponse(TestDrive testDrive);

    List<TestDriveResponse> toResponses(List<TestDrive> testDrives);
}
