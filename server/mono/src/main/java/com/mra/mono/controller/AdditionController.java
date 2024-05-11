package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.dto.entity.Addition;
import com.mra.mono.dto.entity.Order;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.AdditionAddRequest;
import com.mra.mono.dto.request.CreateOrderReq;
import com.mra.mono.dto.response.OrderRes;
import com.mra.mono.service.AdditionService;
import com.mra.mono.service.OrderService;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/addition")
@Slf4j
@AllArgsConstructor
public class AdditionController  extends BaseController {

    @Resource
    private final AdditionService additionService;


    @MessageMapping("/addition/{branchId}/{tableId}")
    @SendTo("/topic/addition/{branchId}/{tableId}")
    public ResponseEntity<Message<String>> addPayment(@RequestBody AdditionAddRequest addition) {
        System.out.println(addition.toString());
        try {
            Addition newAddition = additionService.createAddition(addition);

            return buildSuccessReturnEntity("success");
        } catch (Exception e) {
            log.error("Error creating order", e);
            return buildFailureReturnEntity("Error creating order");
        }
    }


}

