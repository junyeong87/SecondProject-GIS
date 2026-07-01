# 청소차량 GisProject
### 중앙정보처리학원 - 선도소프트 기업 프로젝트 : 청소차량 관제 시스템 (Gis Project) <br>

## *목표* <br>
+ 청소차량에 탑재된 센서를 이용하여 청소차량 관제시스템 구축 <br>
+ 실제로 탑재된 센서 값을 사용할 수 없는 상황이기에 스마트폰에 존재하는 센서를 활용하여 가상의 값을 전달해주는 안드로이드앱 개발 <br>
+ 안드로이드 앱의 스마트폰 소음,진동,gps를 가져와 openlayres를 기반으로 웹 사이트 제작 <br>



# 청소차량 GIS 관제 시스템

중앙정보처리학원과 선도소프트 기업 프로젝트로 진행한 청소차량 관제 시스템입니다.  
실제 청소차량에 탑재된 센서 데이터를 대신해 안드로이드 스마트폰의 GPS, 소음, 진동 센서 값을 수집하고, 웹 관제 화면에서 차량 위치와 운행/청소 정보를 확인할 수 있도록 구성했습니다.

## 프로젝트 목표

- 스마트폰 센서를 활용한 가상 청소차량 데이터 수집
- GPS, 소음, 진동 데이터를 서버로 전송하고 PostgreSQL에 저장
- OpenLayers 기반 웹 지도에서 청소차량 이동 경로와 실시간 위치 확인
- 차량별 운행 시간, 총 이동 거리, 청소 거리, 미청소 거리, 청소 비율 통계 제공
- CSV 파일 업로드를 통한 센서 데이터 일괄 등록

## 주요 기능

### 웹 관제 시스템

- 차량별 지도 관제 화면 제공
- 차량 번호와 운행 날짜 기준 경로 조회
- 실시간 차량 GPS 위치 조회
- 운행 시간, 이동 거리, 청소 거리, 미청소 거리, 청소 비율 조회
- 연/월/일 기준 통계 데이터 조회
- GPS, 소음, 진동 CSV 파일 업로드 및 DB 저장

### 안드로이드 앱

- Google Map 기반 현재 위치 표시
- GPS 위치 데이터 수집
- 마이크 기반 소음 데이터 수집
- 가속도 센서 기반 진동 데이터 수집
- 지정 주기마다 서버로 센서 데이터 전송
- 측정 시작, 일시정지, 종료 제어
- 측정 상태 알림 표시

## 기술 스택

### Backend / Web

- Java 11
- Spring Boot 2.7.16
- Spring MVC
- JSP
- MyBatis
- PostgreSQL
- Lombok
- OpenCSV
- Maven

### Frontend

- JavaScript
- CSS
- JSP
- OpenLayers

### Android

- Java
- Android Gradle Plugin 8.1.1
- compileSdk 33
- minSdk 26
- Google Play Services / Google Maps
- Volley
- OpenCSV

## 프로젝트 구조

```text
SecondProject-GIS
├── Sundo_Gis_ATeam
│   ├── src/main/java/com/gis
│   │   ├── controller
│   │   ├── csv
│   │   ├── dto
│   │   ├── mapper
│   │   ├── service
│   │   └── vo
│   ├── src/main/resources
│   │   ├── mapper
│   │   ├── static
│   │   │   ├── css
│   │   │   ├── img
│   │   │   ├── js
│   │   │   └── upload-csv
│   │   └── application.properties
│   ├── src/main/webapp/WEB-INF/view
│   │   ├── login.jsp
│   │   ├── map.jsp
│   │   ├── stat.jsp
│   │   └── fileInput.jsp
│   └── pom.xml
└── gis_project_app/gis_project_app
    ├── app
    │   ├── src/main/java/com/example/gis_project_app
    │   │   ├── MainActivity.java
    │   │   ├── IntroDialog.java
    │   │   └── CsvFile.java
    │   ├── src/main/AndroidManifest.xml
    │   └── build.gradle
    ├── build.gradle
    └── settings.gradle
