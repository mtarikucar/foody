package com.mra.mono.dto.entity;

import ch.qos.logback.core.model.INamedModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "payments")
public class Payments {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID paymentId;
    private UUID companyId;
    private Long amount;
    private Long price;
    private String logo;
    @ElementCollection
    private List<String> featureList;

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Date paymentDate;

    private Integer status;
}
