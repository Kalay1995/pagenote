

const IS_TOUCH = 'ontouchstart' in window,
//TODO 优化移动设备
 getXY = IS_TOUCH
? e => {
const touch = e.touches[0] || e.changedTouches[0]
return touch ? {
    x: touch.pageX,
    y: touch.pageY
} : { x: 0, y: 0 }
}
: e => {
   var e = event || window.event;
   var x = e.pageX || e.clientX + getScroll().x;
   var y = e.pageY || e.clientY + getScroll().y;
   return { 'x': x, 'y': y };
},

hightLightElement = function (element,text,hightlight=true){
    if(!element || !text){
        return
    }
    const highlightElements = element.querySelectorAll("b[data-highlight='easyshare']")
    //还原高亮，即便是高亮 也要先还原高亮
    for(let i=0; i<highlightElements.length; i++){
        const ele = highlightElements[i],originText = ele.dataset['origintext']
        //如果是其他步骤高亮的则不还原
        if(originText!=text){
            continue;
        }
        ele.outerHTML = originText
    }
    // 如果是还原 则不进行之后操作
    if(!hightlight){
        element.classList.remove("easyshare_highlight")
        return
    }
    
    //高亮
    const left = '<b data-highlight="easyshare" data-origintext="'+text+'" style="color:red">',
        right = '</b>',
        replaceWhat = ">.*?"+text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')+".*?<",
        finder = new RegExp(replaceWhat, 'g');

    // 存在错误的情况，元素属性中包含使用引号值中包含 <> 符号 时
    element.outerHTML = element.outerHTML.replace(finder,function(matched){
        return matched.replace(text,left+text+right)
    })
    element.classList.add("easyshare_highlight")
    //TODO 增加背景突显动画
}


const gotoPosition = function(targetX=0,targetY=0,callback){
    const timer = setInterval(function () {
        //移动前
        const { x:beforeScrollLeft,y:beforeScrollTop} = getScroll();
        const distanceX = targetX - beforeScrollLeft
        , distanceY =  targetY - beforeScrollTop
        
        //移动后
        setScroll(beforeScrollLeft+Math.floor(distanceX/6),Math.floor(beforeScrollTop+distanceY/6))
        
        const {x:afterScrollLeft,y:afterScrollTop} = getScroll()
        
        if(beforeScrollTop === afterScrollTop && beforeScrollLeft === afterScrollLeft){
            clearInterval(timer)
            typeof callback === "function" && callback()
        }
    },30)
    return timer
}

const documentTarget = document.documentElement || document.body
function getScroll(){
    var x = window.pageXOffset || documentTarget.scrollLeft || documentTarget.scrollLeft;
    var y = window.pageYOffset || documentTarget.scrollTop || documentTarget.scrollTop;
    return {x,y}
}

function setScroll(x,y){
    documentTarget.scrollLeft = x;
    documentTarget.scrollTop = y;
    window.scrollTo(x,y)
}

function getViewPosition(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();
    return { top: box.top, left: box.left };
}

export {
    gotoPosition,
    getXY,
    hightLightElement,
    getViewPosition
}