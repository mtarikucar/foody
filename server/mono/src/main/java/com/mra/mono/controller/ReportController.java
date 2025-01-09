package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.dto.entity.Addition;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.response.AdditionReportRes;
import com.mra.mono.dto.response.ReportWidgetsRes;
import com.mra.mono.service.ReportService;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("report")
@Slf4j
@AllArgsConstructor
public class ReportController extends BaseController {

    @Resource
    private final ReportService reportService;

    @GetMapping("/addition-reports/{companyId}")
    public ResponseEntity<Message<List<AdditionReportRes>>> getAdditionReportsByCompany(@PathVariable UUID companyId) {
        try {
            List<AdditionReportRes> reportList = reportService.getAdditionReportsByCompany(companyId);
            return buildSuccessReturnEntity(reportList);
        } catch (Exception e) {
            log.error("Error getting addition reports", e);
            return buildFailureReturnEntity("Error getting addition reports");
        }
    }

    @GetMapping("/widgets/{companyId}")
    public ResponseEntity<Message<ReportWidgetsRes>> getReportWidgets(@PathVariable UUID companyId) {
        try {
            // Servis katmanından şirketin tüm branch'lerinin addition'larını getir
            ReportWidgetsRes reportWidgetsResList = reportService.getReportWidgets(companyId);
            return buildSuccessReturnEntity(reportWidgetsResList);
        } catch (Exception e) {
            log.error("Error getting additions", e);
            return buildFailureReturnEntity("Error getting additions");
        }
    }

}
