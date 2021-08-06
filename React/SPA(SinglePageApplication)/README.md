## SPA (Single Page Application)

- 1개의 페이지로 이루어진 어플리케이션

> 전통적인 웹 페이지

<img src="https://user-images.githubusercontent.com/41010744/127790545-f92dc090-9d72-45f1-a75e-c0b0d9997e79.png">

- 다른 페이지 이동할 때마다 새로운 html을 받아와 서버에 리소스를 전달 받아 해석 후 화면 보여줌 → 성능상의 문제 발생 (비효율적)

> React (SPA)

- React → view 렌더링을 사용자의 브라우저가 담당하고 어플리케이션을 브라우저에 불러와 실행시킨 후 사용자와의 인터랙션이 발생하면 필요 부분만 자바스크립트를 이용해 업데이트
- 새로운 데이터가 필요하다면 서버 API를 호출하여 필요한 데이터만 새로 불러와 어플리케이션에서 사용
- Create React App(CRA)에는 Routing을 위한 로직이 들어있지 않기 때문에 가장 인기 있는 routing solution인 **react-router**를 추가해서 routing을 구현

```js
npm install react-router-dom --save

/* react-router를 사용하기 위해서는 CRA로 만든 앱에 src/App.js에서 대신에 routing을 설정한 컴포넌트로 대치해야 한다. */
ReactDOM.render(<Routes />, document.getElementById('root'));
```

> Router Component 구현 예시

```js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={Signup} />
        </Switch>
      </Router>
    );
  }
}
export default Routes;
```

> Route 이동

1. Link 컴포넌트를 사용 : [link.jsx]()

- react-router-dom에서 제공하는 Link 컴포넌트는 dom에서 <a>로 변환

2. withRouter HOC로 구현 : [withRouter.jsx]()

- Link를 사용하지 않고 요소에 onClick 이벤트를 달아 이동하고 싶은 곳으로 넘기는 방법
- history의 push 메서드에 이동할 path를 인자로 넘겨주면, 해당 routes로 이동
- props에 route 정보 (history)를 받으려면 export 하는 class에 withRouter로 감싸주어야 한다
- 이렇게 withRouter 같이 해당 컴포넌트를 감싸주는 것을 High-Order Component(이하 HOC)라고 한다 → HOC는 `컴포넌트를 인자로 받고 컴포넌트를 return 하는 함수`
