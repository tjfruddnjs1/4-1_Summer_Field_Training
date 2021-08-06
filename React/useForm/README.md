## useForm

- form은 사용자로부터 데이터를 입력 받기 위해 웹,애플리케이션에서 필수적인 요소
- React Hook을 이용해 깔끔한 양식 UI를 구현하는 방법

> 상태 관리 코드 분리하기

- 기본적으로 하나의 <form/>에 여러개의 <input/>, <select/>, <textarea/>로 구성
- 복잡한 상태 관리를 코드를 분리하기 위해 HOC(High Order Component)나 Render Prop이 많이 사용되었지만 결국 추가적인 컴포넌트를 필요로 하기 때문에 JSX가 읽기 어려워진다는 단점
- 하지만 리액트 훅(React Hook)이 등장한 이후 컴포넌트가 아닌 함수로 분리할 수 있어 양식 컴포넌트를 구현하는 것이 훨씬 간편

> Hook 적용 전 양식 컴포넌트 , [LoginForm.jsx]()

- 로그인 폼에 대한 React 컴포넌트 작성
- 입력값의 상태 관리와 이벤트 처리를 위한 코드가 상당히 많은 부분을 차지

> React Gook 선언

- `useForm()` 커스텀 React Hook을 작성

```js
function useForm({ initialValues, onSubmit, validate }) {
  // 여기에 코드 작성
}

export default useForm;
```

> 상태 관리

- 양식과 관련된 상태 관리를 위해 React의 내장 Hook인 useState()를 사용
- 모든 입력값과 오류 메시지 그리고 제출 처리 중 여부를 저장할 상태 변수와 변경 함수를 정의

```js
import { useState } from "react";

function useForm({ initialValues, onSubmit, validate }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  return {
    values,
    errors,
    submitting,
  };
}
```

> 변경 이벤트 처리

- 양식 상의 모든 입력란에서 발생하는 변경(change) 이벤트를 처리할 수 있는 범용 함수를 작성
- 이 Hook을 사용하는 컴포넌트에서 각 입력란에 이 이벤트 핸들러를 설정할 수 있도록 리턴

```js
function useForm({ initialValues, onSubmit, validate }) {
  // ... 생략 ...

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  return {
    values,
    errors,
    submitting,
    handleChange,
  };
}
```

> 제출 이벤트 처리

- 마지막으로 양식에서 발생하는 제출(submit) 이벤트를 처리할 수 있는 함수를 작성
- React의 내장 Hook인 useEffect()을 사용해 에러가 없을 때만 인자로 넘어온 입력 값을 처리하는 로직 실행
- 이 Hook을 사용하는 컴포넌트에서 제출 버튼에 이 이벤트 핸들러를 설정할 수 있도록 리턴

```js
import { useEffect, useState } from "react";

function useForm({ initialValues, onSubmit, validate }) {
  // ... 생략 ...

  const handleSubmit = async (event) => {
    setSubmitting(true);
    event.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setErrors(validate(values));
  };

  useEffect(() => {
    if (submitting) {
      if (Object.keys(errors).length === 0) {
        onSubmit(values);
      }
      setSubmitting(false);
    }
  }, [errors]);

  return {
    values,
    errors,
    submitting,
    handleChange,
    handleSubmit,
  };
}
```

> 완성된 Hook

- 작성한 useForm() Hook 함수 전체 코드
- [useForm.jsx]()

> Hook 적용 후 양식 컴포넌트

- 작성한 훅을 양식 컴포넌트에 적용
- [LoginFormUsingUseForm.jsx]()

> 출처 : https://www.daleseo.com/react-forms-with-hooks/
