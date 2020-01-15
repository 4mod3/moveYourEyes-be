/**
 * 
 主界面js控制
 */
//图片存储对象
var picture_path_array=[];
var picture_img_array=new Array();

//socket连接对象
//请求时间戳数组
var req_time_stamps = new Array(3);
var time_clock = new Date();
var	graph_data = new Object();
var source_txt = new Object();
var send_action_status = true;
var myChart;
var video_on_hand;
var source_id_now;
//记录页面打开状态，防止页面刷新时仍然执行页面关闭函数
var windowstatus=true;

//创建websocket_manager
//定义socket_exist的get和set函数
var ws_manager={
	ws: {},
	socket_exist: false
};
ws_manager = Object.defineProperty(ws_manager, 'socket_exist',{
		get: function(){
			console.log('socket_exist::get:'+socket_exist);
			return socket_exist;
		},
		set: function(value){
			socket_exist = value;
			console.log("socket_exist::set:"+ socket_exist);
			if(value){
				//req_0_warpper();
			}
		},
	})
ws_manager.socket_exist = false;

$(document).ready(function(){
	//学习目录初始化
	myChart = echarts.init(document.getElementById('charts'));
	node_click_register(myChart);
	myChart.showLoading();
	//myChart.hideLoading();
	console.log(ws_manager.socket_exist+"123");
	// //将窗口的状态改变
	// windowstatus=false;
	var cookie=$.cookie("user");
	var box=new jBox('Modal', {
		  width: 450,
		  height: 250,
		  animation: {open:'tada', 
		  close:'flip'},
		  title: 'AJAX request',
		  ajax: {
		    url: newDomainname+'judge_cookie_status/index.html',
		    type: 'POST',
		    dataType: 'json',
		    data: {
		      cookie:cookie
		    },
		    reload: 'strict',
		    setContent: false,
		    beforeSend: function() {
		      //this.setContent('');
		      this.setTitle('<div class="ajax-sending">Sending AJAX request...正在检查你身份和网络环境</div>');
		      if(cookie==null){
		  		 alert('未在系统上检测到你的登陆痕迹，关闭提示窗之后将会自动跳转登陆界面');
		  		 window.open("hello.html",'_self');
		      };  
		    },
		    complete: function(response) {
		      this.setTitle('<div class="ajax-complete">网络和身份检查完毕！</div>');
		    },
		    success: function(response) {
		    	 console.log(response);
		    	if(response.pass == true){
	      this.setContent('<div class="ajax-success">欢迎您的回归<tt>' + response.name + '</tt></div>');
		      /*for(var i=0;i<response.picture.length;i++){
		    	  picture_path_array.push(response.picture[i]);
		      }*/
		      //执行加载函数
		      //load_img();
		      //打开socket主连接
		      WebSocket_index(cookie);
		      //记录下登陆时间
		      $.ajax({url:newDomainname+"Update_logtime/"+cookie,success:function(result){
		    	  console.log(result);
		  	}});
		      }
		    	else  this.setContent('<div class="ajax-success">您的登陆状态过期或者不存在<tt></tt></div>');
		    },
		    error: function() {
		      this.setContent('<div class="ajax-error">Oops, something went wrong</div>');
		    }
		  }
		});
	    box.open();
		

});

//学习目录请求封装
function req_0_warpper()
{
	if(typeof(myChart) === "undefined"){
		console.log("reget mycharts");
		myChart = echarts.init(document.getElementById('charts'));
	}
	//myChart.showLoading();
	send_msg(ws_manager.ws, generater_req_0());
}

//学习内容请求封装
function req_1_warpper()
{
	send_msg(ws_manager.ws, generater_req_1());
}

//学习行为发送封装
//调用受限: source_txt已经正常返回
function req_2_warpper(chapter_id, event_id)
{
	if(send_action_status){
		send_msg(ws_manager.ws, generater_req_2(source_id_now, chapter_id, 4));
		send_action_status = false;
	}else{
		console.log("warning, action sending is bussy!");
	}
}

//生成请求学习目录参数
function generater_req_0()
{
	var temp_time = time_clock.getTime();
	req_time_stamps[0] = temp_time;
	return Object.assign({}, {request_index: 0, time_stamp: temp_time});
}

//生成请求学习内容参数
function generater_req_1(source_id, chapter_id)
{
	var temp_time = time_clock.getTime();
	req_time_stamps[1] = temp_time;
	return Object.assign({}, {request_index: 1, time_stamp: temp_time, source_id: source_id, chapter_id: chapter_id});
}

//生成发送学习行为参数
function generater_req_2(source_id, chapter_id, event_id)
{
	var temp_time = time_clock.getTime();
	req_time_stamps[2] = temp_time;
	return Object.assign({}, {
								request_index: 2, 
								time_stamp: temp_time, 
								source_id: source_id, 
								chapter_id: chapter_id,
								event_id: event_id
							});
}

//判断是否为json对象
 function isJson(obj){
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
	return isjson;
}

//有效时间检测
function get_time_valid(time_index, pre_judge_time)
{
	return (req_time_stamps[time_index] && typeof(pre_judge_time)=='number' ) ? (req_time_stamps[time_index] === pre_judge_time): false;
}

