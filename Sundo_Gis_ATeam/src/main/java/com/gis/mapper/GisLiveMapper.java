package com.gis.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.gis.dto.GpsDto;
import com.gis.dto.LocalDto;

@Mapper
public interface GisLiveMapper {


//  Gps findLiveGpsByTempGps(LocalDate date);

  LocalDto findLocalDbOnToday(LocalDate date);

  GpsDto findLiveGpsByTempGps(String carNum);

  void callCreateGpsProcedure(@Param("carNum") String carNum);

  void callDeleteGpsProcedure(@Param("carNum") String carNum);

  void callCreatePointProcedure(@Param("carNum") String carNum);

  void callDeletePointProcedure(@Param("carNum") String carNum);

  void callCreateLineProcedure(@Param("carNum") String carNum);

  void callDeleteLineProcedure(@Param("carNum") String carNum);

  void saveLiveGps(GpsDto gpsDto);

  List<String> findCarNumTables();



}
