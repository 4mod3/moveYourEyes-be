/**
 * 
 提高代码复用性，定义简介函数
 * 
 * 
 * 
 * 
 */
//获取文件信息而不去缓存其，利用head协议，返回文件之和总大小，参数数组或者单值均可，传递文件读取路径
function getfilessize(file){
	if(file.gettype()=="element"){	
	var xhr = new XMLHttpRequest();
	//同步请求
	xhr.open('HEAD',file.getdata(),false);
	 //规范要求，如果是get或者head请求的时候，将send值设置为null
	 xhr.send(null);
	 return parseInt(xhr.getResponseHeader('Content-Length'));
	}
	else if(file.gettype()=="array"){
	var i=file.getdata().length;
	var data=file.getdata();
	var timeall=0;
	var xhr = new XMLHttpRequest();
    for(var j=0;j<i;j++){
    	xhr.open('HEAD',data[j],false);
   	 //规范要求，如果是get或者head请求的时候，将send值设置为null
   	 xhr.send(null);
    timeall+=parseInt(xhr.getResponseHeader('Content-Length'));
   }	
  return timeall;
}
}
//定义文件类
function Filesize(type,data){
	this.type=type;
	this.data=data;
	this.gettype=function(){
		return this.type;
	}
	//此时type的意义体现的已经不是很多了
	this.getdata=function(){
		if(this.type=="element"){
			return this.data;
		}
		else if(this.type=="array"){
			return this.data;
		}		
	}	
}
//返回需要大概(网络传输情况根据调用时候的状态决定)加载的时间,单位为秒
function gettransport_time(file){
	//正常1M带宽的传输速率为128kb，结合实际过程取平均值的一半，也很可能达不到这个值
	const speed=32;
	var filesize=getfilessize(file);
	var need_time=filesize/1000/speed;
	return need_time;
}