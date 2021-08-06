# Java Spring

## 4주차 : 스프링 개발 환경 세팅 및 폴더 구조화

> 이후 firebase와의 연동을 수월하게 하기 위해 회의 후 React로 넘어가지만 넘어가기 이전까지의 구현 내용을 정리하여 보겠습니다.

- 먼저 resources/application.yml 폴더 내에서 thymleaf 설정 및 database 연결을 하였습니다.
- 이후 통합을 위해 같은 database url 및 id/password를 사용하였습니다.

```
ITZ-ADMIN
|   .idea
|   .mvn
|   src
    | main
        | java
            | ...
                | config
                | controller
                | domain
                | dto
                | exception
                | repository
                | service
                | util
                ServeletInitializer
                itzAdminApplication
        | resources
            | static
                | css
                | fonts
                | js
                | ...
            | templates
                | chat
                | customer
                | fragments
                    |   footer.html
                    |   header.html
                    |   ...
                | index.html
                | ...
        | application.yml
        | ...
```

- 먼저 프로젝트를 구조화 하였고 각 폴더에 대한 간단한 설명을 해보겠습니다.

1. config : MVC, Spring Security 설정
2. controller : @(애너테이션)을 이용하여 REST API를 URL Mapping
3. domain : DataBase table Column 설정 후 매칭할 class (Entity) → JPA와 함께 사용

- domain 로직만 가지고 있어야하며 presentattion logic을 가지고 있어서는 안됨
  <img src="https://user-images.githubusercontent.com/41010744/128440108-e1d75aeb-24d9-4923-96f0-13d2a5f9c2d1.png">

4. dto : 각 계층간 데이터 교환을 위한 객체 → domain 컬럼이 너무 많을 때 필요 정보만 주고 받기 위한 class

5. exception : 이후 처리할 에외처리를 폴더로 분리하여 따로 관리하기 위한
6. repository : JpaRepository를 상속받아 database와 연결 → 해당 클래스를 객체처럼 사용하여 database와 통신
7. service : controller와 repository간의 연결을 담당하고 database 처리를 함수로 구현
8. util : constant, springSecurity 가 존재하며 static final로 선언되어 필요 부분에 사용
9. resources/static : 재사용되는 css, fonts, js 등의 파일들이 존재하며 이후 templates에서 사용
10. resources/templates : view 부분을 담당하는 html 파일들이 존재하며 thymeleaf 문법을 이용하여 이후 서버 정보를 가져옴 → node의 ejs와 유사
11. application.yml : 라이브러리에서 제공하는 변수들을 설정할수 있고 외부에서 보여지면 안되는 정보들이 담겨있고 프로젝트에서 사용한 설정은 thymeleaf, database , jpa, mvc, devtools 등이 있습니다. → node의 .env 파일과 유사

## 5주차 : 관리자 로그인/회원가입 , 관리자 정보 CRUD 기능 구현

> 이후 firebase와의 연동을 수월하게 하기 위해 회의 후 React로 넘어가지만 넘어가기 이전까지의 구현 내용을 정리하여 보겠습니다.

- 먼저 기능 구현을 위해서 수행했던 작업을 순차적으로 설명해보겠습니다.

> 로그인/회원가입

0. template을 먼저 정하여 fragments 폴더 내에 header, footer, top, sidebar 등을 분리하고 경로가 개발 환경에 따라 달라질 수 있기 때문에 thymeleaf 문법을 이용하여 웹 어플리케이션 컨텍스트 경로를 기준으로 재 생성

1. repository(UserRepository), domian(User) 선언 후 Maria DB와의 연동

- resporitory → extends JpaRepository<> , @Repository 사용
- domain → @Getter , @Setter, @Entity, @NoArgsConstructor, @Table 사용

2. controller(AuthController) 내에서 로그인, 회원가입 화면과 url mapping 및 post 요청

- controller → @Controller, @Requestmapping, @GetMapping, @PostMapping 사용
- 이 단계에서는 회원 가입 요청시 Post 요청을 통해 service(UserService)의 save 함수를 통해 user 정보를 form name에 맞게 저장 (아직 까지는 spring security , 비밀번호 암호화 적용 X)

3. 위의 단계까지 하고 나서 BCryptPasswordEncoder와 SpringSecurity를 사용하여 비밀번호 암호화 및 권한 설정을 하였습니다.

