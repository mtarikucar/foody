package com.mra.mono.dto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.*;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID orderId;
    private UUID tableId;
    private Double totalAmount;
    private Double discount;
    private Integer status;
    private UUID branchId;

    @JsonIgnore
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL ,fetch = FetchType.EAGER)
    private Set<OrderDetail> orderDetails = new HashSet<>();


    private Date orderDate;
    private Date createTime;


    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Order order = (Order) o;
        return getOrderId() != null && Objects.equals(getOrderId(), order.getOrderId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
