
//simple webserver
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title,list,description){


        return `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <a href ="create">create</a> <a href = "/update?id=${title}">update</a>
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html>
        `;
}
function templateList(filelist){
  var list = '<ul>';
  var i =0;
  while(i<filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i=i+1;
  }

  list = list+'</ul>';
  return list;

}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    //url을 parsing해주는 method 여기선 query만 파싱해준다.

    var pathName = url.parse(_url, true).pathname;


    /*if(_url == '/'){ //url이 root이면
      title = 'Welcome';//title은 Welcome을 표시한다.
    }
    if(_url == '/favicon.ico'){
      return response.writeHead(404);//안됐다는 신호
    }
*/
  //오류페이지 출력하는걸 직접 만들어보자.

  if(pathName === '/'){
    if(queryData.id === undefined){
      fs.readdir('data',function(err,filelist){//directory를 읽는다
        console.log(filelist);//다이렉토리안에있는 리스트를 출력시켜본다.
        //본문을 바꾸기위해서 텍스트만 가지고있는 파일을 불러온다.
        var title = 'Welcome';
        var description = 'Hello Node.js';
        var list = templateList(filelist);
        var template = templateHTML(title, list, description);
        /*<ul>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>*/ //이걸빼고 다이렉토리읽은리스트로 해보자.
        response.writeHead(200);//기계와 기계사이의 약속된언어 200은 잘됐다라는뜻
        response.end(template);//template을 보여준다.

      });



    }
    else {
      fs.readdir('data',function(err,filelist){//directory를 읽는다
        console.log(filelist);//다이렉토리안에있는 리스트를 출력시켜본다.
        //본문을 바꾸기위해서 텍스트만 가지고있는 파일을 불러온다.

        var list = templateList(filelist);
      fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
        //본문을 바꾸기위해서 텍스트만 가지고있는 파일을 불러온다.

        var title = queryData.id;//커리의 id만 저장해준다.
        var template = templateHTML(title, list, description);
        response.writeHead(200);//기계와 기계사이의 약속된언어 200은 잘됐다라는뜻
        response.end(template);//template을 보여준다.
      });
    });
    }
    //동적인 웹페이지

}  else if(pathName === '/create'){ //if pathname is /create then

  fs.readdir('data',function(err,filelist){//directory를 읽는다
    console.log(filelist);//다이렉토리안에있는 리스트를 출력시켜본다.
    //본문을 바꾸기위해서 텍스트만 가지고있는 파일을 불러온다.
    var title = 'Web';

    var list = templateList(filelist);
    var template = templateHTML(title, list, `
      <form action="http://localhost:3000/process_create" method="post">
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
      <textarea name="description" placeholder="description"></textarea>

    </p>
    <p>
      <input type="submit">
    </p>

    </form>
    `); //use form to make an input form because the form has post method
    //it will hide the name of the input

    response.writeHead(200);//기계와 기계사이의 약속된언어 200은 잘됐다라는뜻
    response.end(template);//template을 보여준다.

  });



}
//글을 입력 + url을 만들어서 페이지로 리다이렉션한다.
else if(pathName === '/process_create'){
  var body='';
  request.on('data',function(data){
    body=body+data;


  });
  request.on('end',function(){
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description,'utf8',function(err){
      response.writeHead(302,{Location: `/?id=${title}`});
      //기계와 기계사이의 약속된언어 302는 일시적으로 여기로 리다이렉션해라는 뜻
      response.end('success');

    });
  });



}else if(pathName === '/update'){
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(template);
        });
      });
    } else if(pathName === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });

  }else{
    response.writeHead(404);
    response.end('Not found');
  }
});
    //console.log(__dirname + url);//document.write와 다르게 콘솔에 값을 출력한다.
    //response.end(fs.readFileSync(__dirname + url));
    //file을 읽어서 유저에게 보여줘라
    //response.end('This is what it shows to the user : ' + url);



app.listen(3000);

//template 형식 변수값을 출력할땐 ${i} 이런식으로 표현한다.

/*
var fs = require('fs');
fs.readFile('sample.txt', 'utf8', function(err, data){
  console.log(data);
});
*/
//File을 읽는 메소드
