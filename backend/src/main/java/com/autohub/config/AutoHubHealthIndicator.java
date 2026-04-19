package com.autohub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.File;
import java.sql.Connection;

/**
 * Custom HealthIndicator for AutoHub.
 * Checks:
 *   1. Database connectivity (validates JDBC connection with a 2-second timeout)
 *   2. Disk space for the uploads directory (warns below 100 MB free)
 *
 * Accessible at: GET /api/actuator/health
 * Requires spring-boot-starter-actuator on the classpath and
 * management.endpoints.web.exposure.include=health in application.yml.
 */
@Component("autohub")
public class AutoHubHealthIndicator implements HealthIndicator {

    private static final long DISK_WARN_THRESHOLD_MB = 100;

    private final DataSource dataSource;
    private final String uploadDir;

    public AutoHubHealthIndicator(DataSource dataSource,
                                  @Value("${storage.upload-dir:uploads}") String uploadDir) {
        this.dataSource = dataSource;
        this.uploadDir  = uploadDir;
    }

    @Override
    public Health health() {
        boolean dbOk   = checkDatabase();
        boolean diskOk = checkDiskSpace();

        Health.Builder builder = (dbOk && diskOk) ? Health.up() : Health.down();

        // Database details
        builder.withDetail("database.status", dbOk ? "UP" : "DOWN");

        // Disk details
        File dir        = new File(uploadDir).getAbsoluteFile();
        long freeMb     = dir.getFreeSpace()  / (1024 * 1024);
        long totalMb    = dir.getTotalSpace() / (1024 * 1024);
        long usedMb     = totalMb - freeMb;
        int  usedPct    = totalMb > 0 ? (int) (usedMb * 100 / totalMb) : 0;

        builder.withDetail("disk.path",        dir.getAbsolutePath())
               .withDetail("disk.totalMb",     totalMb)
               .withDetail("disk.usedMb",      usedMb)
               .withDetail("disk.freeMb",      freeMb)
               .withDetail("disk.usedPercent", usedPct + "%")
               .withDetail("disk.status",      diskOk ? "OK" : "LOW (< " + DISK_WARN_THRESHOLD_MB + " MB free)");

        return builder.build();
    }

    // ─────────────────────────────────────────────────────────────────────────

    private boolean checkDatabase() {
        try (Connection conn = dataSource.getConnection()) {
            return conn.isValid(2); // 2-second timeout
        } catch (Exception ex) {
            return false;
        }
    }

    private boolean checkDiskSpace() {
        File dir    = new File(uploadDir).getAbsoluteFile();
        long freeMb = dir.getFreeSpace() / (1024 * 1024);
        return freeMb >= DISK_WARN_THRESHOLD_MB;
    }
}
