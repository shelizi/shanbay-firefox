

self.port.on('init',function(){
self.port.emit('getSwfFile');
self.port.on('responseSwfFilePath',function(path)
{
console.log(path);
//soundManager.debugFlash = true
//debugMode = true;
soundManager.setup({
  url: 'swf',
  //flashVersion: 9,
  useFlashBlock: false,
  onready: function() {
   console.log('player');
    // SM2 is ready to play audio!
      var mySound = soundManager.createSound({
      id: 'aSound',
      url: 'http://media.shanbay.com/audio/us/explosion.mp3'
    });
    console.log('player');
    mySound.play();
  }
  
});
})
});
