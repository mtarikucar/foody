package com.mra.mono.dto.entity;

import com.mra.mono.common.constant.StringListConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.*;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "features")
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID featureId;

    private String featureName;
    private UUID companyId;

}
