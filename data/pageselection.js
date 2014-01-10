//鼠标停留在结果上时不响应鼠标弹起事件
var _isMouseOnDiv = false;

var _getValidSelection = function() {
  //trim
  var text = $.trim(String(window.getSelection()));

  //same word?
  if (this.lastQuery == text) {
    text = "";
  } else {
    this.lastQuery = text;
  }

  return text;
}

var onSelect = function(event) {
    if (event.button != 0) //left button
    return;

  if (this._isMouseOnDiv == true) {
    return;
  }

  if (document.activeElement.type === "password") {
    return;
  }
  var obj={
  text:this._getValidSelection(),
  x:event.pageX,
  ox:document.body.offsetWidth,
  pageY:event.pageY,
  ctrlKey:event.ctrlKey
			}
            console.log(obj.text);
self.port.emit('select',obj);
  //var text = this._getValidSelection();

  //var x = event.pageX;
  //var ox = document.body.offsetWidth;
 /* if (obj.x > 500 && obj.ox - obj.x < 500) {
    obj.x -= 500;
  }

  $(this._resultDivSelector).css("left", x + "px").css("top",
      event.pageY + 10 + "px");

  thisObj = this;
  
  var response = {
        global: {
            enabled: true,
            ctrlmask: false
        },
        shanbaydict: {
            enabled: true,
            autoadd: false,
            autoplay: true
        },
        googletran: {
            enabled: true
        },
        wikizh: {
            enabled: false
        },
        wikien: {
            enabled: false
        }
    };
    
  if (response.global.ctrlmask && !event.ctrlKey) 
      return;
  thisObj.queryAndShow(text, response);*/
}

$("body").ready(function() {
  //ShanbayChromeExtension.initialize();
  $("body").mouseup(function(event) {
    onSelect(event);
  });
});
