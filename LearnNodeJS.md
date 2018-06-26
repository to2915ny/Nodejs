# Lets Learn NodeJS!!!

Node는 크롬의 V8엔진을 사용하는 Runtime Environment이다.
기본적으로 Javascript에서 사용되는 document. function들과는다르게 file을 읽거나 포트에서 request들을 받을수있다.

**Framework나 프로그래밍언어** 가아니다!!!

```
fs.readfile()
http.createServer()
```
* Non-Blocking / Asynchronous

비유를 해보자면 레스토랑에 웨이터가 있고 테이블이 두개가 있다고 하자.
웨이터는 첫번째 테이블에서 주문을받은뒤 주방으로 주문을 보내고 바로 두번째 테이블로 이동해서 주문을 받는다.
노드에서는 웨이터가 *Single Thread* 라고 생각하고 테이블은 Request라고 생각해보자.
Thread는 여러 Request들을 처리한다.

* Blocking / Synchronous

이번엔 웨이터가 첫번째 테이블에서 주문을 받은뒤 음식이 나오기전까지 기다린다. 음식이 나오기전까지 다른 주문을 받지않는다.
그러므로 한개의 Thread가 아닌 여러 Thread가 Request을 처리하는데 필요할것이다. 하지만 Thread의 갯수는 정해져있고 Request가
Thread의 갯수를 넘어가면 몇몇 Request들은 기다려야 할것이다.

Node는 기본적으로 Asynchronous architecture를 쓴다.

Single Thread는 Request가 들어오면 Database에 데이터를 물어본다(Query) Database가 데이터를 찾기전에 Thread 이미 다른 Request를
받아서 처리를 한다. 이때 Event Queue라는 Queue를 Thread는 계속 감시하는데, Database에서 처리된 데이터가 queue에 들어오면 해당 Request에
다시 보내준다. 이런 방식은 Input and Output (I/O)형식에 Application에 아주 적합하고 하드웨어의 효율성이 좋다. 하지만 CPU 연산이 필요한 프로그램은
노드로 만드는것이 아주 아주 안좋다.
<hr/>

## Enough With Theory....Now the Real Stuff

우선 NodeJS를 설치 해야되는데, Terminal이나 CMD에 node --version을 쳐보자. node가없거나 최신 버젼이 아니면 <https://nodejs.org>에 들어가서
다운을 받아주자. 설치를 끝내고 다시 node --version을 치면 Node가 정상적으로 최신버전으로 설치된것을 볼수있다.

이제 첫번째 앱을 한번 만들어보자. Repository에 있는 firstApp.js를 참조.

실행시킬려면 node _\_filename_ 을 terminal 에서 실행시켜주면된다.

#### 모듈에 대해서

모듈은 자바의 클래스같은 개념이다. 모듈에선언된 변수들과 function들은 private으로 선언되어있다.

```
var url = "http://log.io"

function log(message){
  //Send an HTTP Request
  console.log(message);
}
module.exports.log = log;
module.exports.endPoint = url;
```
여기서 다른 모듈에서 쓰고싶은 function이나 변수가 있다면 위에와 같이 export를 해줘야된다.
그러면 모듈을 써서 logger라는 간단한 모듈을 만들어서 모듈들끼리 어떻게 interact하는지 알아보자.

```
var record = require("./logger");
record.log("This is the module")
```
firstApp.js에 위에 있는 코드를 추가했다.
logger 라는 변수를 선언한뒤 require function을 썼다. 이 require function을 써서 부르고 싶은 모듈을 loading한다. 지금은 logger.js를 부르고싶으니까, 저렇게쓴다. 그리고 function들이 실제로 실행되는 모듈을 main module이라고 한다. firstApp.js는 우리의 main module 이다.

logger.js에 있는 log function을 export했기 때문에 main module에서 log function을 쓸수있다.
다시 node firstApp.js을 실행시키면 This is the module이라는 log message가 나온다.

##### **꿀팁**

error가 생기면 *jshint* 를 써보자. *jshint* 를 쓰면 debugging 하기 쉬워진다.

<hr/>

<https://nodejs.org/dist/latest-v8.x/docs/api/> 여기에 이미 built-in module들이 엄청나게 많다. 이걸 참조해서 쓰자.

예를 들어서 path라는 built-in module이있다. 한번 써보도록 하자.

```
const line = require("path");

var file = line.parse(__filename);

console.log(file);
```
아까전과 마찬가지로 line이라는 constant에 path라는 built-in module을 loading했다. built-in 이기때문에 path를 지정하지않는다. path module에는 parse라는 function이있다. file이라는 변수에 넣고 logging을 해보자.

```
{ root: '/',
  dir: '/Users/seungyonglee/Documents/git/Nodejs',
  base: 'firstApp.js',
  ext: '.js',
  name: 'firstApp' }
```
이런식의 json 형태로 결과값을 parsing 해준다.

#### File 모듈

```
const fs = require("fs");
```
fs를 loading 한다.

fs module에는 Synchronous와 Asynchronous function들이있다. Synchronous function들이 코드를 쓰기엔 간편하지만, Asynchronous를쓰는것을 일반화하자.

우선 Synchronous 방법.
fs module에 있는데 readdirSync function을 예로 써보자.
```
const fs = require("fs");
var files = fs.readdirSync("./");
console.log(files);
```
이런식으로 매욱 간단하게 현재 다이렉토리를 출력해준다.

Asynchronous 방법

readdir function
```
const fs = require("fs");
fs.readdir("./",function(err,files){

  if(err)
  console.log("Error",err);
  else
  console.log("Result",files);
});
```
위와같이 Asynchronous는 Exception handling을 해줘야된다. argument에 먼저 다이렉토리의 path 그다음 result또는 err를 출력하는 function을 추가한다.
