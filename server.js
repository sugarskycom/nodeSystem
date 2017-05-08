/**
 * Created by Administrator on 2017/5/7.
 */
let http = require('http');
let fs = require('fs');
let url = require('url');
let mime = require('mime');
let books = [{id:1,bookName:'Vue',bookPrice:'30'}];
/*http是内置模块，用来创建服务的。服务：固定ip，要有一个特定的端口号*/

let server = http.createServer(function (request,response) {
    //当请求到来时会执行此callback.request代表的是客户端，response代表服务端。
    //request.url是包括？后面的参数，我们判断只想通过？前面的路径来判断响应的路径
    let pathname = url.parse(request.url,true).pathname;
    let query = url.parse(request.url,true).query;
    if(pathname === '/'){
        response.setHeader('Content-Type','text/html;charset=utf-8');
        fs.createReadStream('./index.html').pipe(response);
    }
    /*
    * 可以在这里写动态逻辑
    * */
    else if(pathname == '/book'){//客户端发送的路径只要是'/book'都在这里操作
        //对请求的不同方法进行操作req.method 请求方法默认大写
        switch (request.method){
            case 'GET'://获取数据
                if(query.id){//获取一条

                }else{//获取多条
                    response.end(JSON.stringify(books));
                }
                break;
            case 'POST'://增加数据
                let str = '';
                request.on('data',function (data) {
                   str += data;
                });
                request.on('end',function () {
                    let book = JSON.parse(str);
                    book.id = books.length ? books[books.length-1].id + 1 : 1;
                    books.push(book);
                    response.end(JSON.stringify(books));
                });
                break;
            case 'DELETE'://删除数据
                let id = query.id;
                books = books.filter(item=>item.id!=id);//url获取的id是字符串类型
                response.end(JSON.stringify(books));
                break;
            case 'PUT'://修改数据
                {
                    let id = query.id;
                    let str = '';
                    request.on('data',function (data) {
                        str += data;
                    });
                    request.on('end',function () {
                        let book = JSON.parse(str);
                        books = books.map(item=>{
                            if(item.id == id){console.log(book);return book;}
                            return item;
                        });
                        response.end(JSON.stringify(books));
                    });
                }
                break;
        }
    }

    else{//返回静态文件，例如css，js
        fs.exists('.'+pathname,function (flag) {//判断文件是否存在，flag返回true为存在，false表示不存在
            if(flag){
                response.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf8');
                fs.createReadStream('.'+pathname).pipe(response);
            }else{
                response.statusCode = 404;
                response.end('Not Found!');
            }
        })
    }
});
server.listen(3000,function () {
    console.log(('Server is ready!'));
});