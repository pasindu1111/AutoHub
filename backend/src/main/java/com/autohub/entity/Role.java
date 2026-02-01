package com.autohub.entity;

/**
 * Defines the user roles within the AutoHub system.
 * String values are stored in the database.
 */
public enum Role {
    ADMIN,
    CUSTOMER,
    USER // Added USER as a fallback just in case
}