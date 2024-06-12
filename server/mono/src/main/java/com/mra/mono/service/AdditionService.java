package com.mra.mono.service;

import com.mra.mono.dto.entity.*;
import com.mra.mono.dto.request.AdditionAddRequest;
import com.mra.mono.repository.AdditionRepository;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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
