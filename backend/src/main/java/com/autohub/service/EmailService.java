package com.autohub.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private static final String FROM_EMAIL = "itspasinduhimal@gmail.com";

    public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(FROM_EMAIL);
            helper.setTo(to);
            helper.setSubject("Welcome to AutoHub!");

            // Prepare the Thymeleaf context
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("email", to);

            // Process the template
            String htmlContent = templateEngine.process("welcome-email", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MailSendException e) {
            // Handle SMTP send errors gracefully
            String errorMessage = e.getMessage();
            throw new RuntimeException("Failed to send welcome email: " + errorMessage, e);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    /**
     * Loads a template file from the resources/templates directory.
     * Used by TestDriveNotificationService for simple string replacement templates.
     */
    public String loadTemplate(String templateName) {
        try {
            // Remove "templates/" prefix if present, as ClassPathResource expects path from
            // resources root
            String resourcePath = templateName.startsWith("templates/")
                    ? templateName
                    : "templates/" + templateName;

            ClassPathResource resource = new ClassPathResource(resourcePath);
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load template: " + templateName, e);
        }
    }

    /**
     * Sends an email with custom subject and HTML body.
     * Used by TestDriveNotificationService for test drive status updates.
     */
    public void sendStatusUpdateEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(FROM_EMAIL);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true indicates HTML content

            mailSender.send(message);
        } catch (MailSendException e) {
            // Handle SMTP send errors gracefully
            String errorMessage = e.getMessage();
            throw new RuntimeException("Failed to send status update email: " + errorMessage, e);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send status update email", e);
        }
    }
}
