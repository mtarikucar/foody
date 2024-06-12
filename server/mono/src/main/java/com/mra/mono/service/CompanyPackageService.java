package com.mra.mono.service;

import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.CompanyPackage;
import com.mra.mono.dto.entity.Package;
import com.mra.mono.repository.CompanyPackageRepository;
import com.mra.mono.repository.PackageRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;

@Service
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class CompanyPackageService {

    @Resource
    private CompanyPackageRepository companyPackageRepository;

    @Resource
    private PackageRepository packageRepository;

    public List<CompanyPackage> getByCompanyId(UUID companyId){
        return companyPackageRepository.findAllByCompanyId(companyId);
    }



    public CompanyPackage createNewSubscription(UUID companyId, UUID packageId) {

        Package packageData = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found"));

        Optional<CompanyPackage> existingSubscription = companyPackageRepository.findByCompanyId(companyId);

        if (existingSubscription.isPresent()) {
            CompanyPackage currentSubscription = existingSubscription.get();
            Date now = new Date();
            Date expireDate = currentSubscription.getExpireDate();

            if (expireDate.after(now) || withinRenewalPeriod(now, expireDate)) {
                return updateSubscriptionExpireDate(currentSubscription, packageData.getDuration());
            }
        }

        CompanyPackage companyPackage = new CompanyPackage();
        companyPackage.setPackageId(packageData.getPackageId());
        companyPackage.setCompanyId(companyId);
        companyPackage.setPurchaseDate(new Date());

        setExpireDateBasedOnDuration(companyPackage, packageData.getDuration());

        return companyPackageRepository.save(companyPackage);
    }

    private boolean withinRenewalPeriod(Date now, Date expireDate) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(expireDate);
        calendar.add(Calendar.DAY_OF_YEAR, -15);
        return now.after(calendar.getTime());
    }

    private void setExpireDateBasedOnDuration(CompanyPackage companyPackage, Integer duration) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.MONTH, duration);
        companyPackage.setExpireDate(calendar.getTime());
    }

    private CompanyPackage updateSubscriptionExpireDate(CompanyPackage companyPackage, Integer duration) {
        setExpireDateBasedOnDuration(companyPackage, duration);
        return companyPackage;
    }

    public CompanyPackage getSubscription(UUID companyId) {
        return companyPackageRepository.findByCompanyId(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));

    }

}

