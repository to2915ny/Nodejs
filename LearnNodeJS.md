#Lets Learn NodeJS!!!

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

##Enough With Theory....Now the Real Stuff

우선 NodeJS를 설치 해야되는데, Terminal이나 CMD에 node --version을 쳐보자. node가없거나 최신 버젼이 아니면 <https://nodejs.org>에 들어가서
다운을 받아주자. 설치를 끝내고 다시 node --version을 치면 Node가 정상적으로 최신버전으로 설치된것을 볼수있다.

이제 첫번째 앱을 한번 만들어보자. Repository에 있는 firstApp.js를 참조.

실행시킬려면 node _file name_ 을 terminal 에서 실해시켜주면된다.
