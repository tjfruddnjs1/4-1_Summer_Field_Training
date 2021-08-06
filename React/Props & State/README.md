## Props & State

> `State` : 하나의 컴포넌트가 가질 수 있는 변경 가능한 데이터

- 컴포넌트를 렌더링 할 때 새로운 데이터를 생성해야 한다던지, 기존 데이터를 참고해서 새로운 데이터를 만들어야 할 때 사용 가능
- State 뿐 아니라 JSX에 변수를 넣을 때에는 중괄호 `{ }`에 담아야 한다
<hr>
<img src="https://user-images.githubusercontent.com/41010744/125877084-696f3eda-27d9-4f62-9d7a-7a8ddc2ccfe6.png">
<hr>

- handleChange 메소드 생성
- 앞으로 사용하게 될 이벤트들의 이름은 `camelCase`를 사용
- this.handleChange를 전달하는 부분에 this.handelChange()가 아닌 이유는 html 파일이 아닌 JSX 파일이기 때문에 JSX에서 html로 바뀌는 과정에서 함수가 실행 되버리기 때문
  > 결론은 state는 현재 컴포넌트 안에서 새로운 데이터를 만들어 낼 때 사용
  <hr>

> `Props` : 현재 컴포넌트 내에서 변경이 불가능한 데이터

- Props와 State 모두 하위 컴포넌트에 상속 가능
<hr>
<img src="https://user-images.githubusercontent.com/41010744/125878268-9bb8f562-9dc0-46d3-bf3a-fad595e444cb.png">
<hr>

- index.js 코드를 보면 message라는 변수를 App.js가 Props로 사용할 수 있게 전달 (상속)
- 이렇게 받은 message라는 문자열을 App.js에서는 아래와 같이 사용 가능
<hr>
<img src="https://user-images.githubusercontent.com/41010744/125878425-b6dbc097-1144-489d-9de5-c077407b71c9.png">
<hr>

- App.js에서 state를 사용하듯이 사용 하지만 state 처럼 변경은 불 가능
- 하지만 App.js에 다른 컴포넌트를 상속시켜 props를 변경 가능
- 위의 코드에 아래 코드를 추가 (InsideApp 컴포넌트)
<hr>
<img src="https://user-images.githubusercontent.com/41010744/125878591-6e3c3a9a-fc40-4e97-a196-bf055c4724b9.png">
<hr>

- App.js에서 InsigeApp 컴포넌트를 받아오고, 그 때 App 컴포넌트의 state인 메소드와 count인 handleChange를 상속
- 상속시킴으로써 두 개의 버튼 중 어떤 버튼을 클릭하던지 App 컴포넌트의 state인 count가 증가하게 되어 상속받는 props인 count가 변경
- props를 직접적으로 변경이 불가능 하지만 이런식으로 상위 컴포넌트에서 state를 변경하는 메서드를 props로 끌어옴으로써 간접적으로 변경 가능

## Using the Effect Hook

> Hooks는 React 16.8 버전에 새로 추가, Hook은 클래스 컴포넌트를 작성하지 않아도 state와 같은 특징들을 사용할 수 있다.

- Effect Hook을 사용하면 함수 컴포넌트에서 side effect를 수행 가능
- componentDidMount, componentDidUpdate와 같은 방식으로 브라우저 API를 이용하여 문서 타이틀을 업데이트
- useEffect Hook을 이용해 컴포넌트가 렌더링 이후에 매번 수행
