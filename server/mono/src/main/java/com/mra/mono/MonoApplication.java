package com.mra.mono;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MonoApplication {

    public static void main(String[] args) {
        SpringApplication.run(MonoApplication.class, args);
    }

}
