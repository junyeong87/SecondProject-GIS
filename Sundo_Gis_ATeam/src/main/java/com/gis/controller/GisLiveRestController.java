package com.gis.controller;

import com.gis.dto.CarAndDateDto;
import com.gis.dto.GpsDto;
import com.gis.dto.LocalDto;
import com.gis.mapper.GisMapper;
import com.gis.service.GisLiveService;
import com.gis.service.GisService;
import com.gis.vo.Gps;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class GisLiveRestController {

    private final GisLiveService gisLiveService;
    private final GisMapper gisMapper;


    @PostMapping("/api/live/gps")
    public List<GpsDto> getLiveGps() {

        List<String> carNumTables = gisLiveService.findCarNumTables();
        List<GpsDto> list = new ArrayList<>();

        for (String carNum : carNumTables) {
            GpsDto liveGps = gisLiveService.findLiveGps(carNum);
            list.add(liveGps);
        }
        return list;
    }

    @PostMapping("/apl/live/route")
    public LocalDto getLiveRoute(@RequestBody LocalDate date) {

        log.info("date = {}", date);
        LocalDto localDto = gisLiveService.findLocalDbOnToday(date);
        log.info("localDto = {}", localDto);

        return localDto;
    }

}
