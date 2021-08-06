## Promise

> A promise is an object that may produce a single value some time in the future

- 자바스크립트 비동기 처리에 사용되는 객체
- 특정 코드의 실행이 완료될 때까지 기달지ㅣ 않고 다음 코드를 먼저 수행하는 자바스크립트의 특성

> 필요 이유 ?

- 서버에 데이터를 요청하고 데이터를 받아오기도 전에 화면에 표시하려 하면 오류가 발생하고 문제점을 해결하기 위한 방법

> 3가지 상태(states)

1. Pending(대기) : 비동기 처리 로직이 아직 완료되지 않은 상태

- 콜백 함수의 인자는 resolve, reject

```js
new Promise(function (resolve, reject) {
  // ...
});
```

2. Fulfilled(이행) : 비동기 처리가 완료되어 프로미스가 결과 값을 반환해준 상태

- 이행 상태가 되면 아래와 같이 then()을 이용하여 처리 결과 값을 받을 수 있다

```js
function getData() {
  return new Promise(function (resolve, reject) {
    var data = 100;
    resolve(data);
  });
}

// resolve()의 결과 값 data를 resolvedData로 받음
getData().then(function (resolvedData) {
  console.log(resolvedData); // 100
});
```

3. Rejected(실패) : 비동기 처리가 실패하거나 오류가 발생한 상태

- 실패 상태가 되면 실패한 이유를 catch()로 받을 수 있다

```js
function getData() {
  return new Promise(function (resolve, reject) {
    reject(new Error("Request is failed"));
  });
}

// reject()의 결과 값 Error를 err에 받음
getData()
  .then()
  .catch(function (err) {
    console.log(err); // Error: Request is failed
  });
```

**_출처_** : https://joshua1988.github.io/web-development/javascript/promise-for-beginners/
