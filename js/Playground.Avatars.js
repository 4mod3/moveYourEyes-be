
/* Playground Demo: Avatars */


// All data we are using for this demo we will store in the variable DemoAvatars




// All the magic happens in the function generateAvatarJBox
//操作主类
var DemoAvatars = {
			//存储喜欢过的nickname
			  Likedname:[],
			//初始化imgurl  
			  Urlhead:[],
			 //初始化nickname 
			  Avatars: [],
			  Modals: {}
};
function generateAvatarJBox(initial)
{
	
//初始化赋值
    $.ajax({
        url: newDomainname+ "getNicknameList/12",
        type: 'POST',
        dataType: 'json',
        async: false,//打开同步
        success: function (data) {
            console.log(data);
            for(var i=0;i<data.res_source.length;i++){
                DemoAvatars.Avatars[i]=data.res_source[i].nickname;
                DemoAvatars.Urlhead[i]= Domainname + data.res_source[i].url;
                console.log(newDomainname);
            }
        }
    })
    // We only need to initialize the tooltips for the avatar collection once
  // We can later refer to this jBox instance with DemoAvatars.AvatarsTooltip
  
  !DemoAvatars.AvatarsTooltip && (DemoAvatars.AvatarsTooltip = new jBox('Tooltip', {
    theme: 'TooltipBorder',             // We are using the border theme...
    addClass: 'AvatarsTooltip',         // ...and add a class so we can adjust the theme with CSS
    attach: '[data-avatar-tooltip]',    // We attach the tooltip to the elements with the attribute data-avatar-tooltip...
    getContent: 'data-avatar-tooltip',  // ... and also get the content from the same attribute
    zIndex: 12000,                      // These tooltips have the highest z-index
    animation: 'move',
    
    // Adding the liked or disliked class depending on the container the avatar is in
    onOpen: function () {
      this.wrapper.removeClass('AvatarsTooltipLike AvatarsTooltipDislike').addClass('AvatarsTooltip' + (this.source.parent().attr('id') == 'LikedAvatars' ? 'Like' : 'Dislike'));
    }
  }));
  
  
  // When we are creating the initial jBox, reset global variables
  
  if (initial) {
    DemoAvatars.clicked = false;
    DemoAvatars.current = -1;
  }
  
  
  // Increase current avatar index
  
  DemoAvatars.current++;
  
  
  // When we looped through all the avatars, show a jBox Modal with a hint that there are no more avatars nearby
  
  if (DemoAvatars.current >= DemoAvatars.Avatars.length) {
	//console.log(DemoAvatars.Likedname.length);
	  //判断liked数组
	if(DemoAvatars.Likedname.length>0){
		 $.ajax({
		        url:newDomainname+"sendNickname",
		        type: 'POST',
		        dataType: 'json',
		        async: true,//关闭同步
		        data:{
		        	cookie:$.cookie("user"),
		            nickname:DemoAvatars.Likedname[0]
		        },
		       success: function (data) {
		      	  console.log("ok");
		      	  },
		       error:function(){
		    	   console.log("出错");
		       } 
		})
		 DemoAvatars.Likedname=[];  
		 DemoAvatars.Urlhead=[]; 
		 DemoAvatars.Avatars=[];
	DemoAvatars.Modals.AvatarsInitial.close();
}   	  
    DemoAvatars.Modals.AvatarsComplete = new jBox('Modal', {
      
      // We use similar options to our Avatar modal so they look similar
      id: 'AvatarsComplete',
      addClass: 'AvatarsModal',
      width: 600,
      height: 500,
      animation: 'zoomIn',
      overlay: false,
      blockScroll: false,
      closeButton: false,
      closeOnEsc: false,
      adjustDistance: {
        top: 40,
        right: 5,
        bottom: 55,
        left: 5
      },
      footer: '<button class="button-close">Close</button>',
      title: 'Whoops',
      content: '<div>你能到这一步，暂时没有合适的姓名和头像了，我们将在下次为您海选合适的头像和昵称</div>',
      zIndex: 10000,
      
      // Once this jBox is created, we tel the close button to close the initial avatar modal
      onCreated: function () {
        this.footer.find('button').on('click', function () {
        	 DemoAvatars.Likedname=[];  
        	 DemoAvatars.Urlhead=[]; 
        	 DemoAvatars.Avatars=[];
          DemoAvatars.Modals.AvatarsInitial.close();
         
        });
      }
    }).open();
    
    // Nothing more to do, abort here
    return null;
  }
  
  
  // We are creating a new jBox Modal with the avatars each time this function gets called
  
  var jBoxAvatar = new jBox('Modal', {
    addClass: 'AvatarsModal',
    width: 600,
    height: 500,
    animation: 'zoomIn',
    zIndex: 10000,
    
    // Adjusting the distance to the viewport so we have space for the avatar collection at the bottom and the close button of the modal at the top
    adjustDistance: {
      top: 40,
      right: 5,
      bottom: 55,
      left: 5
    },
    
    // We are setting these options differently for the initial and the following jBoxes
    id: initial ? 'AvatarsInitial' : 'AvatarsModal' + DemoAvatars.current,
    overlay: initial ? true : false,            // Only one overlay is needed
    blockScroll: initial ? true : false,        // The initial jBox will block scrolling, no need for the others to o the same
    closeButton: initial ? 'overlay' : false,   // The initial jBox will have the close button in the overlay, the others won't need one
    closeOnEsc: initial ? true : false,         // Only the inital jBox can be closed with [ESC] button
    
    // Placing the buttons in the footer area
    footer: '<div class="clearfix"><button class="button-cross cross"></button><button class="button-heart heart"></button></div>',
    
    // Open this jBox when it is being initialized
    onInit: function () {
      this.open();
      
      // Here we store the index we used for this jBox
      this.AvatarIndex = DemoAvatars.current;
    },
    
    // When the jBox is created, add the click events to the buttons
    onCreated: function () {
      
      // Create the containers for the liked or disliked avatars
      if (initial) {
        $('<div id="LikedAvatars" class="AvatarsCollection"/>').appendTo($('body'));
        $('<div id="DislikedAvatars" class="AvatarsCollection"/>').appendTo($('body'));
      }
      
      $.each(this.footer.find('button'), function (index, el) {
        
        // Adding the click events for the buttons in the footer
        $(el).on('click', function () {
          
          // Storing a global var that the user clicked on a button
          DemoAvatars.clicked = true;
          
          // When a user clicks a button close the tooltips
          DemoAvatars.AvatarsTooltipLike && DemoAvatars.AvatarsTooltipLike.close();
          DemoAvatars.AvatarsTooltipDislike && DemoAvatars.AvatarsTooltipDislike.close();
          
          // When we click a button, the jBox disappears, let's tell this jBox that we removed it
          this.AvatarRemoved = true;
          
          // Did we like or dislike the avatar?
          var liked = $(el).hasClass('button-heart');
          //将喜欢的加入数组末尾继续循环
          if(liked){
        	  //console.log("add an element");
        	  if(DemoAvatars.current+1!=DemoAvatars.Avatars.length){
        	  DemoAvatars.Avatars[DemoAvatars.Avatars.length]=DemoAvatars.Avatars[DemoAvatars.current];
        	  DemoAvatars.Urlhead[DemoAvatars.Urlhead.length]=DemoAvatars.Urlhead[DemoAvatars.current];
        	  }
        	  if(!DemoAvatars.Likedname.length){
        		  DemoAvatars.Likedname[DemoAvatars.Likedname.length]=DemoAvatars.Avatars[DemoAvatars.current];
        	  }else{
        	  for(var i=0,j=0;i<DemoAvatars.Likedname.length;i++){
        		  if(DemoAvatars.Likedname[i]!=DemoAvatars.Avatars[DemoAvatars.current]){
        			  j++;  
        		  }
        		  if(i==DemoAvatars.Likedname.length-1){
        			  if(j==DemoAvatars.Likedname.length){
        	DemoAvatars.Likedname[DemoAvatars.Likedname.length]=DemoAvatars.Avatars[DemoAvatars.current];		  
        			  }
        		  }  
        	  }
        	}
        	  //console.log( DemoAvatars.Avatars[DemoAvatars.Avatars.length-1]);
          }
          else{
        	  for(var i=0;i<DemoAvatars.Likedname.length;i++){
        	    if(DemoAvatars.Likedname[i]==DemoAvatars.Avatars[DemoAvatars.current]){
        	    	DemoAvatars.Likedname.splice(i,1);
        	    	break;
        	    }	   
        	  }
          }
          // Slide the jBox to the left or right depending on which button the user clicked
          this.animate('slide' + (liked ? 'Right' : 'Left'), {
            
            // Once the jBox is removed, hide it and show the avatar in the collection
            complete: function () {
              this.wrapper.css('display', 'none');
              
              // Which container to use
              var collectionContainer = liked ? $('#LikedAvatars') : $('#DislikedAvatars');
              
              // If there if not enough space for the avatars to show in one line remove the first one
              if (collectionContainer.find('div[data-avatar-tooltip]').length && ((collectionContainer.find('div[data-avatar-tooltip]').length + 1) * $(collectionContainer.find('div[data-avatar-tooltip]')[0]).outerWidth(true) > collectionContainer.outerWidth())) {
                $(collectionContainer.find('div[data-avatar-tooltip]')[0]).remove();
              }
              
              // Add the avatar to the collection
              this.animate('popIn', {
                element: $('<div data-avatar-tooltip="You ' + (liked ? 'liked' : 'disliked') + ' ' + DemoAvatars.Avatars[DemoAvatars.current-1] + '"/>').append($('<div/>').html('<img src="'+DemoAvatars.Urlhead[this.AvatarIndex]+'"'+'/>')).appendTo(collectionContainer)
              });
              
              // Attach the avatar tooltip
              DemoAvatars.AvatarsTooltip && DemoAvatars.AvatarsTooltip.attach();
              
            }.bind(this)
          });
          
          // Open another Avatar jBox
          generateAvatarJBox();
          
        }.bind(this));
      }.bind(this));
    },
    
    // When we open the jBox, set the new content and show the tooltips if it's the initial jBox
    onOpen: function () {
      
      // Set title and content depending on current index
      this.setTitle(DemoAvatars.Avatars[DemoAvatars.current]);
      this.content.css({backgroundImage: 'url('+DemoAvatars.Urlhead[DemoAvatars.current]+')',backgroundSize:'cover'});
      
      // If it's the inital jBox, show the tooltips after a short delay
      initial && setTimeout(function () {
        
        // We are creating the two tooltips in a loop as they are very similar
        $.each(['Dislike', 'Like'], function (index, item) {
          
          // We store the tooltips in the global var so we can refer to them later
          DemoAvatars['AvatarsTooltip' + item] = new jBox('Tooltip', {
            theme: 'TooltipBorder',
            addClass: 'AvatarsTooltip AvatarsTooltip' +item,
            minWidth: 210,
            content: item,
            position: {
              y: 'bottom'
            },
            offset: {
              y: 5
            },
            target: '#AvatarsInitial .jBox-footer .button-' + (item == 'Like' ? 'heart' : 'cross'),
            animation: 'move',
            zIndex: 11000,
            
            // Abort opening the tooltips when we clicked on a like or dislike button already
            onOpen: function () {
              DemoAvatars.clicked && this.close();
            }
          }).open();
          
        });
        
      }, 500);
    }
  });
  
  // If it's the inital jBox add onClose events
  initial && (jBoxAvatar.options.onClose = function ()
  {
    // Loop through all avatar jBoxes and close them if they are not removed yet
    $.each(DemoAvatars.Modals, function (index, jBox) {
      jBox.id != 'AvatarsInitial' && !jBox.AvatarRemoved && jBox.close();
    }.bind(this));
    
    // Remove the collection containers with a sliding animation
    $.each(['Liked', 'Disliked'], function (index, item) {
      this.animate('slide' + (item == 'Liked' ? 'Right' : 'Left'), {
        element: $('#' + item + 'Avatars'),
        complete: function () {
          $('#' + item + 'Avatars').remove();
        }
      });
    }.bind(this));
    
    // Close the tooltips
    DemoAvatars.AvatarsTooltipLike && DemoAvatars.AvatarsTooltipLike.close();
    DemoAvatars.AvatarsTooltipDislike && DemoAvatars.AvatarsTooltipDislike.close();
  });
  
  // If it's the inital jBox add onCloseComplete events
  initial && (jBoxAvatar.options.onCloseComplete = function ()
  {
    // Loop through all modal jBoxes and remove them from DOM
    $.each(DemoAvatars.Modals, function (index, jBox) {
      jBox.destroy();
      delete DemoAvatars.Modals[jBox.id];
    });
    
    // Remove the tooltips from DOM
    DemoAvatars.AvatarsTooltipLike && DemoAvatars.AvatarsTooltipLike.destroy();
    DemoAvatars.AvatarsTooltipDislike && DemoAvatars.AvatarsTooltipDislike.destroy();
  });
  
  // Store the jBox in the modal collection
  DemoAvatars.Modals[jBoxAvatar.id] = jBoxAvatar;
}


// On domready, add the click event to the button

$(document).ready(function() {
  $('#DemoAvatars').click(function () { generateAvatarJBox(true); });
//  $.ajax({
//	  url:"http://127.0.0.1:8080/test/7hu46nwsjRgroixgqF9qwgxj2nyg/heihei",
//	  type:"get",
//	  async:false,
//	  success:function(data){
//		  console.log(data);
//	  }
//	  });
	// console.log(xhr.responseText);
  
});
