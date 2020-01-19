// JavaScript Document
//全局验证字符串
var username="",password="";
var password2="";
//定时器变量
var T1,t1;
//画布环境变量
 var ctx,oc;
 //延时器变量
 var timeout;
 //标记数组，存储历经元素
 var recordarray=[];
 //优化变量，调节动画选择
 var time_lock=0,now_id;

 //圆点鼠标移入过渡动画
 function func(e) {
	 if(judge_time_lock()){
	   var id=e.id;
	  now_id=id;
     oc = document.getElementById(id);
	if(!judgeelement_exist(id)){
    if(oc.getContext){
      ctx = oc.getContext("2d");
      //在画布上随机生成圆
      var arr = [];
      //将数组中的圆绘制到画布上
       T1=setInterval(function () {
        /*console.log(arr)*/
        ctx.clearRect(0,0,oc.width,oc.height);
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].y <= 50){
            arr.splice(i,1)
          }
          arr[i].deg+=5;
          arr[i].x = arr[i].startX + Math.sin(arr[i].deg*Math.PI/180)*arr[i].step*2 ;
          arr[i].y = arr[i].startY - ( arr[i].deg*Math.PI/180 )*arr[i].step;

        }
        //绘制图形
        for(var i=0;i<arr.length;i++){
          /*  console.log(i)*/
          ctx.save();
          ctx.fillStyle = "rgba("+arr[i].red+","+arr[i].green+","+arr[i].blue+","+arr[i].alp+")";
          ctx.beginPath();
          ctx.arc(arr[i].x,arr[i].y,arr[i].r,0,2*Math.PI);
          ctx.fill();
          ctx.restore()
        }
      },1000/60);

      //往arr数组中存放每一个随机圆的数据
      t1= setInterval(function () {
        var r = Math.random()*6+2;
        var x = Math.random()*oc.width;
        var y = oc.height - r;
        var red = Math.round(Math.random()*255);
        var green = Math.round(Math.random()*255);
        var blue = Math.round(Math.random()*255);
        var alp = 1;
        var deg = 0;
        var startX = x;
        var startY = y;
        var step = Math.random()*20+10;

        arr.push({
          x:x,
          y:y,
          r:r,
          red:red,
          green:green,
          blue:blue,
          alp:alp,
          deg:deg,
          startX:startX,
          startY:startY,
          step:step
        })
      },50);
	  //延时器
	timeout=setTimeout(function (){
        //清除画布
        clearInterval(t1);
        clearInterval(T1);

        //存储历经元素
        recordarray.push({
            x:recordarray.length,
            y:id
        });
       ctx.clearRect(0,0,oc.width,oc.height);
       move_pic(recordarray.length-1);
   },3000);
    }
	}
	 }
}

//鼠标移出清除过渡动画
  function func1(e){
    if(judge_time_lock()&&e.id==now_id){
	  var id=e.id;
	  if(!judgeelement_exist(id)){
         //	清除定时器
        clearInterval(t1);
        clearInterval(T1);
        //清除延时器
        clearTimeout(timeout);
        //清除画布
        ctx.clearRect(0,0,oc.width,oc.height);
        //clearInterval(t1);
        //clearInterval(T1);
	  }
	 }
  }

  //点击密码按钮清除画布和存储用户名密码数组recordarray
function inputPassword_2()
	
{
	clean_record();
	recordarray = [];
	
}

  //注册按钮执行函数，输入用户名且密码时切换输入邮箱页面
function goToRegister(){
  document.body.style.background ="url('img/11.jpg')";
	if(username==="")
	 {
	     alert("用户名不能为空！！！");
	 }
	 else if (password==="")
	 {
		 password = rebuild_record();
		 recordarray = [];
		 if( password==="")
		 {
		 alert("密码不能为空")
		 }
	 }
	else
	    {
	        password2 = rebuild_record();
	        if(password2==="")
	        {
	        alert("请再输入一次密码");
            clean_record();
	        inputPassword_2();
	        }
	        else if(password!=password2)
	        {
	            alert("两次密码输入不一致,请重新输入");
                inputPassword_2();
	        }
	        else if(password===password2)
	        {
	            showAndHidden2();
	        }
	    }
}

 $(document).ready(function(){
     //登录按钮函数，点击进行登录事件
  $("#b1").click(function(){
      password = rebuild_record();
        if(username===""||password ==="")
        {
          alert("用户名和密码不能为空！！！");
          //console.log(username+"%%%"+password);
        }
        else
            {
         showAndHidden1();
         $.ajax({
             url: newDomainname + "indexlogin",
             type: 'POST',
             dataType: 'json',
             //async: false,
             data: {
                 username: username,
                 password: password
             },
             success: function (data) {
                 if (data.login == true) {
                     //console.log(data);
                     $.cookie(data.cookiename, data.cookievalue, {expires: data.cookietime, path: '/'});
                     alert('登陆成功，将在几秒钟后自动跳转！');
                     setTimeout(function () {
                         window.location.replace("learn_content.html")
                     }, 1500)
                 }
                 else {
                     console.log(data);
                     console.log(newDomainname + "indexlogin");
                     alert('登陆失败，输入用户名密码不正确，请重新登陆');
                     window.location.replace("hello.html");
                 }
             },
             error: function (data) {
                 if (data) {
                     alert('error');
                 }
                 console.log(data);
                 //window.open("http://127.0.0.1:8090/pages/index.html",'_self')
             }
         })
     }
  });
});

