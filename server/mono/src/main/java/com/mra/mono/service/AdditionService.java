package com.mra.mono.service;

import com.mra.mono.dto.entity.*;
import com.mra.mono.dto.request.AdditionAddRequest;
import com.mra.mono.repository.AdditionRepository;
import com.mra.mono.repository.BranchRepository;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class AdditionService {

    @Resource
    private final OrderService orderService;
    @Resource
    private final AdditionRepository additionRepository;
    @Resource
    private final SimpMessagingTemplate messagingTemplate;

    @Resource
    private BranchRepository branchRepository;


    @Transactional
    public Addition createAddition(AdditionAddRequest additionAddRequest) {
        try {

            Addition addition = new Addition();
            BeanUtils.copyProperties(additionAddRequest, addition);
            additionAddRequest.getOrderIds().forEach(orderId -> orderService.changeOrderStatus(orderId, 2));
            additionRepository.save(addition);

            System.out.println("Addition created: " + addition.getAdditionId());

            return addition;

        } catch (Exception e) {
            log.error("Error creating order", e);
            throw e;
        }
    }


}
