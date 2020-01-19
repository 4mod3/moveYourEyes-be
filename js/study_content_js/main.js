jQuery(document).ready(function($) {
	//store DOM elements
	var imageWrapper = $('.cd-images-list'),
		imagesList = imageWrapper.children('li'),
		contentWrapper = $('.cd-content-block'),
		contentList = contentWrapper.children('ul').eq(0).children('li'),
		blockNavigation = $('.block-navigation'),
		blockNavigationNext = blockNavigation.find('.cd-next'),
		blockNavigationPrev = blockNavigation.find('.cd-prev'),
		//used to check if the animation is running
		animating = false;

	//on mobile - open a single project content when selecting a project image
	imageWrapper.on('click', 'a', function(event) {
		event.preventDefault();
		var device = MQ();

		(device == 'mobile') && updateBlock(imagesList.index($(this).parent('li')), 'mobile');
	});

	//on mobile - close visible project when clicking the .cd-close btn
	contentWrapper.on('click', '.cd-close', function() {
		var closeBtn = $(this);
		if (!animating) {
			animating = true;

			closeBtn.removeClass('is-scaled-up').one(
				'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
				function() {
					contentWrapper.removeClass('is-visible').one(
						'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
						function() {
							animating = false;
						});

					$('.cd-image-block').removeClass('content-block-is-visible');
					closeBtn.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
				});
		}
	});

	//on desktop - update visible project when clicking the .block-navigation
	blockNavigation.on('click', 'button', function() {
		var direction = $(this),
			indexVisibleblock = imagesList.index(imageWrapper.children('li.is-selected'));

		if (!direction.hasClass('inactive')) {
			var index = (direction.hasClass('cd-next')) ? (indexVisibleblock + 1) : (indexVisibleblock - 1);
			updateBlock(index);
		}
	});

	//on desktop - update visible project on keydown
	$(document).on('keydown', function(event) {
		var device = MQ();
		if (event.which == '65' && !blockNavigationNext.hasClass('inactive') && device == 'desktop') {
			//go to next project
			updateBlock(imagesList.index(imageWrapper.children('li.is-selected')) + 1);
		} else if (event.which == '68' && !blockNavigationPrev.hasClass('inactive') && device == 'desktop') {
			//go to previous project
			updateBlock(imagesList.index(imageWrapper.children('li.is-selected')) - 1);
		}
	});

	function updateBlock(n, device) {
		if (!animating) {
			animating = true;
			var imageItem = imagesList.eq(n),
				contentItem = contentList.eq(n);

			classUpdate($([imageItem, contentItem]));

			if (device == 'mobile') {
				contentItem.scrollTop(0);
				$('.cd-image-block').addClass('content-block-is-visible');
				contentWrapper.addClass('is-visible').one(
					'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
					function() {
						contentWrapper.find('.cd-close').addClass('is-scaled-up');
						animating = false;
					});
			} else {
				contentList.addClass('overflow-hidden');
				contentItem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
					contentItem.siblings().scrollTop(0);
					contentList.removeClass('overflow-hidden');
					animating = false;
				});
			}

			//if browser doesn't support transition
			if ($('.no-csstransitions').length > 0) animating = false;

			updateBlockNavigation(n);
		}
	}

	function classUpdate(items) {
		items.each(function() {
			var item = $(this);
			item.addClass('is-selected').removeClass('move-left').siblings().removeClass('is-selected').end().prevAll().addClass(
				'move-left').end().nextAll().removeClass('move-left');
		});
	}

	function updateBlockNavigation(n) {
		(n == 0) ? blockNavigationPrev.addClass('inactive'): blockNavigationPrev.removeClass('inactive');
		(n + 1 >= imagesList.length) ? blockNavigationNext.addClass('inactive'): blockNavigationNext.removeClass('inactive');
	}

	function MQ() {
		return window.getComputedStyle(imageWrapper.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(
			/"/g, "").split(', ');
	}

	//add Document content by json data
	function addDocument(Content_number, demoContent) {
		for (var i = 0; i < Content_number; i++) {
			//用append加入元素快
			$(".cd-images-list").append("<li> <a href='#0'> <h2>" + demoContent[i].Content_title + "</h2>\n" +
				"<video width=\"100%\" controls=\"controls\" style='box-shadow: 0px 0px 10px 0px #333333;'>\n" +
				"<source src=\"" + demoContent[i].Content_video + "\"type=\"video/mp4\">\n" +
				"<source src=\"movie.ogg\" type=\"video/ogg\">\n" +
				"您的浏览器不支持 HTML5 video 标签。\n" +
				"</video> </a> </li>");
			$("div ul").last().append("<li> <div> <h2>" + demoContent[i].Content_title + "</h2> <p>" +
				demoContent[i].Content_focus_on + " </p> <p>  </p> <p>" + demoContent[i].Content_text + " </p> </div> </li>");
		}
	}

	//add Document content_back by json data
	function addDocument_2(demoContent) {
		$("div#source_display_2 ul li p").first().innerText = demoContent.content.text;
		$("div#source_display_2 ul li p").last().innerText = demoContent.comment.text;
		$("div#content_text p").innerText = demoContent.content.text;
		$("div#comment_text p").innerText = demoContent.comment.text;
		for (var i in demoContent.content.code) {
			$("div#content_code").append("<div><p>" + demoContent.content.code[i] + "</p></div>");
			$("div#comment_code").append("<div><p>" + demoContent.comment.code[i] + "</p></div>");
		}
	}

	//define Content Object
	function Content(Content_title, Content_video, Content_focus_on, Content_text) {
		this.Content_title = Content_title;
		this.Content_video = Content_video;
		this.Content_focus_on = Content_focus_on;
		this.Content_text = Content_text;
	}
});



