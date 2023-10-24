package com.gis.service;

import com.gis.dto.GpsDto;
import com.gis.dto.LocalDto;
import com.gis.mapper.GisLiveMapper;
import com.gis.vo.Gps;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GisLiveService {

    private final GisLiveMapper gisLiveMapper;

    public List<String> findCarNumTables() {

        return gisLiveMapper.findCarNumTables();
    }

    public GpsDto findLiveGps(String carNum) {
        return gisLiveMapper.findLiveGpsByTempGps(carNum);
    }

    public void saveLiveGps(GpsDto gpsDto) {
        gisLiveMapper.saveLiveGps(gpsDto);
    }

    public LocalDto findLocalDbOnToday(LocalDate date) {
        return gisLiveMapper.findLocalDbOnToday(date);
    }

    public void callCreateLiveTable(String carNum) {
        gisLiveMapper.callCreateGpsProcedure(carNum);
    }

    public void callDeleteLiveTable(String carNum) {
        gisLiveMapper.callDeleteGpsProcedure(carNum);
    }

    public void displayLiveGps(GpsDto gpsDto) {

        String carNum = gpsDto.getCarNum();
        carNum = carNum.replaceAll("\\s", "");
        callCreateLiveTable(carNum);
        saveLiveGps(gpsDto);

    }
}
