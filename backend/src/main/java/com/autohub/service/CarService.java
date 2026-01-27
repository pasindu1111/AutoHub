package com.autohub.service;

import com.autohub.dto.car.CarFilter;
import com.autohub.dto.car.CarRequest;
import com.autohub.entity.Car;
import com.autohub.entity.CarImage;
import com.autohub.repository.CarImageRepository;
import com.autohub.repository.CarRepository;
import com.autohub.repository.CarSpecifications;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final CarImageRepository carImageRepository;
    private final FileService fileService;

    public CarService(CarRepository carRepository,
                      CarImageRepository carImageRepository,
                      FileService fileService) {
        this.carRepository = carRepository;
        this.carImageRepository = carImageRepository;
        this.fileService = fileService;
    }

    public List<Car> listCars() {
        return carRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Car> listCarsForPublic(CarFilter filter) {
        List<Car> cars = carRepository.findAll(CarSpecifications.publicListingSpec(filter));
        // Force initialization of images to avoid lazy loading issues
        cars.forEach(car -> car.getImages().size());
        return cars;
    }

    @Transactional(readOnly = true)
    public Page<Car> listCarsForPublicPaged(CarFilter filter, Pageable pageable) {
        Page<Car> carPage = carRepository.findAll(CarSpecifications.publicListingSpec(filter), pageable);
        // Force initialization of images to avoid lazy loading issues
        carPage.getContent().forEach(car -> car.getImages().size());
        return carPage;
    }

    @Transactional(readOnly = true)
    public List<Car> listCarsForAdmin(CarFilter filter) {
        List<Car> cars = carRepository.findAll(CarSpecifications.adminListingSpec(filter));
        // Force initialization of images to avoid lazy loading issues
        cars.forEach(car -> car.getImages().size());
        return cars;
    }

    @Transactional(readOnly = true)
    public Car getCar(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Car not found"));
        // Force initialization of images to avoid lazy loading issues
        car.getImages().size();
        return car;
    }

    @Transactional
    public Car createCar(CarRequest request, List<MultipartFile> images, Integer primaryIndex) throws IOException {
        Car car = new Car();
        applyRequest(car, request);
        Car saved = carRepository.save(car);
        attachImages(saved, images, primaryIndex);
        return saved;
    }

    @Transactional
    public Car updateCar(Long id, CarRequest request) {
        Car car = getCar(id);
        applyRequest(car, request);
        return carRepository.save(car);
    }

    @Transactional
    public void deleteCar(Long id) throws IOException {
        Car car = getCar(id);
        for (CarImage image : car.getImages()) {
            fileService.deleteFile(image.getImagePath());
        }
        car.setDeleted(true);
        carRepository.save(car);
    }

    @Transactional
    public Car restoreCar(Long id) {
        Car car = getCar(id);
        car.setDeleted(false);
        return carRepository.save(car);
    }

    @Transactional
    public Car updateCarStatus(Long id, com.autohub.entity.CarStatus status) {
        Car car = getCar(id);
        car.setStatus(status);
        return carRepository.save(car);
    }

    @Transactional
    public Car addImages(Long id, List<MultipartFile> images, Integer primaryIndex) throws IOException {
        Car car = getCar(id);
        attachImages(car, images, primaryIndex);
        return car;
    }

    @Transactional
    public Car setPrimaryImage(Long carId, Long imageId) {
        Car car = getCar(carId);
        CarImage image = car.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        car.markPrimaryImage(image);
        return carRepository.save(car);
    }

    @Transactional
    public void removeImage(Long carId, Long imageId) throws IOException {
        Car car = getCar(carId);
        CarImage image = car.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        car.removeImage(image);
        fileService.deleteFile(image.getImagePath());
        carImageRepository.delete(image);
    }

    private void attachImages(Car car, List<MultipartFile> images, Integer primaryIndex) throws IOException {
        if (images == null || images.isEmpty()) {
            return;
        }
        int index = 0;
        for (MultipartFile file : images) {
            String savedPath = fileService.saveFile(file);
            CarImage image = new CarImage();
            image.setImagePath(savedPath);
            boolean isPrimary = primaryIndex != null && primaryIndex == index;
            image.setPrimaryImage(isPrimary);
            car.addImage(image);
            index++;
        }
        if (car.getImages().stream().noneMatch(CarImage::isPrimaryImage)) {
            car.getImages().get(0).setPrimaryImage(true);
        }
    }

    private void applyRequest(Car car, CarRequest request) {
        car.setMake(request.make());
        car.setModel(request.model());
        car.setYear(request.year());
        car.setPrice(request.price());
        car.setTransmission(request.transmission());
        car.setFuelType(request.fuelType());
        car.setDescription(request.description());
    }
}
