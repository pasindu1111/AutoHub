package com.autohub.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {

    private static final Logger logger = LoggerFactory.getLogger(FileService.class);
    private final Path uploadRoot;

    public FileService(@Value("${storage.upload-dir}") String uploadDir) {
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadRoot);
            logger.info("✅ Upload directory initialized: {}", uploadRoot.toAbsolutePath());
        } catch (IOException e) {
            logger.error("❌ Failed to create upload directory: {}", uploadRoot.toAbsolutePath(), e);
            throw new RuntimeException("Could not initialize upload directory", e);
        }
    }

    public String saveFile(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
        Path target = uploadRoot.resolve(filename).normalize();
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        logger.debug("Saved file: {}", filename);
        return filename;
    }

    public void deleteFile(String relativePath) throws IOException {
        if (relativePath == null || relativePath.isBlank()) {
            return;
        }
        Path target = uploadRoot.resolve(relativePath).normalize();
        Files.deleteIfExists(target);
        logger.debug("Deleted file: {}", relativePath);
    }
}
