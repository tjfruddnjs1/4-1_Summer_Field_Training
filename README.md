# 2021 하기계절제 현장실습 (회사명 : UserInsight)

## 목차
1. [React Native](#React-Native)
2. [Java Spring](#Java-Spring)
3. [React](#React)

### React Native (ITZ-RN-V2) 1주차 ~ 3주차

> 개요 : 
- 크로스 플랫폼(cross-platform)을 지원하는 서비스 중인 App ITZY(https://play.google.com/store/apps/details?id=kr.co.userinsight.itz)에 광고 수익을 위해 Google Admob api를 추가하는 역할을 맡았습니다.

> 환경 세팅 
1. Node Module Version 
- react : 16.13.1
- react-native : 0.63.4
- @babel/core : 7.8.4
- eslint : ^6.5.1
- typescript : ^3.9.5
- **@react-native-firebase/admob** : ^11.5.0

2. IDE, JDK
- IDE : IntelliJ 2021.1.2
- JDK : jdk-11.0.1 

3. 협업 도구
- Git 
- Yona ITS : git commit & push 시 코드 변경 내용을 확인 및 리뷰가 가능하며 이슈 담당자를 지정해 해당 이슈를 commit 내용에서 언급 시 자동으로 mapping 해주는 편리한 협업을 위한 도구(https://its.userinsight.co.kr/)

> 관련 자세한 내용은 ReactNative 폴더내 정리하였습니다.

### Java Spring (ITZ-ADMIN) 4주차 ~ 5주차

> 개요 :
- 위의 앱 (ITZY)을 관리할 수 있는 관리자 웹 페이지를 Java Spring으로 만드는 역할을 맡았습니다.

> 환경 세팅 
1. Pom.xml
- spring-boot-starter pacakge : web, tomcat, test, thymeleaf, jap, dialect, secuirty, validation
- lombok : Java의 라이브러리로 반복되는 메소드를 Annotation을 사용해서 자동으로 작성해주는 라이브러리

2. Database 
- Maria DB : 10.3(x64)
- heidiSQL : database 내부 테이블 구조 및 데이터들을 ui로 구조화 하여 보여주는 프로그램 (mysql workbench 와 유사)

3. IDE, JDK, 협업 도구는 RN과 동일

> 관련 자세한 내용은 JavaSpring 폴더내 정리하였습니다.

### React