# React Natvie

## 1주차 : 개발 환경 세팅 , 기존 앱(ITZY) 코드 구조/module 분석

> 초기 세팅 당시, `SDK location not found` 해결 방법

1. React Native 프로젝트에서 android 디렉터리 접근
2. android 디렉터리에서 local.properties 파일 생성
3. 아래 접근 경로 입력

- Window

```
sdk.dir=C:\Users\UserName\AppData\Local\Android\sdk
```

- Mac

```
sdk.dir = /Users/USERNAME/Library/Android/sdk
```

> npm module 세팅

1. babel : 자바스크립트 컴파일러

- 새로운 ESNext 문법을 기존 브라우저에 사용하기 위한 module
- Typescript를 javapScript로의 compile을 위해 필수
- 최신문법 ES6, ES7 이상 문법들을 브라우저가 이해할 수 있는 문법으로 변환해주는 역할

2. Jest : JS 테스트 프레임워크

- 큰 규모의 프로젝트에서 상황에 맞는 결과가 나오는지 테스트
- jest와 babel-jest 함께 설치
- **package-json**에 test 실행시 jest가 실행되도록 작성

```json
"scripts": {
    "test": "jest",
  },
```

3. react-native-firebase : RN에서 Firebase를 이용하기 위한 모듈

- google admob을 사용하기 위해 firebase 연동
- 터미널에 react-native-firebase 라이브러리 프로젝트 연결

```
react-native link react-native-firebase
```

## 2주차 : Firebase 프로젝트 생성 & RN 테스트 용 앱에 GooGle Admob 연동

1. react-native-cli(with TS Template)를 통해 프로젝트 생성

```
npx react-native init rnFirbaseExample --template react-native-template-typescript
```

2. firebase console에 적용할 firebase 프로젝트 생성

<img style="width : 70%" src="https://user-images.githubusercontent.com/41010744/128311927-623dfe3e-a2ba-493c-8e58-bdefc8b798c2.png">

3. React-native-firebase 설치

```
npm i @react-native-firebase/app
```

설치시 react-native-firebase/auth , react-native-firebase/firestore , react-native-firebase/storage 함께 설치

4. Android App 설정

- firebase console > project settings > general > your apps > android icon 클릭

5. package name, SHA-1 입력

- SHA-1은 android/app/src/main/AndroidManifest.xml 해당 경로에서 확인 가능
- 또는, android 폴더 내에서 아래 명령어 실행

```
gradlew signingReport
```

<img style="width : 70%" src="https://user-images.githubusercontent.com/41010744/128312746-7b673c41-9a40-4fb8-9d81-7b35fff6847b.png">

6. android/app 경로에 `google-services.json` 파일 등록

7. android/build.gradle 경로에 아래 classpath 추가

```
buildscript {
    ...
    dependencies {
        classpath("com.android.tools.build:gradle:3.5.3")
        classpath("com.google.gms:google-services:4.3.4") // ---> 추가!
    }
}

allprojects {
...
}
```

8. android/app/build.gradle 경로에 아래 plugin, dependencies 추가

```
apply plugin: "com.android.application"
apply plugin: "com.google.gms.google-services"  // ---> 추가!

....

dependencies {
    implementation platform('com.google.firebase:firebase-bom:26.2.0')  // ---> 추가!
    implementation fileTree(dir: "libs", include: ["*.jar"])
    //noinspection GradleDynamicVersion
    implementation "com.facebook.react:react-native:+"  // From node_modules

	...
    implementation 'com.google.firebase:firebase-analytics'  // ---> 추가!
}
```

위의 과정 중 빌드 오류(`app:transformDexArchiveWithDexMergerForDebug FAILED`) 시, 아래 순서대로 clean 후 다시 빌드

```
cd android
gradlew clean
cd ..
npx react-native run-android
```

또는, android/app/build.gradle에서 multiDexEnabled를 true로 설정

```
android {
    ...
    defaultConfig {
        multiDexEnabled true // 추가
    }
}
```

9. Google Admob 가입 후 앱을 생성

- https://apps.admob.com/v2/home

10. react-native-firebase/admob 설치

```
npm i --save @react-native-firebase/admob
```

11. admob 연결

- 루트 폴더에 firebase.json 파일 생성한 후 아래 코드에 admob의 앱 아이디를 추가 후 저장

```
{
  "react-native": {
    "admob_android_app_id": "앱 아이디",
    "admob_ios_app_id": "앱 아이디"
  }
}
```

- 위의 설정 까지 하여 firebase, firebase/admob 을 사용할 준비를 마쳤습니다.

## 3주차 : 기존 앱(ITZY)에 Google Admob 적용 (Android, IOS)

- 기존 앱(ITZY) 프로젝트는 구조가 아래와 같습니다.

```
ITZ-RN-V2
|   .idea
|   __tests__
|   android
    | gradle
    | src
    | ...

|   ios
    | info.plist
    | ...
|   src
    | components
        | auth
            | AuthLoading.tsx
            | Signin.tsx
        | chat
            | @@@.tsx
        | main
            | public_chat_main.tsx
            | private_chat_main.tsx
            | settings_main.tsx
            | ...
```

- 기본 적인 앱의 구조는 android, ios 내 src 폴더 내에서 로직을 작성하지 않고 루트 폴더 내 src 내 component로 따로 폴더를 관리하여 해당 파일들이 android, ios 두 플랫폼에서 같이 동작할 수 있도록 RN의 장점을 살린 구조입니다.
- 제가 맡은 기능은 아래와 같습니다.
- src/components/main > 공개 채팅방, 1:1 채팅방 에서의 banner 광고
- src/components/auth > 로그인 후 로딩 중 전면 광고 
- 배너광고와 전면광고에 대한 android 개발에 대해서 아래의 메뉴얼을 제공하고 있습니다.
- 배너 광고 : https://developers.google.com/admob/android/banner?hl=ko
- 전면 광고 : https://developers.google.com/admob/android/interstitial?hl=ko
- 하지만, IOS 환경을 고려해야 하고 위의 프로젝트 구조 처럼 되어 있어 android와 ios 폴더 내에서의 코드 처리가 불가 하여 src/components 내에서 처리해야 했습니다.
- 따라서 메뉴얼의 내용을 참고하여 해당 파일을 전역으로 관리할 수 있도록 구조를 변경하여 처리하였습니다.
- 그리고 실제 수익을 내기 위해서는 `app.ads.txt` 와 스토어 등록되어 있는 확인 절차를 거쳐야 되었기 위의 과정을 순서대로 진행하였습니다.

<img src="https://user-images.githubusercontent.com/41010744/128319506-3490e2cf-842d-4a5e-9bee-fe1b451c9cfb.png">

## 구현 결과 : 차례대로 로딩 후 전면광고 & 상단 배너 광고 
<img style="width : 40%; display:inline-block" src="https://user-images.githubusercontent.com/41010744/128320673-8c77910f-38df-4d71-817f-5e5454893ab8.png">
<img style="width : 40%; display:inline-block" src="https://user-images.githubusercontent.com/41010744/128320709-ffa1a634-3b9c-4064-9115-7532396312eb.png">
<img style="width : 40%; display:inline-block" src="https://user-images.githubusercontent.com/41010744/128320744-fd47a6d3-d9e5-473b-b2fa-e29f541ceaff.png">
<img style="width : 40%; display:inline-block" src="https://user-images.githubusercontent.com/41010744/128320770-fd06a90b-ffc2-47b3-88ee-31a2b3ddff8c.png">