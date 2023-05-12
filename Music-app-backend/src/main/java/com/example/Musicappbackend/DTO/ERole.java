package com.example.Musicappbackend.DTO;

public enum ERole {
    ADMIN("admin"), USER("user");

    private String value;

    ERole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
