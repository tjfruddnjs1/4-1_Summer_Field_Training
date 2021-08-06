## Redux

> 사용 이유 ?

- React만 사용해도 애플리케이션을 개발 할 수 있으나, 규모가 커지고 복잡해지면서 state관리가 복잡 해지는데 **Redux**는 복잡한 state관리를 단순하게 처리할 수 있게 도와줌

> Redux 3원칙

1. 모든 상태는 하나의 Store로 구성

- flux와의 차이점 , 쉽게 한 개의 store라는 것을 관리한다고 생각

2. 상태는 읽기 전용

- 상태를 변경하려면 action 이라는 객체를 전달하는 방법 뿐

3. 변화 함수는 순수 함수로 작성

- action이 상태를 어떻게 변경할지 명시하기 위해 reducer 작성

> Redux 용어

1. **action** : 일반 자바스크립트 객체 형태, 애플리케이션에서 발생한 일을 설명하는 이벤트로 생각

```js
const addTodoAction = {
  type: "todos/todoAdded",
  payload: "Buy milk",
};
```

- **type** 필드 처럼 작업을 설명하는 이름을 제공하는 문자열 => "domain/eventName" (ex. "todos/todoAdded")

2. **action creators** : action 객체를 만들어 return, 매번 작성할 필요는 X

```js
const addTodo = (text) => {
  return {
    type: "todos/todoAdded",
    payload: text,
  };
};
```

3. **Reducers** : state와 action 객체를 필요한 경우 상태를 업데이트하는 방법을 결정하고, 새로운 상태를 반환 , (state, action) => newState, 수신된 액션(이벤트) 유형에 따라 이벤트를 처리하는 event listener

- Array.reduce() 메서드에 전달하는 일종의 callback function과 유사

> Reducer 규칙

- state, action 인수를 기반을 새 상태 값만 계산
- 기존을 수정할 수 없다, 대신 기존 값을 복사하고 복사된 값을 변경하여 `변경할 수 없는 업데이트`를 수행해야 state
- 비동기 논리를 수행, 임의의 값을 계산, 기타 "부작용"을 일으키지 않아야 한다

```js
const initialState = { value: 0 };

function counterReducer(state = initialState, action) {
  // Check to see if the reducer cares about this action
  if (action.type === "counter/increment") {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1,
    };
  }
  // otherwise return the existing state unchanged
  return state;
}
```

4. **Store** : reducer를 전달하여 생성되며 `getState`를 통해 현재 상태 값을 반환 하는 메서드가 호출

```js
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({ reducer: counterReducer });

console.log(store.getState());
// {value: 0}
```

5. **Dispatch** : 상태를 업데이트하는 유일한 방법 `store.dispatch()`은 작업 개체를 호출 하고 전달하는 것, reducer 기능을 실행하고 내부에 새 상태 값을 저장 (`getState()`)하고 업데이트된 값을 검색하기 위해 호출

```js
store.dispatch({ type: "counter/increment" });

console.log(store.getState());
// {value: 1}
```

- dispatch 작업은 애플리케이션에서 "이벤트 트리거"로 생각 가능
- 무슨일이 일어났는지 store에 알리고 reducer는 이벤트 리스너 역할, 관심 있는 동작을 들을 때 응답으로 상태를 업데이트
- 일반적으로 올바른 작업을 전달하기 위해 작업 생성자를 호출 (위의 방식을 아래와 같이 사용)

```js
const increment = () => {
  return {
    type: "counter/increment",
  };
};

store.dispatch(increment());

console.log(store.getState());
// {value: 2}
```

6. **Selectors** : 저장소 상태 값에서 특정 정보를 추출하는 방법을 알고 있는 함수, 어플리케이션이 커질수록 앱의 다른 부분이 동일한 데이터를 읽어야 하므로 반복되는 논리를 방지하는 데 도움이 될 수 있다.

```js
const selectCounterValue = (state) => state.value;

const currentValue = selectCounterValue(store.getState());
console.log(currentValue);
// 2
```

> Redux 애플리케이션 데이터 흐름 : `단방향 데이터 흐름` 앱구조를 사용

- 초기 설정

1. Redux 저장소는 root reducer 기능을 사용하여 생성
2. store는 root reducer를 한 번 호출하고 반환 값을 초기 값으로 저장 `state`
3. UI가 처음 렌더링되면 UI 구성 요소는 Redux 저장소의 현재 상태에 access하고 해당 데이터를 사용하여 렌더링할 항목을 결정, 또한 향후 store를 subscribe하여 상태가 변경되었는지 알수 있다

- 업데이트 시

1. 사용자가 버튼을 클릭하는 것 과 같이 어떤일이 발생시
2. 앱 코드는 `dispatch({type : 'counter/increment'})`와 같이 Redux store에 작업을 전달
3. store는 이전 `state`와 현재로 reducer 함수를 다시 실행하고 `action` return 값을 새 값으로 저장
4. store는 subscribe된 UI의 모든 부분에 store가 업데이트 되었음을 알린다
5. store의 데이터가 필요한 각 UI 구성 요소는 필요한 state 부분이 변경되었는지 확인
6. 데이터가 변경된 각 구성 요소는 새 데이터로 강제로 다시 rendering되어 화면에 표시된 내용을 업데이트

> Redux 스토어 생성

- `configureStore` Redux Toolkit의 기능을 사용하여 생성 인수를 configureStore로 전달
- `features/counter/counterSclice.js` 카운터 논리에 대한 reducer 기능을 내보

> useSelector

- useSelector hook은 컴포넌트가 Redux 저장소 상태에서 필요한 데이터 조각을 추출할 수 있도록 한다

> useDispatch

- useDispatch hook은 저장소 자체에 액세스할 수 없기 대문에 dispatch 메서드를 통해 액세스

- React + Redux 앱에서 전역 상태는 Redux 스토어에 있어야 하고 로컬 상태는 React 구성 요소에 있어야 한다

## Redux Structure

<img src="https://user-images.githubusercontent.com/41010744/127104640-c494cab2-7a5a-494a-a9f4-c9cf34b67af1.png">
