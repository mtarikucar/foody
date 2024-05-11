package com.mra.mono.common.constant;


import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Arrays;
import java.util.List;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    @Override
    public String convertToDatabaseColumn(List<String> list) {
        // Listeyi virgülle ayrılmış bir stringe dönüştürün
        return list != null ? String.join(",", list) : null;
    }

    @Override
    public List<String> convertToEntityAttribute(String joined) {
        // String'i virgülle ayrılmış değerlere bölün
        return joined != null ? Arrays.asList(joined.split(",")) : null;
    }
}
