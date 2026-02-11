package com.autohub.service;

import com.autohub.entity.TestDrive;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TestDriveNotificationService {

    private static final Logger log = LoggerFactory.getLogger(TestDriveNotificationService.class);

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private final EmailService emailService;

    public TestDriveNotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void notifyStatusChange(TestDrive testDrive) {
        log.info("🔔 Preparing status update notification for TestDrive ID: {} | Status: {}", testDrive.getId(),
                testDrive.getStatus());
        
        String templateName;
        String subject;
        
        if (testDrive.getStatus() == com.autohub.entity.TestDriveStatus.APPROVED) {
            templateName = "templates/test-drive-approved.html";
            subject = "🎉 Test Drive Approved! Get Ready to Drive";
        } else if (testDrive.getStatus() == com.autohub.entity.TestDriveStatus.REJECTED) {
            templateName = "templates/test-drive-rejected.html";
            subject = "Test Drive Request Update - AutoHub";
        } else {
            templateName = "templates/test-drive-status.html";
            subject = "Test Drive Status Update";
        }

        String template = emailService.loadTemplate(templateName);
        String body = template
                .replace("{{name}}", testDrive.getCustomer().getFullName())
                .replace("{{car}}", testDrive.getCar().getMake() + " " + testDrive.getCar().getModel())
                .replace("{{date}}", testDrive.getAppointmentDate().format(FORMATTER))
                .replace("{{status}}", testDrive.getStatus().name());

        try {
            emailService.sendStatusUpdateEmail(
                    testDrive.getCustomer().getEmail(),
                    subject,
                    body);
            log.info("✅ Email notification sent successfully to {} for TestDrive ID: {}", 
                    testDrive.getCustomer().getEmail(), testDrive.getId());
        } catch (Exception e) {
            log.error("❌ Failed to send email notification for TestDrive ID: {} - Error: {}", 
                    testDrive.getId(), e.getMessage(), e);
            // Don't throw exception - email failure shouldn't break the status update
        }
    }

    public void notifyCancellation(TestDrive testDrive) {
        String template = emailService.loadTemplate("templates/test-drive-cancelled.html");
        String body = template
                .replace("{{name}}", testDrive.getCustomer().getFullName())
                .replace("{{car}}", testDrive.getCar().getMake() + " " + testDrive.getCar().getModel())
                .replace("{{date}}", testDrive.getAppointmentDate().format(FORMATTER));
        emailService.sendStatusUpdateEmail(
                testDrive.getCustomer().getEmail(),
                "Test Drive Booking Cancelled",
                body);
    }
}
