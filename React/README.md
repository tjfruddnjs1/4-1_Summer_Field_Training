# React

## 6주차 : React 기본 개념 공부 및 React Template 구조 확인

> 기본 템플릿을 React 기반으로 짜여진 Template을 사용하였기 때문에 Template을 이해하기 위해서는 기본 개념을 확실하게 익힐 필요가 있었습니다.

- 먼저 템플릿 내 제공하고 있는 프로젝트 구조 입니다.

```
ITZ-WEB
|   .vscode
    | .launch.json
    | settings.json
|   node_modules
|   public
    |   api
    |   ...
|   src
    | api
    | assets
        | scss
        | fonts
        | images
        | ...
|   auth
|   components
    | admin
        | edit.jsx
        | list.jsx
    | application
        | bookmark
            | index.jsx
        | chat-app
            | index.jsx
        | ...
| constant
| data
        | app_config.json
        | config.jsx
        | ...
| layout
| redux
    | admin
        |  action.jsx
        |  index.jsx
        |  reducer.jsx
    | actionTypes.jsx
    | index.jsx
| route
    | index.jsx
| sagas
    | index.jsx
| ...
| index.jsx
| index.scss
| .gitignore
| package.json
| package-lock.json
| yarn.lock
```

> React 기본 개념 공부 내용은 React 폴더 내에 폴더 이름으로 정리하였습니다.

## 7주차 : 기능 구현 (관리자 리스트 CRUD)

1. data/config.jsx , data/app_config.json 파일 내에 firebase 설정

   <img src="https://user-images.githubusercontent.com/41010744/128456918-44e2a5ad-4767-48e5-81dd-e8ba0b4c9c43.png">

- data/app_config.json : 위의 사진의 정보로 firebase 설정

```json
    "firebase" : {
        "apiKey": "",
        "authDomain":"",
        "databaseURL": "",
        "projectId": "",
        "storageBucket": "",
        "messagingSenderId": "",
        "appId":""
    },
```

- data/config.jsx : 아래와 같이 fireabse.database()를 export하고 import db할 경우 firebase를 객체처럼 사용하여 database를 관리할 수 있음

```jsx
import firebase from "firebase/app";
import "firebase/database";
import "firebase/firestore";
import "firebase/auth";

const config = require("./app_config.json");

export const firebase_app = firebase.initializeApp({
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
  databaseURL: config.firebase.databaseURL,
  projectId: config.firebase.projectId,
  storageBucket: config.firebase.storageBucket,
  messagingSenderId: config.firebase.messagingSenderId,
  appId: config.firebase.appId,
});

export const db = firebase.database();
```

2. components 폴더 내 admin/list.jsx , admin/edit.jsx 생성 & sidebar에 해당 route 접근 경로 지정

- 위 파일을 export하고 route/index.jsx 파일 에서 import 후 path를 설정하여 component 사용 → 이후 menu에 route 지정

```jsx
/* admin/list.jsx*/
const AdminList = (props) => {};

export default AdminList;

/* route/index.jsx*/
import AdminList from "../components/admin/list";

export const routes = {
    { path: "/app/admin/list", Component: AdminList },
};

/* sidebar/menu.jsx */
Items: [
      {
        title: "관리자 리스트",
        icon: Server,
        badge: "badge badge-danger",
        type: "link",
        active: false,
        path: `${process.env.PUBLIC_URL}/app/admin/list`,
      },
];

```

3. 관리자 정보를 전역 상태로 가져올 수 있도록 redux 설정

- api/index.jsx 내에서 firebase 정보에 접근

```jsx
import { db } from "../data/config";

export const fetchPublicChatApi = async () => {
  let publicChatList = [];

  await db
    .ref("채팅방 이름")
    .child("해당 ref 자식 이름")
    .get()
    .then((snapshot) => {
      const chat = snapshot.val();

      for (let id in chat) {
        publicChatList.push({ ...chat[id], id });
      }
    });

  return publicChatList;
};
```

- redux/admin 폴더내 action.jsx, index.jsx, reducer.jsx 파일 생성 & actionType, redux-saga 설정

```jsx
/* actionType.jsx : 사용 action의 이름을 중복되지 않게 지정 */
export const TYPE_NAME = "TYPE_NAME";

/* action.jsx : 지정 type에 대한 실제 compoent에서 호출가능 형태의 함수 지정(payload:인자) */

export const getType = (item) => ({
  type: TYPE_NAME,
  payload: { item },
});

/* reducer.jsx : Type에 대한 수행 로직 작성 (기능 작성 부분) */
const initial_state = {
  item : [],
};

export default (state = initial_state, action) => {
  switch (action.type) {
    case TYPE_NAME:
      return { ...state, item : action.item };
  }
};

/* index.jsx : view와 접근 하는 부분 (결과를 보여주는 부분) */
function* fetchAdminListAsyn(){
  const item = yield call(fetchAdminListApi);

  yield put({ type: TYPE_NAME, item : item });
}

export function* watchAdminList() {
  yield takeLatest(TYPE_NAME , fetchAdminListAsyn);
}

/* combineReducers 함수를 통해 reducer를 통합하고 state를 관리 */
import Admin from "./admin/reducer";

const reducers = combineReducers({
    Admin
});

/* 마지막으로 yield all()를 통해 rootSagas 지정 */
import { watchAdminList } from "../redux/admin";
export default function* rootSagas() {
    yield all([
        watchAdminList()
    ])
}
```

4. view 부분에서는 template에서 제공하는 형식에 맞게 firebase data를 알맞는 형태로 바꿔 대입

- redux 처리한 데이터를 사용할 때는 useDispatch, useSelector를 이용

```jsx
/*components/admin/list.jsx*/
/* redux 사용 */
const dispatch = useDispatch();

useEffect(() => {
  dispatch({ type: TYPE_NAME });
  // eslint-disable-next-line
}, [dispatch]);
```

- router 처리는 withRouter(react-router-dom)와 history 키워드를 이용

```jsx
/* router 처리 */
const handleRouter = (id) => {
  props.history.push(`${process.env.PUBLIC_URL}/app/admin/edit/${id}`);
};
```

- redux에서 선언한 firebase 객체를 통해 view부분에서 사용자 요청에 따른 필요한 함수를 호출하여 관리자 정보를 CRUD 할 수 있는 관리자 페이지를 만들었습니다.

## 구현 결과 : 차례대로 관리자 리스트, 관리자 정보 편집 페이지

<table>
<tr>
<td><img src="https://user-images.githubusercontent.com/41010744/128460017-41d84e5f-2446-41b1-887a-a31cb9876db2.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128460185-e34940af-cf83-4845-ad4a-8652da565035.png"></td>
</tr>
</table>

## 8주차 :
