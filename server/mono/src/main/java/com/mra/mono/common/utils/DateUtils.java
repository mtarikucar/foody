package com.mra.mono.common.utils;

import java.util.Calendar;
import java.util.Date;

public class DateUtils {
    public static Date getStartOfCurrentMonth() {
        // Calendar sınıfını kullanarak geçerli tarihi alın
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);  // Ayın ilk gününe set et
        calendar.set(Calendar.HOUR_OF_DAY, 0);   // Saat, dakika ve saniyeyi sıfırla
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        // Date objesi olarak döndür
        return calendar.getTime();
    }
}
