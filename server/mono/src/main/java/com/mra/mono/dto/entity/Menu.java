package com.mra.mono.dto.entity;

import com.mra.mono.common.constant.StringListConverter;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.lang.reflect.Type;
import java.util.*;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@Table(name = "menus")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID menuId;

    private UUID companyId;
    private String menuName;
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<UUID> productIds = new HashSet<>();
    private String color;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> banners;

    private Date createTime;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Menu menu = (Menu) o;
        return getMenuId() != null && Objects.equals(getMenuId(), menu.getMenuId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
