package com.autohub.service;

import com.autohub.entity.AppUser;
import com.autohub.entity.TestDrive;
import com.autohub.repository.TestDriveRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TestDriveService {
    private final TestDriveRepository testDriveRepository;
    private final CarRepository carRepository;
    private final AppUserRepository appUserRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final TestDriveNotificationService notificationService;

    public TestDriveService(TestDriveRepository testDriveRepository,
                            CarRepository carRepository,
                            AppUserRepository appUserRepository,
                            ApplicationEventPublisher eventPublisher,
                            TestDriveNotificationService notificationService) {
        this.testDriveRepository = testDriveRepository;
        this.carRepository = carRepository;
        this.appUserRepository = appUserRepository;
        this.eventPublisher = eventPublisher;
        this.notificationService = notificationService;
    }
    @Transactional
    public TestDrive bookTestDrive(TestDriveRequest request, String customerEmail) {
        Car car = carRepository.findByIdAndDeletedFalseAndStatus(request.carId(), com.autohub.entity.CarStatus.AVAILABLE)
                .orElseThrow(() -> new IllegalArgumentException("Car not available"));
        AppUser customer = appUserRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        if (testDriveRepository.existsByCarIdAndAppointmentDateAndStatusNot(
                car.getId(), request.appointmentDate(), TestDriveStatus.REJECTED)) {
            throw new IllegalArgumentException("Car already booked for that slot");
        }

        TestDrive testDrive = new TestDrive();
        testDrive.setCar(car);
        testDrive.setCustomer(customer);
        testDrive.setAppointmentDate(request.appointmentDate());
        testDrive.setStatus(TestDriveStatus.PENDING);
        return testDriveRepository.save(testDrive);
    }

    @Transactional(readOnly = true)
    public List<TestDrive> getAllTestDrives() {
        List<TestDrive> testDrives = testDriveRepository.findAll();
        // Force initialization of lazy-loaded relationships to avoid LazyInitializationException
        testDrives.forEach(td -> {
            // Initialize car relationship
            if (td.getCar() != null) {
                td.getCar().getId();
                td.getCar().getMake();
                td.getCar().getModel();
            }
            // Initialize customer relationship
            if (td.getCustomer() != null) {
                td.getCustomer().getId();
                td.getCustomer().getEmail();
                td.getCustomer().getFullName();
            }
        });
        return testDrives;
    }

    public List<TestDrive> getMyTestDrives(String customerEmail) {
        AppUser customer = appUserRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        return testDriveRepository.findAll().stream()
                .filter(td -> td.getCustomer().getId().equals(customer.getId()))
                .toList();
    }

    @Transactional
    public TestDrive updateStatus(Long id, TestDriveStatus status) {
        TestDrive testDrive = testDriveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Test drive not found"));
        testDrive.setStatus(status);
        eventPublisher.publishEvent(new TestDriveStatusChangedEvent(testDrive));
        return testDrive;
    }

    @Transactional
    public void cancelTestDrive(Long id, String customerEmail) {
        TestDrive testDrive = testDriveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Test drive not found"));

        // Verify ownership
        if (!testDrive.getCustomer().getEmail().equals(customerEmail)) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        // Only PENDING bookings can be canceled
        if (testDrive.getStatus() != TestDriveStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be cancelled");
        }

        testDrive.setStatus(TestDriveStatus.REJECTED);
        testDriveRepository.save(testDrive);

        // Send cancellation email notification (async)
        notificationService.notifyCancellation(testDrive);
    }
}
