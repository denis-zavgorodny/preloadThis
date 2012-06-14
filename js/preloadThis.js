var preloadThis = function(options) {
    var extend = function (obj1, obj2){
        for(var i in obj2) {
            obj1[i] = obj2[i];
        }
        return obj1;
    };
    var getXmlHttp = function(){
      var xmlhttp;
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
          xmlhttp = false;
        }
      }
      if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp = new XMLHttpRequest();
      }
      return xmlhttp;
    };
    var getURL = function(url, callback) {
        var loadProcess = new getXmlHttp();
        loadProcess.onreadystatechange = function() {
            if (loadProcess.readyState == 4) {
                if (typeof callback === 'function')
                    callback();
                innerCounter++;
                if (innerCounter == options.load.length)
                    if (typeof options.complete === 'function')
                    options.complete();
            }
        };
        loadProcess.open('GET', options.load[item], true); 
        loadProcess.send(null);  // отослать запрос
    };
    var options = extend({
        load: [],
        callback: {},
        complete: function() {
            alert('Ready');
        }
    }, options);
    var loadProcess = [];
    

    if (!options.load.length)
     return false;


    var innerCounter = 0;
    for (var item in options.load) {
        getURL(options.load[item], options.callback[item]);
    }
};
    
var test = new preloadThis(
    {
        load: [
            "preloader5.swf",
            "images/img1.jpg"
        ],
        callback: [
            function() {console.log('11111');},
            function() {console.log('22222');}
        ],
        complete: function() {
            alert('Yuhoooo!');
        }
        
    }
);
 
