package com.mra.mono.service;

import com.mra.mono.dto.entity.Feature;

import com.mra.mono.dto.request.FeatureAddReq;
import com.mra.mono.repository.FeatureRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class FeatureService {

    @Resource
    private FeatureRepository featureRepository;

    public Feature save(FeatureAddReq featureAddReq) {
        try {
            Feature feature = new Feature();
            feature.setCompanyId(featureAddReq.getCompanyId());
            feature.setFeatureName(featureAddReq.getName());
            feature.setFeatureId(UUID.randomUUID());

            return featureRepository.save(feature);
        } catch (Exception e) {
            log.error("Error while saving feature: ", e);
            throw e;
        }
    }

    public List<Feature> findByCompanyId(Optional<UUID> companyId) {
        try {
            return featureRepository.findAllByCompanyId(companyId);
        } catch (Exception e) {
            log.error("Error while fetching all product features", e);
            throw e;
        }
    }

    public List<Feature> findAll() {
        try {
            return featureRepository.findAll();
        } catch (Exception e) {
            log.error("Error while fetching all product features", e);
            throw e;
        }
    }

    public List<Feature> findAllFeatures(List<UUID> featureIds) {
        try {
            return featureRepository.findAllById(featureIds);
        } catch (Exception e) {
            log.error("Error while fetching all product features", e);
            throw e;
        }
    }
}
