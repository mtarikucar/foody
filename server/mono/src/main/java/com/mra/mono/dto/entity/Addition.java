package com.mra.mono.dto.entity;

import com.mra.mono.common.constant.StringListConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "addition")
public class Addition {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID additionId;
    private Double amount;
    private Double card;
    private Double cash;
    private Double other;
    private UUID branchId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "addition_order_ids", joinColumns = @JoinColumn(name = "addition_id"))
    @Column(name = "order_id")
    private List<UUID> orderIds = new ArrayList<>();

    private Date createTime;

    @PrePersist
    protected void onCreate() {
        createTime = new Date();
    }

}
