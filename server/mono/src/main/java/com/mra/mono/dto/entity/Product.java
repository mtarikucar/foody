package com.mra.mono.dto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mra.mono.common.constant.StringListConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.*;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID productId;

    private UUID categoryId;
    private UUID companyId;
    private String name;
    @Convert(converter = StringListConverter.class)
    private List<String> images;
    private Double price;
    private Integer ratings;
    private Date createTime;
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    private Set<UUID> featureIds = new HashSet<>();

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Product product = (Product) o;
        return getProductId() != null && Objects.equals(getProductId(), product.getProductId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
    
}
