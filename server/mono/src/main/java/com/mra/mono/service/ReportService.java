package com.mra.mono.service;

import com.mra.mono.common.utils.DateUtils;
import com.mra.mono.dto.entity.Addition;
import com.mra.mono.dto.entity.Branch;
import com.mra.mono.dto.entity.Order;
import com.mra.mono.dto.response.AdditionReportRes;
import com.mra.mono.dto.response.ReportWidgetsRes;
import com.mra.mono.repository.AdditionRepository;
import com.mra.mono.repository.BranchRepository;
import com.mra.mono.repository.OrderRepository;
import com.mra.mono.repository.UserRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class ReportService {
    @Resource
    private final BranchRepository branchRepository;
    @Resource
    private final AdditionRepository additionRepository;
    @Resource
    private final UserRepository userRepository;
    @Resource
    private final OrderRepository orderRepository;

    public List<AdditionReportRes> getAdditionReportsByCompany(UUID companyId) {
        try {
            // Şirketin tüm branch'lerini getir
            List<Branch> branches = branchRepository.findAllByCompanyId(Optional.ofNullable(companyId));

            // Stream API ile tüm branch'ler üzerinden işlem yap
            return branches.stream()
                    .flatMap(branch -> additionRepository.findAllByBranchId(branch.getBranchId()).stream()
                            .map(addition -> {
                                // Addition nesnesini AdditionReportRes'e dönüştür
                                AdditionReportRes reportRes = new AdditionReportRes();
                                reportRes.setAdditionId(addition.getAdditionId());
                                reportRes.setAmount(addition.getAmount());
                                reportRes.setCard(addition.getCard());
                                reportRes.setCash(addition.getCash());
                                reportRes.setOther(addition.getOther());
                                reportRes.setBranchName(branch.getBranchName());
                                reportRes.setCreateTime(addition.getCreateTime());

                                // Order'ları orderIds'den yükle
                                List<Order> orderList = orderRepository.findAllById(addition.getOrderIds());
                                reportRes.setOrderCount(orderList.size());  // Order listesini set et

                                return reportRes;
                            })
                    )
                    .collect(Collectors.toList());  // Sonuçları listeye dönüştür
        } catch (Exception e) {
            log.error("Error retrieving addition reports for company", e);
            throw e;
        }
    }

    public ReportWidgetsRes getReportWidgets(UUID companyId) {
        try {
            // Şirketin tüm branch'lerini al
            List<Branch> branches = branchRepository.findAllByCompanyId(Optional.ofNullable(companyId));
            if (branches.isEmpty()) {
                throw new RuntimeException("No branches found for the company.");
            }

            // Toplamları tutacak değişkenler
            int totalCompanyOrderPrice = 0;
            int totalOrderCount = 0;
            int totalProductCount = 0;

            // Tüm branch'lerin addition'larını işleyelim
            for (Branch branch : branches) {
                List<Addition> additions = additionRepository.findAllByBranchId(branch.getBranchId());

                for (Addition addition : additions) {
                    totalCompanyOrderPrice += addition.getAmount();  // Her addition'ın miktarını ekle

                    if (addition.getOrderIds() != null) {
                        totalOrderCount += addition.getOrderIds().size();  // Sipariş sayısını ekle
                        totalProductCount += calculateProductCountForAddition(addition);  // Ürün sayısını hesapla
                    }
                }
            }

            // Sonuçları ReportWidgetsRes'e set et
            ReportWidgetsRes reportWidgetsRes = new ReportWidgetsRes();
            reportWidgetsRes.setTotalCompanyOrderPrice(totalCompanyOrderPrice);
            reportWidgetsRes.setTotalOrderCount(totalOrderCount);
            reportWidgetsRes.setTotalProductCount(totalProductCount);
            reportWidgetsRes.setTotalBranchCount(branches.size());  // Branch sayısını set et
            reportWidgetsRes.setTotalUserCount(calculateTotalUsers(companyId));  // Toplam kullanıcı sayısını hesapla
            reportWidgetsRes.setTotalMonthlyPrice(calculateMonthlyPrice(branches));  // Aylık fiyatı hesapla

            return reportWidgetsRes;
        } catch (Exception e) {
            log.error("Error retrieving report widgets for company with ID: {}", companyId, e);
            throw new RuntimeException("Failed to retrieve report widgets.", e);
        }
    }

    // Ürün sayısını hesaplayan yardımcı method
    private int calculateProductCountForAddition(Addition addition) {
        // Her sipariş için ürün sayısını hesaplarsınız, burada örnek bir mantık uygulanmıştır
        return addition.getOrderIds() != null ? addition.getOrderIds().size() : 0;
    }

    // Şirketin toplam kullanıcı sayısını hesaplayan method
    private int calculateTotalUsers(UUID companyId) {
        // Örnek: userRepository ile toplam kullanıcıları sayın
        return userRepository.countByCompanyId(companyId);
    }

    private int calculateMonthlyPrice(List<Branch> branches) {
        int monthlyPrice = 0;
        Date currentMonthStart = DateUtils.getStartOfCurrentMonth();  // Geçerli ayın başlangıcını alın

        for (Branch branch : branches) {
            List<Addition> additions = additionRepository.findAllByBranchId(branch.getBranchId());
            for (Addition addition : additions) {
                Date createTime = addition.getCreateTime();  // Addition'dan createTime al

                // Eğer createTime geçerli ayın başından sonra ise aylık fiyat hesaplamasına ekle
                if (createTime.after(currentMonthStart)) {
                    monthlyPrice += addition.getAmount();  // Aylık toplam tutarı hesapla
                }
            }
        }
        return monthlyPrice;
    }
}
