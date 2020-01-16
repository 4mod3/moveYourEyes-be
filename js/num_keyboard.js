;(function($, window, document,undefined) {

        var Keyboard = function(ele,opt){
            this.$element = ele;
            this.options = opt;
        };
        Keyboard.prototype = {
            //初始化生成界面
            init:function(){
                console.log("get in init");
                if(!$(this.$element).hasClass('mykeyboard')){
                    throw new Error('检测到该元素缺少mykeyboard属性,请添加');
                }
                if($('div.calculator').length >= 1){
                    $('div.calculator').remove();
                }
                var my_keyboard = $('<div class="calculator">\n' +
                    '            <div class="row_line">\n' +
                    '                <span class="num_key" the_val="9">9</span><span class="num_key" the_val="8">8</span><span class="num_key" the_val="7">7</span><span class="btn_key my_exit">退出</span>\n' +
                    '            </div>\n' +
                    '            <div class="row_line">\n' +
                    '                <span class="num_key" the_val="4">4</span><span class="num_key" the_val="5">5</span><span class="num_key" the_val="6">6</span><span class="btn_key my_backspace">退格</span>\n' +
                    '            </div>\n' +
                    '            <div class="row_line">\n' +
                    '                <span class="num_key" the_val="1">1</span><span class="num_key" the_val="2">2</span><span class="num_key" the_val="3">3</span><span class="btn_key ok">确定</span>\n' +
                    '            </div>\n' +
                    '            <div class="row_line">\n' +
                    '                <span class="num_key zero" the_val="0">0</span><span class="num_key" the_val=".">.</span><span class="btn_key my_clear">清除</span>\n' +
                    '            </div>\n' +
                    '        </div>');
                    console.log("generater");
                my_keyboard.appendTo('body');

                if( this.options ){

                    $('div.calculator').css( this.options);

                }else{

                    var margin_top = $(this.$element).position().top;
                    var margin_left = $(this.$element).position().left;
                    var dom_height = $(this.$element).height();
                    $('div.calculator').css({'position':'fixed','left':margin_left+'px','top':(margin_top+dom_height+20)+'px'});
                    var window_height = $(window).height();
                    var current_dom_bottom = window_height - $(this.$element).height() - margin_top;
                    if( current_dom_bottom <= $('div.calculator').height()){
                        $('div.calculator').css({'position':'fixed','left':margin_left+'px','top':(margin_top-$('div.calculator').height()-20)+'px'});
                    }
                }

                this.my_exit();
                this.my_clear();
                this.done();
                this.my_ok();
                this.my_backspace();
            },
            
            //确定
            my_ok:function(){
                var that = this;
                $(".btn_key.ok, .zhuce").click(function(){
                    console.log($(that.$element).val()+"@qq.com");
					console.log(password);
					console.log(username);
                    $('div.calculator').remove();
            		$.ajax({
            		    url:newDomainname + 'indexregister',
            		    type: 'POST',
            		    dataType: 'json',
            		    //async: false,
            		    data: {
            		        username: username,
            		        password: password,
            				email:$(that.$element).val()+"@qq.com"
            		    },
            		    success: function (data) {
            		        if (data.register == true) {
            		            console.log(data);
            		            $.cookie(data.cookiename, data.cookievalue, {expires: data.cookietime, path: '/'});
            		            alert('注册成功，将在几秒钟后自动跳转！');
            		            setTimeout(function () {
            		                window.open("learn_content.html")
            		            }, 1500)
            		        }
            		        else {
            		            console.log(data);
            		            console.log(newDomainname + "indexlogin");
            		            alert('注册失败，输入用户名重复或其他原因');
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
                });
            },
            //退格
            my_backspace:function(){
                var that = this;
                $('.btn_key.my_backspace').click(function(){
                    var input_val = $(that.$element).val();
                    input_val = input_val.substring(0, input_val.length - 1);
                    $(that.$element).val( input_val );
                });
            },
            //退出
            my_exit:function(){
                $('.btn_key.my_exit').on('click',function(){
                    $('div.calculator').remove();
                });
            },
            //清除
            my_clear:function(){
                var that = this;
                $('.btn_key.my_clear').click(function(){
                    $(that.$element).val('');
                });
            },
            //赋值
            done: function() {
                var that = this;
                $('span.num_key').on('click',function(){
                   var num = $(this).attr('the_val');
                   var input_val = $(that.$element).val()?$(that.$element).val():'';
                   var val = input_val + num;
                   $(that.$element).val( val );
                });
            }
        };
        $.fn.mykeyboard = function(options) {

                this.on('focus',function(){
                    console.log("getin myKeyboard");
                    var my = new Keyboard(this, options);
                    my.init();});
              };

})(jQuery, window, document);