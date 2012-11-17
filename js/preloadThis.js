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
    var getNameBrouser = function() {
        var ua = navigator.userAgent.toLowerCase();
        // Определим Internet Explorer
        if (ua.indexOf("msie") != -1 && ua.indexOf("opera") == -1 && ua.indexOf("webtv") == -1) {
        return "msie"
        }
        // Opera
        if (ua.indexOf("opera") != -1) {
        return "opera"
        }
        // Gecko = Mozilla + Firefox + Netscape
        if (ua.indexOf("gecko") != -1) {
        return "gecko";
        }
        // Safari, используется в MAC OS
        if (ua.indexOf("safari") != -1) {
        return "safari";
        }
        // Konqueror, используется в UNIX-системах
        if (ua.indexOf("konqueror") != -1) {
        return "konqueror";
        }
        return "unknown";
    }
    var nojQuery = {
        queue: [],
        ready: function (f) {
            if (typeof f=='function') {
                nojQuery.queue.push(f);
            }
            return nojQuery;
        },
        unqueue: function () {
            for (var i = 0; i < nojQuery.queue.length; i++)
                nojQuery.queue[i]();
            nojQuery.queue = null;
        },
        queueed: false
    };
    var nativeHolded = false;
    if (typeof window.jQuery == 'undefined') {
        window.jQuery = window.$ = nojQuery.ready;
    }
    var selfJSAdd = function(js, selfCounter) {
        var url = js.shift();
        if (url == undefined) {
            selfJSAdd(js, selfCounter++);
            return false;
        }
        if (options.holdOnReady && window.jQuery && jQuery.fn && jQuery.extend && !nativeHolded) {
            jQuery.holdReady(true);
            nativeHolded = true;
        }
        if (!options.holdOnReady && window.jQuery && jQuery.fn && jQuery.extend && !nojQuery.queueed) {
            nojQuery.unqueue();
            nojQuery.queueed = true;
        }    
        var tmp = document.createElement("script");
        tmp.setAttribute("type", "text/javascript");
        tmp.setAttribute("src", url);
        document.getElementsByTagName("head")[0].appendChild(tmp);
        
        if(getNameBrouser() == 'msie')
            tmp.onreadystatechange = function() {
                if (this.readyState == "loaded" || this.readyState == "complete") {
                    if (js.length > selfCounter)
                        selfJSAdd(js, selfCounter++);
                    else
                        service();        
                }
            }
        else
            tmp.onload = function() {
                if (js.length > selfCounter)
                    selfJSAdd(js, selfCounter++);
                else
                    service();    
            };
    };
    var service = function() {
        if (options.holdOnReady && window.jQuery && jQuery.fn && jQuery.extend && !nojQuery.queueed) {
            if(nativeHolded) jQuery.holdReady(false);
            nojQuery.unqueue();
            nojQuery.queueed = true;
        }    
    };
    var css = [];
    var js = [];
    var getURL = function(url, callback, counter) {
        var loadProcess = new getXmlHttp();
        loadProcess.onreadystatechange = function() {
            if (loadProcess.readyState == 4) {
                /*css execute*/
                var clear_url = url.split('?');
                var file_type = clear_url[0].slice(-3,url.length);
                if (file_type == "css")
                    css[counter] = url;
                /*js execute*/
                var file_type = url.slice(-2,url.length);
                if (file_type == "js")
                    js[counter] = url;
                if (typeof callback === 'function')
                    callback();
                options.stepReady(counter, url);
                innerCounter++;
                if (innerCounter == options.load.length) {
                    if (typeof options.complete === 'function') {
                        options.complete();
                    }    
                    for(var i in css)
                    {
                        var tmp = document.createElement("link");
                        tmp.setAttribute("rel", "stylesheet");
                        tmp.setAttribute("type", "text/css");
                        tmp.setAttribute("href", css[i]);
                        document.getElementsByTagName("head")[0].appendChild(tmp);
                    }
                    if (js.length)
                        selfJSAdd(js,0);
                }
            }
        };
        loadProcess.open('GET', options.load[item], true); 
        loadProcess.send(null);  // отослать запрос
    };
    var options = extend({
        load: [],
        onInit: function() {

        },
        callback: {},
        complete: function(e) {
            
        },
        stepReady: function(step, url) {

        },
        holdOnReady: true
    }, options);
    var loadProcess = [];
    

    if (!options.load.length)
     return false;


    var innerCounter = 0;
    var sortOrder = 0;
    options.onInit();
    for (var item in options.load) {
        if (typeof item == "string") 
            getURL(options.load[item], options.callback[item],sortOrder++);
    }
}; 

 
