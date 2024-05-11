package com.mra.mono.dto.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "locations")
public class Locations {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID locationId;

    private String city;

    private String district;

    private String street;

    private Integer buildingNumber;

    private Integer apartmentNumber;

    @Column(name = "open_address", length = 1024)
    private String openAddress;

    @CreationTimestamp
    @Column(name = "create_time")
    private Date createTime;
}
