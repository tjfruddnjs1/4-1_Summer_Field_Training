# Basic

## 특징

1. JSX 문법 : JS 안에 HTML 문법을 사용해 view를 구성
2. Component 기반 : 기존 웹 페이지 작성할 때 처럼 하나의 HTML 코드를 집어넣는 것이 아닌 `여러 부분을 분할해서 코드의 재사용성과 유지보수성을 증가`
3. Virtual DOM : 실제 DOM을 직접 변경할 수는 있지만, 작업이 힘들기 대문에 가상 돔에서 미리 최적화를 해준다는 것

## 문법

1. `App.js`
<hr>
<img src="https://user-images.githubusercontent.com/41010744/125875862-91fc36f4-bc14-49a1-a33f-66d712e91b0a.png">
<hr>

- 리액트, 리액트 컴포넌트를 불러와 App 클래스를 만드는데 그 클래스는 리액트 컴포넌트를 상속 받는다
- 상속받은 리액트 컴포넌트 메소드 중, render() 메소드를 활용해서 html 코드를 작성해 return
- 이렇게 작성된 리액트 코드를 export

2. `index.js`
<hr>
<img src="https://user-images.githubusercontent.com/41010744/125875847-be37d7ae-e5d0-49f8-883b-1114eff96a7a.png">
<hr>

- App을 불러와 사용할 때에 html 코드를 <(App)/> 형태로 사용하는 것을 볼 수 있는데 모든 리액트 파일들은 전부 html 코드 처럼 사용 가능하다
- html 코드를 여러 개의 리액트 파일로 분할해서 작업을 할 수 가 있다는 것
