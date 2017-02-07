// alert('1');
var fitness_max=98307798622;
var canvas=document.createElement("canvas");
canvas.width=300;
canvas.height=300; 
var ctx=canvas.getContext("2d");

var visiableCanvas=document.getElementById("canvas");
var visiableCtx=visiableCanvas.getContext("2d");
// ctx.beginPath();
// ctx.moveTo(20,20);
// ctx.lineTo(100,20);
// ctx.lineTo(100,100);
// ctx.closePath();
// ctx.strokeStyle = "blue";
// ctx.stroke();
// ctx.fillStyle="#FF0000";
// ctx.globalAlpha=1;
// ctx.fillRect(0,0,150,175);
// ctx.fillStyle="#0000ff";
// ctx.globalAlpha=0.3;
// ctx.fillRect(0,0,100,100)


// 获取像素值
function getPix() {
    var imageData=ctx.getImageData(0,0,100,200);
    // console.log(imageData);
    var data=imageData.data;
    
    // console.log(data[100*4*120],data[100*4*120+1],data[100*4*120+2],data[100*4*120+3]);
}

// 数组[polygon,[[points],[rgbs]],[[],[]]]copy
// 要注意：：数组的引用类型
function clone(MumPolygons) {
    var newPolygons=[];
    for (var index = 0; index < MumPolygons.length; index++) {
        var polygon = MumPolygons[index];
        newPolygons.push([polygon[0].slice(0),polygon[1].slice(0)]);
    }
    return newPolygons;
}

loadImage();
// 导入图片
var rawImageData;
function loadImage() {
    var img=document.getElementById("img");
    var canvas = document.createElement("canvas");
    canvas.width=img.width;
    canvas.height=img.height;
    height=img.height-1;
    width=img.width-1;
    var context = canvas.getContext("2d");
    context.drawImage(img,0,0,300,300);
    rawImageData = context.getImageData(0,0,300,300).data;
    // visiableCtx.putImageData(context.getImageData(0,0,300,300),0,0);
    // console.log(rawImageData);
    // ctx.putImageData(rawImageData,0,0);

    // var img_canvas=document.getElementById("img_canvas");
    // var img_ctx=img_canvas.getContext("2d");
    // img_ctx.drawImage(img,0,0,300,300);
    // rawImageData = img_ctx.getImageData(0,0,300,300);
    // ctx.putImageData(rawImageData,0,0);


}

// 计算适应度值
function fitness(canvasData) {
    var fitness=0;
    // console.log(canvasData);
    var length=canvasData.length;
    for (var index = 0; index < length; index++) {
        if (index % 4 == 3) {
            // alpha
            continue;
        }
        fitness=fitness + Math.pow(canvasData[index]-rawImageData[index],2);
        
    }
    return fitness;
    // for (var y = 0; y < array.length; y++) {
    //     for (var x = 0; x < 300; x++) {
    //         var start=y*300+x*4;
    //         var r = canvasData[start];
    //         var g = canvasData[start + 1];
    //         var b = canvasData[start + 2];
    //         // var a = canvasData[start + 3]; 
    //     }
    // }
}


// 变异Mutation
function ifMutate(p) {
    if (Math.random()<p) {
        mutatenumber+=1;
        return true;
    }
    return false;
}
// 生成随机索引
function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}
// 生成对称与0的随机数
function getBalancedRandom(half) {
    return Math.random()*half*2-half;
}
// 获取满足要求的点0-300
function getCheckedPoint(location) {
    return location<0? 0:location>300? 300:location;
}
// 获取新的点
function getNewPoint(old,step) {
    return getCheckedPoint(old+getBalancedRandom(step));
}
// 获取多个新的点
function getNewPoints(points) {
    var newPoints = [];
    for (var index = 0; index < points.length; index++) {
        var point = points[index];
        newPoints[index]=getNewPoint(point,20);
    }
    return newPoints;
}
// 获取满足要求的颜色
function getCheckedRGBA(rgba) {
    return rgba<0? 0:rgba>255? 255:rgba;
}
// 获取新的RGBA
function getNewRGBA(old,step) {
    return getCheckedRGBA(old+getBalancedRandom(step));
}
// 创建多边形顶点，颜色[[],[]]
function createPolygon() {
    var points=[Math.random()*300,Math.random()*300,Math.random()*300,Math.random()*300,Math.random()*300,Math.random()*300];
    var rgba=[Math.random()*255,Math.random()*255,Math.random()*255,Math.random()*255];
    var polygon=[points,rgba];
    return polygon;
}

