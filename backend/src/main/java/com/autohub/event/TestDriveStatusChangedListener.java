package com.autohub.event;

import com.autohub.entity.TestDrive;
import com.autohub.entity.TestDriveStatus;
import com.autohub.service.TestDriveNotificationService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class TestDriveStatusChangedListener {

    private static final Logger log = LoggerFactory.getLogger(TestDriveStatusChangedListener.class);

    private final TestDriveNotificationService notificationService;

    public TestDriveStatusChangedListener(TestDriveNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleStatusChange(TestDriveStatusChangedEvent event) {
        TestDrive testDrive = event.testDrive();
        log.info("👂 Event received: TestDriveStatusChangedEvent for ID: {} -> New Status: {}", testDrive.getId(),
                testDrive.getStatus());

        if (testDrive.getStatus() == TestDriveStatus.APPROVED
                || testDrive.getStatus() == TestDriveStatus.REJECTED) {
            log.info("🚀 Triggering notification service for ID: {}", testDrive.getId());
            notificationService.notifyStatusChange(testDrive);
        } else {
            log.debug("ℹ️ No notification needed for status: {}", testDrive.getStatus());
        }
    }
}