function load_img(){
	//队列思路处理核心算法加载图片资源
	$('#download_slide_outside').fadeIn();
	var i=0;
	var j=picture_path_array.length;
	var progress_unit=100/j;
	var t1= setInterval(function (){
		if(i==0){
			picture_img_array[0]=new Image();
			picture_img_array[0].src =picture_path_array[0];
			i++;
		}
		if(picture_img_array[i-1].complete&&i<j){
			var percentage=progress_unit*i+"%";
			$('#download_slide_inside').css("width",percentage);
			picture_img_array[i]=new Image();
			picture_img_array[i].src =picture_path_array[i];
			console.log(picture_img_array[i-1].complete);
			i++;
			
		}
		else if(i==j&&picture_img_array[i-1].complete){
			$('#download_slide_inside').css("width","100%");
			$('#download_slide_outside').fadeOut();
			clearInterval(t1);
		}
	 },50)
}
//消息变量
var content="";
var title="";
function WebSocket_index(cookie)
{
   if ("WebSocket" in window&&!ws_manager.socket_exist)
   {  
      // 打开一个 web socket
      ws_manager.ws= new WebSocket(wsname+"spyder/"+cookie);
      ws_manager.ws.onopen = function()
      {
    	 ws_manager.socket_exist=true;
         // Web Socket 已连接上，使用 send() 方法发送数据
         //ws.send(jsonstr);
         //alert("数据发送中...");
    	//检查是否选过nickname，延时25秒后执行
    	setTimeout(function () {
    	var cookie=$.cookie("user");
    	$.ajax({
    		url:newDomainname+"check_nickname_chosen/"+cookie,
			type:"POST",
    		success:function(result){
 			//console.log(result);
    		if(result.execute==true){
    			generateAvatarJBox(true);	
    		}	
 		},
    	 error:function(){
    		console.log("something warning！");
    	 }
    	})   	 
    	},25000)
    	 
    	/** setTimeout(function () {
    		console.log("zhixing!");
    		generateAvatarJBox(true);
    	 },25000)
    	 
    	 **/
      };  
      ws_manager.ws.onmessage = function (evt) 
      { 
		  var received_msg = JSON.parse(evt.data);
		  console.log(received_msg);
		if(received_msg !== null && received_msg.hasOwnProperty('response_index') ){
			 //学习资源接收参数解析
			 if(!get_time_valid(received_msg.response_index, received_msg.req_time_stamps)){
				switch(received_msg.response_index)
				{
					case 0:
						delete received_msg.response_index;
						delete received_msg.req_time_stamps;
						(received_msg.hasOwnProperty('nodes') && received_msg.hasOwnProperty('edges')) && 
							(Object.assign(graph_data, received_msg));
						init_graph(graph_data, myChart);
					case 1:
						delete received_msg.response_index;
						delete received_msg.req_time_stamps;
						Object.assign(source_txt, received_msg);
						source_txt.hasOwnProperty('video') && (video_on_hand = source_txt.video);
						source_id_now = source_txt.source_id;
						addDocument(source_txt);
						//用户点击节点
						req_2_warpper(0, 0);
					case 2:
						send_action_status != send_action_status;
				} 
			 }else{
				 console.log("warning, data frames blocked!");
			 }
		 }else{
			 
			 title+=received_msg.title;
			 content+=received_msg.content;
			 var jbox=new jBox('Notice', {
			    theme: 'NoticeFancy',
			    attributes: {  
			      x: 'left',
			      y: 'bottom'
			    },
			    color: getColor(),
			    content:get_content(), 
			    title: getTitle(),
			    maxWidth: 600,
			    autoClose:autoClose_time(),
			    animation: {open: 'slide:bottom', close: 'slide:left'},
			    delayOnHover: true,
			    showCountdown: true,
			    closeButton: true
			  });
			 jbox.open();
			 content="";
			 title="";
			 //alert("数据已接收..."+received_msg);
		 }
      }; 
      ws_manager.ws.onclose = function()
      { 
    	  alert("确定退出嘛？");
         // 关闭 websocket
    	  ws_manager.socket_exist=false; 
      };
   }
   
   else
   {
     // 浏览器不支持 WebSocket
     alert("您的浏览器已经存在连接不允许重复连接或者不支持 WebSocket!或者您可以刷新试试");
   }
}
var get_content = function(){
	return content;
};
var colors = ['red', 'green', 'blue', 'yellow','pink','orange','purple','white'];
var getColor = function () {
 var index=Math.floor(Math.random()*8);
  return colors[index];
};
var getTitle = function () {
	  return title;
};
 var autoClose_time=function () {
	var length=content.length;
	return Math.random()*1000*length + 3000;
 };
//关闭窗口时弹出确认提示
 $(window).unload(function(){
	 alert("确定退出嘛？");
	 if(!windowstatus){
	 var cookie=$.cookie("user");
	$.ajax({url:newDomainname+"Update_exitime/"+cookie,success:function(result){
			console.log(result);
			if(result){
			alert("您的学习状态保存成功");
			}
			else alert("您的学习状态未保存成功可能是网络原因或者别的，不过不用担心，我们的后台会智能为您处理！");
		}});
	
	 }
 })
 
//请求参数方法
function send_msg(ws, send_obj)
{
	if(!isJson(send_obj)){
		console.log("error, sending attribute wrong!");
	}
	else if(ws_manager.socket_exist){
		ws.send(JSON.stringify(send_obj));	
	}else{
		window.open("hello.html",'_self');
		console.log("error, websocket connection failed!");
	}
}