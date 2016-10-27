/**
 * Created by Administrator on 2016/9/9.
 */
var EventUtil={
    addHandler:function(elem,type,handler){
        if(elem.addEventListener){
            elem.addEventListener(type,handler,false);
        }else if(elem.attachEvent){
            elem.attachEvent("on"+type,handler);
        }else{
            elem["on"+type]=handler;
        }
    },
    removeHandler:function(elem,type,handler){
        if(elem.removeEventListener){
            elem.removeEventListener(type,handler,false);
        }else if(elem.detachEvent){
            elem.detachEvent("on"+type,handler);
        }else{
            elem["on"+type]=null;
        }
    },
    getEvent:function(event){
        return event ? event :window.event;
    },
    getTarget:function(event){
        return event.target || event.srcElement;
    },
    preventDefault:function(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue=false;
        }
    },
    stopPop:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble=true;
        }
    }
};