//Day 11: Drew the artwork in Photoshop
//Day 12: Coded it up

$(document).ready(function($) {
  
  //check if mobile
  
  if (isMobile()) {
    $('.block-mobile').css('display', 'flex');
    return;
  }  
  
  function isMobile() { 
    if (typeof window.orientation !== 'undefined') { 
      return true;         
    }         
    else {             
      return false;         
    }     
  }
  
  var scale = 1; 
  
  var $parallax = $('#avatar'), 
      $eyes = $('.eyes'),
      $upperarm=$('.upperarm'),
      $forearm=$('.forearm'),
      $hand=$('.hand'),
    cx, cy, dx, dy, tiltx, tilty, radius, degree, ratioX, ratioY, transform,
      eyeTransform = $eyes.css("transform"),
      uArmTransform=$upperarm.css("transform"),
      fArmTransform=$forearm.css("transform"),
      handTransform=$hand.css("transform"),
      newUpArm,
      newForeArm,
      newHand;
  
  var mousePos = {}, hue=0;
  
  //responsive resizing
  
  var $window = $(window);
  var width;
  var height;  
  var maxWidth  = $parallax.width();
  var maxHeight = $parallax.height();
  
  function resize() {
    width = $window.width();
    height = $window.height();

    scale = Math.min(width/maxWidth, height/maxHeight) * 1.18;

    $parallax.css({'transform': 'scale(' + scale + ')'});
  }
    

  $(window).resize(resize);
  
  resize();
  
  //parallaxing
  
  $(document).mousemove(function(event) {

    cx = Math.ceil(width / 1.8);
    cy = Math.ceil(height / 1);
    dx = mousePos.x - cx;
    dy = mousePos.y - cy;

    tiltx = (dy / cy);
    tilty = -(dx / cx);
    console.log(tiltx+', '+tilty);
    radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
    degree = (radius * 20);
    transform = 'scale('+scale+') rotate3d(' + -tiltx + ', ' + -tilty + ', 0, ' + degree + 'deg)';

    $parallax.css({
      'transform': transform
    });
    
    ratioX = mousePos.x/width;
    ratioY = mousePos.y/height;
    
    $eyes.css('transform',eyeTransform+" translate("+lerp(-8,8,ratioX)+"px, "+lerp(-3,4,ratioY)+"px)");
    
    //upperarm 
    newUpArm = uArmTransform;
    if (ratioY < 0.5){
      newUpArm += " rotate("+lerp(95,-8,ratioX)+"deg)";
    }else{
      newUpArm += " rotate("+lerp(55,20,ratioX)+"deg)";
    }
    newUpArm += " rotateX("+lerp(40,-10,ratioY)+"deg)";
    $upperarm.css('transform', newUpArm);
    
    //forearm 
    newForeArm = fArmTransform;
    if (ratioY < 0.5){
      newForeArm += " rotate("+lerp(-145,65,ratioX)+"deg)";
    }else{
      newForeArm += " rotate("+lerp(-85,45,ratioX)+"deg)";
    }
    newForeArm += " rotateX("+lerp(0,-60,ratioY)+"deg)";
    $forearm.css('transform', newForeArm);
    
    //hand 
    newHand = handTransform;
    if (ratioX < 0.5){
      newHand +=" rotate("+lerp(30,0,ratioY)+"deg)";
    }else{
      newHand +=" rotate("+lerp(-10,10,ratioY)+"deg)";
    }
     $hand.css('transform', newHand);
    
  });
  
  function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t;
  }
  
  // color particles

 function getRandomInt(min, max) {
   return Math.round(Math.random() * (max - min + 1)) + min;
 }
  
  $(window).mousemove(function(e) {
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;
  });
  
  $(window).mouseleave(function(e) {
    mousePos.x = -1;
    mousePos.y = -1;
  });
  
  var draw = setInterval(function(){
    if(mousePos.x > 0 && mousePos.y > 0){
      
      var range = 8;
      
      var color = "background: hsla("+hue+",90%,60%,0.6);";
      hue+=1;
      if (hue>360){
        hue=0;
      }
      
      var sizeInt = getRandomInt(15, 45);
      size = "height: " + sizeInt + "px; width: " + sizeInt + "px;";
      
      var left = "left: " + getRandomInt(mousePos.x-range-sizeInt, mousePos.x+range) + "px;";
      
      var top = "top: " + getRandomInt(mousePos.y-range-sizeInt, mousePos.y+range) + "px;"; 

      var style = left+top+color+size;
      $("<div class='ball' style='" + style + "'></div>").appendTo('#wrap').one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){$(this).remove();}); 
    }
  }, 30);
  
});