//选择移动图片
function selectimg(a){
	 switch(a) {
         case 0:
            return "img/1.jpg";
            break;
         case 1:
            return "img/2.jpg";
            break;
         case 2:
             return "img/3.jpg";
             break;
         case 3:
             return "img/4.jpg";
             break;
         case 4:
             return "img/5.jpg";
             break;
         case 5:
             return "img/6.jpg";
             break;
         case 6:
             return "img/7.jpg";
             break;
         case 7:
             return "img/8.jpg";
             break;
         case 8:
             return "img/9.jpg";
             break;
	 }
}
 //
 function judgeelement_exist(a){
	 var i=0;
	 for(i=0;i<recordarray.length;i++){
		 if(a==recordarray[i].y){
			 return true;
		 }
	 }
	 return false;
 }

 //图片从下往上移动动画
 function move_pic(imgid){
	 var img=new Image();
	 img.src=selectimg(imgid);
	 var x=oc.width;
	 var y=oc.height;
	 //控制移动变量
	 var i=0;
	 //计时器序号变量
	 var timekeep;
	 timekeep=setInterval(function () {
		 //上锁
		 time_lock=1;
	if(y-i<=0){
		//解锁
		time_lock=0;
		clearInterval(timekeep);   
	}	 
	 ctx.clearRect(0,0,oc.width,oc.height);
	 ctx.drawImage(img,0,y-i,x,y);
	 i+=2;
	 
	 },10)	 
 }

 //
function sleep(numberMillis) {	
var now = new Date();	
var exitTime = now.getTime() + numberMillis;
	while (true) {		
        now = new Date();
        if (now.getTime() > exitTime)
        return;
	}
 }

//浮现div2
function showAndHidden1(){
	  var div1=document.getElementById("div1");
	  var div2=document.getElementById("div2");
	  var div3=document.getElementById("div3");
	  var register=document.getElementById("register");
	  var div5=document.getElementById("particles-js");

	  register.style.display="none";
	  div1.style.display="none";
	  div2.style.display="block";
	  div3.style.display="none";
	  div5.style.display="none";
 }

//浮现register邮箱输入页面
function showAndHidden2(){
	  var div1=document.getElementById("div1");
	  var div2=document.getElementById("div2");
	  var div3=document.getElementById("div3");
	  var register=document.getElementById("register");
	  var div5=document.getElementById("particles-js");

	  register.style.display="block";
	  div1.style.display="none";
	  div2.style.display="none";
	  div3.style.display="none";
	  div5.style.display="none";
 }

 //清除圆点上显示的数字
function clean_record(){
	var idElement,id2D;
       for(var i=0;i<recordarray.length;i++){
    	  idElement  = document.getElementById(recordarray[i].y);
    	  id2D = idElement.getContext("2d");
    	  id2D.clearRect(0,0,idElement.width,idElement.height);
       }
}

//
function rebuild_record(){
	var a="";
	for(var i=0;i<recordarray.length;i++){
		a=a+recordarray[i].x+recordarray[i].y;
	 }
	return a;
}

//点击密码按钮时执行，清除画布，储存用户名，recordarray数组清空
function func2(){
	clean_record();
	username=rebuild_record();
	recordarray = [];	
}

//数字上浮动画停止判断变量time_lock
function judge_time_lock(){
	if(time_lock == 0){
		return true;
	}
	else return false;
}

//退回按钮执行函数，recordarray数组pop,画布最后一个数字清空
function reset(){
        var a;
        a = recordarray[recordarray.length-1].y;
        recordarray.pop();
        idElement  = document.getElementById(a);
        id2D = idElement.getContext("2d");
        id2D.clearRect(0,0,idElement.width,idElement.height);
}
