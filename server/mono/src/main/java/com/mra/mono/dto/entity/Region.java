package com.mra.mono.dto.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;
import java.util.Objects;
import java.util.UUID;


@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "region")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID RegionId;

    private UUID branchId;

    private String regionName;

    @CreatedDate
    private Date createTime;

}