////群体变异
var mutatenumber=0; 

function Mutate_Polygons() {
    Mutate_Number();
    for (var index = 0; index < polygons.length; index++) {
        var polygon = polygons[index];
        polygons[index][0]=Mutate_Points(polygon[0]);
        polygons[index][1]=Mutate_RGBA(polygon[1]);
    }
}
// 增删多边形
function Mutate_Number() {
    // 增
    if (ifMutate(p["addpolygon"])) {
        var index=getRandomIndex(polygons.length);
        polygons.splice(index,0,createPolygon());
    }
    // 删
    if (polygons.length>3) {
        if (ifMutate(p["removepolygon"])) {
            var index=getRandomIndex(polygons.length);
            polygons.splice(index,1);
        }
    }
    // 移动
    if (ifMutate(p["movepolygon"])) {
        var index=getRandomIndex(polygons.length);
        var move_polygon=polygons.splice(index,1);
        polygons.splice(getRandomIndex(polygons.length),0,move_polygon[0]);
    }
}
// 顺序
function Mutate_List() {
    
}
//// 个体变异
// 颜色变异rgba
var step_rgba=30;
function Mutate_RGBA(rgba) {
    var newRgba=rgba.slice(0);
    // r
    if (ifMutate(p["rgba"])) {
        newRgba[0]=getNewRGBA(rgba[0],step_rgba);
    }
    // g
    if (ifMutate(p["rgba"])) {
        newRgba[1]=getNewRGBA(rgba[1],step_rgba);
    }
    // b
    if (ifMutate(p["rgba"])) {
        newRgba[2]=getNewRGBA(rgba[2],step_rgba);
    }
    // a
    if (ifMutate(p["rgba"])) {
        // newRgba[3]=getNewRGBA(rgba[3],step_rgba);
        // 0.4-0.7
        newRgba[3]=255*(Math.random()*0.3+0.3);
    }
    return newRgba;
}
// 顶点变异
var step_point=5;

function Mutate_Points(points) {
    var newPoints=points.slice(0);
    // 增加一个顶点
    if (ifMutate(p["addpoint"])) {
        // 新顶点位于两个顶点的中间
        // newPoints.push(getNewPoint(points[0],20),getNewPoint(points[1],20));
        var index=getRandomIndex(points.length / 2 - 1);
        var newPointX=(points[index * 2]+points[index * 2+2])/2;
        var newPointY=(points[index * 2+1]+points[index * 2+3])/2;
        newPoints.splice(index * 2+2,0,newPointX,newPointY);
    }
    // 删除顶点
    if (points.length>6) {
        if (ifMutate(p["removepoint"])) {
            var index=getRandomIndex(points.length/2);
            newPoints.splice(index*2,2);
        }
    }

    // 大范围随机移动一个顶点
    if (ifMutate(p["movepoint_B"])) {
        var number=newPoints.length / 2;
        var index=getRandomIndex(number);
        // var newX=getNewPoint(newPoints[index*2],150);
        // var newY=getNewPoint(newPoints[index*2 + 1],150);
        var newX=getCheckedPoint(Math.random() * 300);
        var newY=getCheckedPoint(Math.random() * 300);
        newPoints.splice(index*2,2,newX,newY);
    }
    // 中等范围移动点
    if (ifMutate(p["movepoint_M"])) {
        var number=newPoints.length / 2;
        var index=getRandomIndex(number);
        var newX=getNewPoint(newPoints[index*2],20);
        var newY=getNewPoint(newPoints[index*2 + 1],20);
        newPoints.splice(index*2,2,newX,newY);
    }
    // 小范围移动point
    if (ifMutate(p["movepoint_S"])) {
        var number=newPoints.length / 2;
        var index=getRandomIndex(number);
        var newX=getNewPoint(newPoints[index*2],3);
        var newY=getNewPoint(newPoints[index*2 + 1],3);
        newPoints.splice(index*2,2,newX,newY);
    }
    return newPoints;
}

