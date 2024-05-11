package com.mra.mono.dto.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.proxy.HibernateProxy;

import java.util.*;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "branches")
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID branchId;

    private UUID companyId;
    private UUID locationId;
    private UUID menuId;
    private String picture;
    private String branchName;
    private String branchImage;
    private String address;
    private String phone;

    @CreationTimestamp
    @Column(name = "create_time")
    private Date createTime;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Branch branch = (Branch) o;
        return getBranchId() != null && Objects.equals(getBranchId(), branch.getBranchId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
