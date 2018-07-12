var aWrap = document.getElementById("wrap"),
	aArea = aWrap.children[1],
	aUpload = aArea.children[0],
	aFile = aUpload.children[1],
	aDrag = aArea.children[1],
	aInfo = aWrap.children[2],
	aLeft = aInfo.children[0],
	aRight = aInfo.children[1],
	aFile_2= aRight.children[0],
	aBtn = aRight.children[2],
	aEm1 = aLeft.children[0].children[0],
	aEm2 = aLeft.children[1].children[0],
	aSch = aWrap.children[3].children[0];
var val;
var oSize = [],//文件大小
    arrFile = [],//选中的文件
    oCount = [];//共多少个文件
aFile.onchange = aFile_2.onchange =  file;
//获取文件
function file(){
    val = this.value;
    var that = this;
    if( val ){
        if( this.files.length ){
           for( var i=0;i<this.files.length;i++ ){
               (function (i) {
                   var file = that.files.item(i),
                       name = file.name,
                       size = file.size;
                   arrFile.push(file);
                   oCount.push(name);
                   oSize.push(size);
                   readyFile(file);
               })(i)
           }
        }
    }
}
//生成预览
function readyFile(file){
    var blob = new Blob([file]),
        url = window.URL.createObjectURL(blob),
        img = new Image();
    var li = document.createElement("li");
    li.innerHTML = "<img src='"+url+"' width='100%' height='100%'/><p></p>";
    aSch.appendChild(li);
    img.src = url;
    img.onload = function(){
        count();
    }
}
//文件合计
function count() {
    var aLi = document.querySelectorAll("li"),
        aP = document.querySelectorAll("p");
    //满足条件,则清空数组(格式化)
    if( !aLi.length ){
        arrFile = [];
        oSize = [];
        oCount = [];
        aEm1.innerHTML = "0";
        aEm2.innerHTML = "0";
    }
    aEm1.innerHTML = (oSize.length).toFixed(0);
    if( !oSize[0] ){
        aEm2.innerHTML = "0";
    }else{
        aEm2.innerHTML = ((oSize.reduce(function(prev,cur,index,oSize){
            return prev + cur;
        }))/1024/1024).toFixed(2);
    }
    for( var c=0;c<aP.length;c++ ){
        aP[c].innerHTML = oCount[c]+"<i></i>";
    }
    deleteLi();
}
//删除
function deleteLi(){
    var aLi = document.querySelectorAll("li"),
        num = 0;
    for( var d=0;d<aLi.length;d++ ){
        aLi[d].index = d;
        aLi[d].children[1].children[0].onclick = function(){
            //找到每一个li的索引
            num = this.parentNode.parentNode.index;
            aSch.removeChild(aLi[num]);
            arrFile.splice(num,1);
            oCount.splice(num,1);
            oSize.splice(num,1);
            count();
        }
    }
}
//拖拽
var innerArr = ["请拖拽文件至此区域","请释放鼠标"];
aDrag.innerHTML = innerArr[0];
aDrag.ondragenter = function () {
    this.innerHTML = innerArr[1];
};
aDrag.ondragleave = function () {
    this.innerHTML = innerArr[0];
};
aDrag.ondragover = function(e){
    e.preventDefault();
    e.stopPropagation();
};
aDrag.ondrop = function (e) {
    this.innerHTML = innerArr[0];
    e.preventDefault();
    e.stopPropagation();
    for( var f=0;f<e.dataTransfer.files.length;f++ ){
        (function (f) {
            var file = e.dataTransfer.files.item(f),
                size = file.size,
                name = file.name;
            arrFile.push(file);
            oSize.push(size);
            oCount.push(name);
            readyFile(file);
        })(f);
    }
};
aBtn.onclick = function(){
    var aLi = document.querySelectorAll("li");
    if( arrFile.length ){
        aLi.forEach(function(item,l){
            var xhr = new XMLHttpRequest();
            xhr.open("POST","./file.php",true);
            xhr.setRequestHeader("X-Request-Width","XMLHttpRequest");
            xhr.onload = function(){
                alert("恭喜你上传成功");
            };
            var oFormData = new FormData();
            oFormData.append("abc",arrFile[l]);
            xhr.send(oFormData);
        })
    }else{
        alert( "请先选择图片" );
    }
};
/*
* 1 => 把所有的文件存到arrFile数组里边
* */