// 初始化
var best_fitness=fitness_max;
// copy 一份,js数组为引用类型
var best_polygons;
var iteration=1;
var generation=1;
var height;
var width;
// 设置默认参数
// 尝试使用遗传算法调节参数，取1000次迭代为一个评测周期，评价有用的代数，最后的相似度等参数。
var p={
    "addpolygon":0.00143,
    "removepolygon":0.0008,
    "movepolygon":0.00143,
    "rgba":0.00067,
    "addpoint":0.00067,
    "removepoint":0.00067,
    "movepoint_B":0.00067,
    "movepoint_M":0.00067,
    "movepoint_S":0.00067
};

for (var key in p) {
    if (p.hasOwnProperty(key)) {
        p[key]=p[key]*10;
        
    }
}

// init();
// function init() {
    // 初始化多边形
    initPolygons();
    start();
// }
function start() {
    // iteration+=1;
    // if (iteration==1000) {
    //     alert(generation);
    //     return;
    // }
    console.log("iteration:"+iteration);
    console.log("polygons length:"+polygons.length);
    Mutate_Polygons();
    console.log("mutatenumber:"+mutatenumber);
    if (mutatenumber>0) {
        iteration+=1;
    }
    if (mutatenumber==0) {
        // 循环调用
        setTimeout(function() {
            start();
        }, 0);
        return;
    }
    mutatenumber=0;
    drawPloygons();
    var imageData=ctx.getImageData(0,0,300,300);
    var fit=fitness(imageData.data);
    console.log(fit+"::"+best_fitness);
    if (fit < best_fitness) {
        // 更优时
        best_fitness=fit;
        // best_polygons=polygons.slice(0);
        best_polygons=clone(polygons);
        generation += 1;
        console.log("generation:"+generation);
        visiableCtx.clearRect(0,0,300,300);
        visiableCtx.putImageData(imageData,0,0);
    } else {
        // copy
        // polygons=best_polygons.slice(0);
        polygons=clone(best_polygons);
        console.log("===========");
    }
    // 清空画布
    ctx.clearRect(0,0,300,300);

    // 循环调用
    setTimeout(function() {
        start();
    }, 0);
}

// 初始化多边形
// 先声明，后赋值
// var polygons=[];
var polygons;
function initPolygons() {
    polygons=[createPolygon(),createPolygon(),createPolygon()];
}

// drawPloygon([0,0,120,20,200,100],"#ffffff");
// 绘制多边形
function drawPloygon(polygon) {
    var points=polygon[0];
    // ctx.fillStyle = 'rgba(225,225,225,0.5)';
    var rgba=polygon[1];
    var color="rgba("+Math.floor(rgba[0])+","+Math.floor(rgba[1])+","+Math.floor(rgba[2])+","+rgba[3]/255+")";
    // console.log(color);
    ctx.beginPath();
    ctx.moveTo(points[0],points[1]);
    var length=points.length/2;
    for (var index = 0; index < length; index++) {
        ctx.lineTo(points[index*2],points[index*2 + 1]);
    }
    ctx.closePath();
    ctx.fillStyle=color;
    ctx.fill();
}
// 绘制全部多边形
function drawPloygons() {
    // 绘制白色背景
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,300,300);

    for (var index = 0; index < polygons.length; index++) {
        var element = polygons[index];
        drawPloygon(element);
    }
}



for (var key in p) {
    var P = document.getElementById(key);
    var t_P = document.getElementById("t_"+key);
    P.value=p[key];
    t_P.setAttribute("value", p[key]);
    // 这种设置方式为什么不可以？js的先声明后赋值的特性
    // 使用闭包，或者对象属性的方式解决
    // P.addEventListener("change", (function(t_P,P,param) {
    //     return function () {
    //         t_P.value=P.value;
    //         alert(this.value);

    //         param=P.value;
    //     }
    // })(t_P,P,p[key]), false);
    
    // 保持引用
    P.param=p;
    P.paramkey=key;
    P.t_P=t_P;
    P.addEventListener("change", function() {
        this.t_P.value=this.value;
        this.param[this.paramkey]=this.value;
    }, false);
}
