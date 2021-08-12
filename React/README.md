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
<td><img src="https://user-images.githubusercontent.com/41010744/128970585-26359984-5ce6-47b3-80b0-acb43b4f1ba2.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128970661-7eeb590d-078f-46f3-9248-9d5edbc1bc81.png"></td>
</tr>
</table>

## 8주차 : 기능 구현 (채팅방 리스트/관리 - 공개(public), 1:1(private) , 공개 채팅방 생성)

> 7주차에서 설명한 redux , api, route 지정 같은 중복 작업을 제외한 구현하면서 어려웠던 요소에 대해서 설명하겠습니다.

1. firebase 참조하는 영역이 여러개 있고 두개를 참조하여 데이터를 변환시키고 redux에 데이터 저장

- firebase 내 데이터가 아래와 같이 저장되어 있어 firebase.ref(채팅방) 으로만 데이터 모두를 출력할 수 없고 채팅방 데이터에 접근해서 둘의 데이터를 원하는 형태로 가져와야 했습니다.

```
| 채팅방
    | 공개
        | room key
            | 메시지 key
                | message : 안녕하세요
                | timestamp : 161390732102
                | userId : abc123cde456
    | 1:1 채팅
| 채팅방 데이터
    | 공개
        | room key
            | room key
            | 방이름
            | ...
            | 사용자
                | photoURL  : ...
                | userId    : abc123cde456
                | username  : 설경원
```

- 해당 작업은 애초에 api에서 데이터를 가져올 때 두 개의 reference(채팅방, 채팅방 데이터)를 가져오고 id를 비교해서 데이터를 원하는 형태로 만들어 redux에서 참조할 수 있도록 하였습니다.

- 또한, reference(채팅방 데이터)에는 사용자 이름과 id가 존재하지만 메시지가 여러개 있어도 하나밖에 존재하지 않아 userList를 따로 만들어 view에 전달하는 작업을 하였습니다.

- **1번** 항목을 처리하는 데 있어 가장 어려웠던 것은 로직상의 어려움이라기 보다는 아직 redux 구조에 익숙하지 않고 여러개의 reference를 참조해 원하는 데이터로 변환하는 것이 익숙치 않아 어려웠던 것 같습니다. 아래는 로직 일부입니다.

```jsx
/* api */
const chatList = await fetchPublicChatApi();

const publicMessage = [];

await db
  .ref("채팅방 데이터")
  .get()
  .then((snapshot) => {
    let chat = snapshot.val();

    for (const [key, value] of Object.entries(chat)) {
      Object.values(value).map((chat) => {
        chat.date = moment(chat.timestamp).format("YYYY/MM/DD");

        delete chat.timestamp;
      });

      for (let roomId in chatList) {
        if (chatList[roomId].users && chatList[roomId].id === key)
          publicMessage[key] = {
            roomName: chatList[roomId].name,
            users: chatList[roomId].users,
            message: value,
          };
      }
    }
  });

return publicMessage;

/* reducer */
function* fetchChatAsync(id) {
  const chatList = yield call(fetchPublicMessageApi);
  let chat = {};
  for (const [key, value] of Object.entries(chatList)) {
    if (key === id.id) chat = value;
  }

  let userList = new Map();
  for (let userId in chat.message) {
    for (let username in chat.users) {
      if (chat.message[userId].userId === username)
        userList.set(username, [
          chat.users[username].username,
          chat.users[username].photoURL,
        ]);
    }
  }

  yield put({
    type: GET_CHAT,
    chat: chat,
    userList: userList,
  });
}
```

- 데이터만 잘 처리하고 view 부분을 넘겨주기만 하면 출력 및 관리 하는 것은 수월하게 했던 것 같습니다.

## 구현 결과 : 차례대로 채팅방 리스트(공개/1:1) , 채팅방 관리 화면(공개/1:1), 공개 채팅방 생성, GIS 적용

<table>
<tr>
<td><img src="https://user-images.githubusercontent.com/41010744/128970835-3f6c4a7a-4d38-4102-91b6-6468c40226cd.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128970956-45fa8662-a770-403c-a14f-573d91f34398.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128971034-579ee0ee-8e5b-4d7d-928a-63ad442ecee4.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128971088-228dbfb3-b36d-4d25-bc1c-b394f10864cc.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128971169-9dedabed-d742-40fb-a950-7aefcc828b12.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/129160054-da6270ca-46b0-4e03-8a0d-affb4e558d96.png"></td>
</tr>
</table>
