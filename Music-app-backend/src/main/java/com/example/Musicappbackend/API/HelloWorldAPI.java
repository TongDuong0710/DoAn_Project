package com.example.Musicappbackend.API;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldAPI {
    @GetMapping({ "/hello" })
    public String firstPage() {
        return "Hello World";
    }
}
