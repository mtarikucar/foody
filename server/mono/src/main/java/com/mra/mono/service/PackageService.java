package com.mra.mono.service;

import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.common.utils.CustomBeanUtils;
import com.mra.mono.dto.entity.Menu;
import com.mra.mono.dto.entity.Package;
import com.mra.mono.dto.entity.Product;
import com.mra.mono.dto.request.ProductAddReq;
import com.mra.mono.dto.request.ProductUpdateReq;
import com.mra.mono.repository.MenuRepository;
import com.mra.mono.repository.PackageRepository;
import com.mra.mono.repository.ProductRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class PackageService {
    @Resource
    private PackageRepository packageRepository;

    public List<Package> getAllPackages() {
        return packageRepository.findAllByOrderByDurationDesc();
    }

    public Package createPackage(Package newPackage){
        return packageRepository.save(newPackage);
    }


}