function update_abstract(title_after, abstract_after) {
	var title_before = document.getElementById('control_h');
	title_before.innerText = title_after;
	var abstract_before = document.getElementById('control_p');
	abstract_before.innerText = abstract_after;
}

function update_content(content_after, code_after) {
	var content_before = document.getElementById('control_content');
	content_before.innerText = content_after;
	var content_before = document.getElementById('control_code');
	content_before.innerText = code_after;
}
function update_comment(comment){
	var length = comment.length;
	$("div#comment_all").innerHTML = "";
	if(length >=6){
		for(var i=0;i<6;i++){
			$("div#comment_all").append("<div class='comment'>"+"<b>评论"+i+":</b><br>"+
                "<div class='comment_text'><code>"+comment[i].text+"</code></div>"+"<b>代码:</b><br>"+
            "<div class='comment_code'><code>"+comment[i].code+"</code></div></div>");
		}
	}
	else{
		for(var i=0;i<length;i++){
            $("div#comment_all").append("<div class='comment'>"+"<b>评论"+i+":</b><br>"+
                "<div class='comment_text'><code>"+comment[i].text+"</code></div>"+"<b>代码:</b><br>"+
                "<div class='comment_code'><code>"+comment[i].code+"</code></div></div>");
        }
	}
}

//echarts 生成学习目录
var option;

function init_graph(graph_data, myChart) {
	myChart.hideLoading();
	//graph_data = graph_data.parseJSON()
	option = {
		title: {
			text: ' '
		},
		animationDuration: 1500,
		animationEasingUpdate: 'quinticInOut',
		backgroundColor: '#2c343c',
		series: [{
			name: 'test_graph_name',
			type: 'graph',
			left: 15,
			nodeScaleRatio: 0.5,
			symbol: 'circle',

			//coordinateSystem: 'cartesian2d',

			roam: true,
			layout: 'force',
			force: {
				initLayout: 'circular',
				repulsion: 1000,
				gravity: 0.1,
				edgeLength: 300
			},

			data: graph_data.nodes,
			links: graph_data.edges,
			categories: graph_data.categories,

			focusNodeAdjacency: true,
			itemStyle: {
				borderColor: '#ffffff',
				borderWidth: 4,
				shadowBlur: 20,
				shadowColor: 'rgba(198, 198, 198, 76)',
			},
			label: {
				show: true,
				formatter: '{b}',
				fontSize: 20
			},
			lineStyle: {
				width: 25,
				color: 'source',
				curveness: 0.3
			},
			emphasis: {
				show: true,
				lineStyle: {
					width: 40
				}
			}
		}]
	}
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}


//交互事件

function node_click_register(myChart) {

	myChart.on('click', function(params) {
		//发送学习行为
		//进入节点
		console.log(params);
		chapter_id_now = 0;
		console.log(generater_req_1(params.data.value, 1));
		send_msg(ws_manager.ws, generater_req_1(params.data.value, 1));
		console.log("send message!");
		$("div#main").fadeOut("slow", function() {
			$("div#source_display_1").fadeIn("slow");
			$("div#source_display_2").fadeIn("slow");
			$("ul#source_display_3").fadeIn("slow");
		});
	});
}


$("div#source_display_2").click(function() {
	//开始阅读文字学习
	req_2_warpper(source_txt.chapter_id, 4);
	$("div#source_display_1").fadeOut("slow");
	$("div#source_display_2").fadeOut("slow");
	$("div#wrap").fadeOut("slow");
	$("ul#source_display_3").fadeOut("slow", function() {
		$("div#content").fadeIn("slow");
		$("body").style = "backgroundColor:#fff"
	})
})
$("div#content").click(function() {
	//阅读文字学习结束
	req_2_warpper(source_txt.chapter_id, 5);
	$("div#content").fadeOut("slow", function() {
		$("div#source_display_1").fadeIn("slow");
		$("div#source_display_2").fadeIn("slow");
		$("ul#source_display_3").fadeIn("slow");
		$("div#wrap").fadeIn("slow");
	})
})

//菜单栏响应事件
$("div#nav_div_h1").click(function() {
	window.location.replace("index.html");
})
$("div#nav_div_h2").click(function() {
	$("div#source_display_2").fadeOut("fast");
	$("ul#source_display_3").fadeOut("fast");
	$("div#source_display_1").fadeOut("slow", function() {
		$("div#main").fadeIn("slow")
	})
	myChart.setOption(option);
})