4. 비밀번호 암호화는 Spring에서 객체만 생성한다면 encode 및 compare를 제공하였기 때문에 쉽게 구현할 수 있었고 SpringSecuirty를 진행하는데 있어 먼저 domain(User)에 UserDetails를 implements한 후 @Override 함수 (ex. getAuthorities, getUsername/getPassword ..등)를 사용하였습니다.

5. config/SecurityConfig 내에서 사용자 ROLE에 따라 페이지 접근 권한을 부여하고 상세 기능(로그인 성공시, 실패시, 세션 정보 등)을 설정할 수 있었습니다.

- 권한 설정 中 일부

```
  @Override
  public void configure(WebSecurity web) {
    web.ignoring().antMatchers("/static/**", "/templates/fragments/**", "/error");
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
        .antMatchers("/auth/register", SpringSecurity.LOGIN_PROCESS_URL).permitAll()
        .antMatchers(SpringSecurity.LOGIN_URL).anonymous()
        .antMatchers("/user/**").hasRole("USER")
        .anyRequest().authenticated()
        .and()
        .formLogin()
        .loginPage(SpringSecurity.LOGIN_URL)
        .loginProcessingUrl(SpringSecurity.LOGIN_PROCESS_URL)
        .defaultSuccessUrl(SpringSecurity.LOGIN_SUCCESS_URL) 리다이렉트 주소
        .and()
        .logout()
        .logoutUrl(SpringSecurity.LOGOUT_URL)
        .logoutSuccessUrl(SpringSecurity.LOGIN_URL)
        .logoutRequestMatcher(new AntPathRequestMatcher(SpringSecurity.LOGOUT_URL))
        .invalidateHttpSession(true)
    ;
  }
```

> 관리자 정보 CRUD

1. Controller(UserController) 내에서 UserService 선언 후 , GET/POST URL Mapping

- URL Mapping

```
  @NonNull
  private final UserService userService;

  @GetMapping("/list")
  public String list(Model model) {
    List<User> userList = userService.getUserList();
    model.addAttribute("userList", userList);
    return "user/list";
  }

  @GetMapping({"/edit/{id}", "/edit"})
  public String edit(@PathVariable(required = false) Long id, Model model) {
    User user = (id == null) ? new User() : userService.findById(id);
    model.addAttribute("user", user);

    return "user/edit";
  }

  @PostMapping("/save")
  public String save(@ModelAttribute("User") User user) {
    userService.save(user);
    return "redirect:/user/list";
  }

  @PostMapping(value = "/delete")
  public String delete(@RequestParam("rowCheck") List<Long> chk_value) {

    for(int i = 0; i < chk_value.size() ; i++){
      userService.delete(userService.findById(i));
    }

    return "redirect:/user/list";
  }
```

2. Service(UserService) 내에서 userRepository 선언후 , Mapping된 요청에 따른 기능 함수 구현 → User 없을시 exception 처리

- 기능 함수 구현

```
  private final UserRepository userRepository;

  @Override
  public User loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException((username)));
  }

  @Transactional
  public Long save(User user) {
    user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
    user.setRole(Role.USER);
    userRepository.save(user);

    return user.getId();
  }

  @Transactional
  public List<User> getUserList() {
    List<User> userList = userRepository.findAll();
    return userList;
  }

  @Transactional
  public User<Optional> findById(Long id) {
    return userRepository.findById(id);
  }

  @Transactional
  public void delete(User user) {
    userRepository.delete(user);
  }
```

3. Controller에서 view 페이지로 렌더링 해줄 떄의 보내주는 정보를 이용하여 thymeleaf 문법을 사용하여 사용자의 정보를 CRUD 할 수 있는 리스트 페이지를 구현하였습니다.

## 구현 결과 : 차례대로 로그인, 회원가입, database 저장 모습, 관리자 리스트

<table>
<tr>
<td><img src="https://user-images.githubusercontent.com/41010744/128444466-a3fc3ca7-8d80-41e5-87fd-56e17d5ad335.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128444843-cfcf4093-dc3d-4368-b39c-e403bb01bc5c.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128444919-954a6445-34ce-4aea-82fd-5346d87c4487.png"></td>
<td><img src="https://user-images.githubusercontent.com/41010744/128445005-25d5decd-6e92-4ae4-8a2e-fbfd108c1e77.png"></td>
</tr>
</table>

- 여기까지 Spring Security와 기본적인 Spring Boot REST 작업을 하였고 앱(RN)에서 사용자 정보 관리하는데 react를 사용하는 것이 좋다는 회의 결과로 react로 넘어가게 되었습니다.
