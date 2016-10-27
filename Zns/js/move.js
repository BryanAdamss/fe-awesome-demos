// 任意值运动框架
function getStyle(obj, name) {
    if (obj.currentStyle) {
        return obj.currentStyle[name];
    } else {
        return getComputedStyle(obj, false)[name];
    }
}

function startMove(obj, attr, iTarget) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var cur = 0;
        // 透明度特殊处理
        if (attr === "opacity") {
            // 小数存在误差,所以选择四舍五入
            cur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
        } else {
            cur = parseInt(getStyle(obj, attr));
        }
        var speed = (iTarget - cur) / 6;
        // 缓冲运动速度需取整
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        if (cur === iTarget) {
            clearInterval(obj.timer);
        } else {
            // 透明度样式需要特殊处理
            if (attr === "opacity") {
                obj.style.filter = "alpha(opacity:" + (cur + speed) + ")";
                obj.style.opacity = (cur + speed) / 100;
            } else {
                obj.style[attr] = cur + speed + "px";
            }
        }
    }, 30);
}
