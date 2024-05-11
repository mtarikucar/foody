package com.mra.mono.common.utils;

import java.lang.reflect.Field;

public class CustomBeanUtils {
    public static void copyNonNullProperties(Object source, Object target) {
        if (source == null || target == null) {
            return; // Kaynak veya hedef nesne null ise işlem yapma
        }

        Field[] fields = source.getClass().getDeclaredFields();

        for (Field field : fields) {
            field.setAccessible(true); // Özel alanlara erişim sağlamak için
            try {
                Object value = field.get(source);
                if (value != null) {
                    Field targetField = target.getClass().getDeclaredField(field.getName());
                    targetField.setAccessible(true);
                    targetField.set(target, value);
                }
            } catch (IllegalAccessException | NoSuchFieldException e) {
                e.printStackTrace();
            }
        }
    }
}
