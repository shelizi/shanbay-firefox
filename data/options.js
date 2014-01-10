/*
 * 这个文件用来绑定获取参数的监听器(后台页面)。
 */
 self.port.on('initOptionsPage',function(){
        console.log('init page');
         self.port.on('responsePreferences',function(responseOptions)
        {
         console.log('responsePreferences');
        options=responseOptions;
        pageinit();
        });
        self.port.emit('getPreferences');
 });
 
  //使用属性初始化界面
   var options ;
  function initOption() {
    
    for ( var engine in options) {
      for ( var attr in options[engine]) {
        var id = "selection_" + engine + "_" + attr;
        $("#" + id).prop("checked", options[engine][attr]);
        switchCheck(id);
      }
    }
  }
  
  //切换某个选项的选中状态
  function switchCheck(id) {
    var attrs = id.split("_");
    var sid = "#" + id;
    //var options = JSON.parse(localStorage.options);
    options[attrs[1]][attrs[2]] = $(sid).prop("checked");
    self.port.emit('updatePreferences',options);
    //localStorage.options = JSON.stringify(options);
    if(attrs[2]=="enabled")  // 只有更改引擎的总开关才切换子项
      setChildrenEnabled(id);
  }
  
  //设置某个选项的子项是否可用
  function setChildrenEnabled(id) {
    var sid = "#" + id;
    var disabled = !$(sid).prop("checked") || $(sid).prop("disabled");
    $(sid).parent().children("div").children("input").not($(sid)).each(function() {
      $(this).prop("disabled", disabled);
      setChildrenEnabled(this.id);
    });
  }

 var pageinit= function(){
 console.log('page init html');
    initOption();
    $("input").click(function() {
      switchCheck(this.id);
      console.log('input');
    });

    $("label").click(function() {
      var prev = $(this).prev();
      if (prev.prop("disabled"))
        return;

      prev.prop("checked", function(i, val) {
        return !val;
      });

      switchCheck(prev[0].id);
        console.log('label');
    })
  }