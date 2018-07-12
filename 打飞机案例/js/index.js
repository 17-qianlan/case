
(function (){
    window.onload = function(){
        let oWrap = document.querySelector("#wrap"),
            aList = document.querySelectorAll("section"),
            aSelcte = aList[0].querySelectorAll("div"),
            aTotal = aList[1].querySelector("span"),
            aBtn = aList[1].querySelectorAll("button"),
            oEnemy = aList[2].querySelector(".enemy"),
            oOUr = aList[2].querySelector(".our"),
            oBullet = aList[2].querySelector(".bullet"),
            oCount = aList[2].querySelector(".count");
        //生成敌军
        let arr = [600,500,350,250];//控制敌军生成速度
        function enemy(index,myPlane){
            myPlane.timer = setInterval(function(){
                let enemyImg = new Image();
                let MaxT = oWrap.offsetHeight - oOUr.offsetHeight;
                enemyImg.src = "./images/enemy.png";
                enemyImg.width = 22;
                enemyImg.height = 30;
                enemyImg.style.top = 0;
                enemyImg.style.left = Math.random()*(-30+284) + "px";
                oEnemy.appendChild(enemyImg);
                let speed = Math.ceil(Math.random()*(1+3));
                enemyRun();
                function enemyRun(){
                    enemyImg.style.top = enemyImg.offsetTop + speed + "px";
                    if( enemyImg.offsetTop >= MaxT ){
                        oEnemy.removeChild(enemyImg);//移出超出的敌机
                    }else{
                        let aBullet = oBullet.querySelectorAll("img");
                        //子弹和敌军
                        for( let i=0;i<aBullet.length;i++ ){
                            const n = aBullet[i];
                            if( isCollision(n,enemyImg) ){
                                cancelAnimationFrame(n.timer);
                                boom(enemyImg,0);
                                oBullet.removeChild(n);
                                oEnemy.removeChild(enemyImg);
                                oCount.innerHTML = oCount.innerHTML * 1 + 1;
                                return false;
                            }
                        }
                        //敌军和我方飞机
                        if( myPlane.parentNode && isCollision(oOUr,enemyImg) ){
                            document.onmousemove = null;
                            clearInterval(myPlane.timer);
                            clearInterval(timer);
                            boom(myPlane,1);
                            boom(enemyImg,0);
                            oEnemy.removeChild(enemyImg);
                            oOUr.removeChild(oOUr.children[0]);
                            setTimeout(function(){
                                aList[2].style.display = "none";
                                aList[1].style.display = "block";
                                aTotal.innerHTML = oCount.innerHTML;
                            },800);
                            return false;
                        }
                        myPlane.parentNode && requestAnimationFrame(enemyRun);
                    }
                }
            },arr[index]);
        }
        //生成我方飞机和子弹
        let timer;
        function plane(e,index,obj){
            let planeImg = new Image();
            let init_Y = e.pageY - getOffset(obj).top - obj.offsetHeight/2,
                init_X = e.pageX - getOffset(obj).left - obj.offsetWidth/2;
            planeImg.src = "./images/plane.png";
            oOUr.appendChild(planeImg);
            oOUr.style.cssText = "top:"+ init_Y + "px;left:"+ init_X + "px;";
            let MaxL = oWrap.offsetWidth - obj.offsetWidth*3/5,
                MaxT = oWrap.offsetHeight - obj.offsetHeight,
                MinL = -obj.offsetWidth/2;
            let init_y = e.clientY,
                init_x = e.clientX,
                t = obj.offsetTop,
                l = obj.offsetLeft;
            document.onmousemove = function(e){
                let run_y = e.pageY - init_y,
                    run_x = e.pageX - init_x;
                let x = l + run_x,
                    y = t + run_y ;
                x = Math.min(MaxL,x);
                x = Math.max(MinL,x);
                y = Math.min(MaxT,y);
                y = Math.max(0,y);
                oOUr.style.cssText = "top:"+ y + "px;left:"+ x + "px;";
            };
            //生成子弹
            let biuSpeed = [600,500,350,250];
            timer = setInterval(function(){
                let biu = new Image();
                biu.src = "./images/bullet.png";
                biu.width = 6;
                biu.height = 22;
                biu.style.top = obj.offsetTop + "px";
                biu.style.left = obj.offsetLeft + obj.offsetWidth/2 - biu.width/2 + "px";
                oBullet.style.display = "block";
                oBullet.appendChild(biu);
                let speed = 5;
                (function biuRun(){
                    biu.style.top = biu.offsetTop - speed + "px";
                    if( biu.offsetTop <= 0 ){
                        oBullet.removeChild(biu);
                        return false;
                    }else{
                        biu.timer = requestAnimationFrame(biuRun);
                    }
                })();
            },biuSpeed[index]);
            return planeImg;
        }
        //样式获取
        function getStyle(obj,attr){
            return window.getComputedStyle?getComputedStyle(obj)[attr] : obj.currentStyle[attr];
        }
        //碰撞检测
        function isCollision(obj,enemy){
            let T1 = parseFloat(getStyle(obj,"top")),
                L1 = parseFloat(getStyle(obj,"left")),
                R1 = L1 + parseFloat(getStyle(obj,"width")),
                B1 = T1 + parseFloat(getStyle(obj,"height"));
            let T2 = parseFloat(getStyle(enemy,"top")),
                L2 = parseFloat(getStyle(enemy,"left")),
                R2 = L2 + parseFloat(getStyle(enemy,"width")),
                B2 = T2 + parseFloat(getStyle(enemy,"height"));
            return !( T1 > B2 || L1 > R2 || B1 < T2 || R1 < L2 );
        }
        //Boom特效
        function boom(obj,n){
            let imgSrc = n===0?"./images/boom.png":"./images/boom2.png";
            let duration = n === 0 ? 300 : 800;
            let boomImg = new Image();
            boomImg.src = imgSrc;
            boomImg.width = obj.width;
            boomImg.height = obj.height;
            boomImg.style.cssText = "top:" + obj.offsetTop +"px;left:" + obj.offsetLeft + "px;";
            obj.parentNode.appendChild(boomImg);
            setTimeout(function(){
                boomImg.parentNode && boomImg.parentNode.removeChild(boomImg);
            },duration);
        }
        //执行初始函数
        function start(e,index,obj){
            let myPlane = plane(e,index,obj);
            enemy(index,myPlane);
        }
        //列表点击事件
        for( let i=0;i<aSelcte.length;i++ ){
            aSelcte[i].index = i;
            aSelcte[i].onclick = function(e){
                aList[0].style.display = aList[1].style.display= "none";
                aList[2].style.display= "block";
                aTotal.innerHTML = oCount.innerHTML = 0;
                start(e,this.index,oOUr);
            };
        }
        //重新开始
        aBtn[0].onclick = function(){
            aList[0].style.display = "block";
            aList[1].style.display = "none";
            aList[2].style.display = "none";
            oOUr.style.cssText = "left:0;top:0;";
            oEnemy.innerHTML = oBullet.innerHTML = "";
        };
        function getOffset(ele){
            let obj = {
                top : 0,
                left : 0
            };
            while( ele !== document.body ){
                obj.top += ele.offsetTop + ele.offsetParent.clientTop;
                obj.left += ele.offsetLeft + ele.offsetParent.clientLeft;
                ele = ele.offsetParent;
            }
            return obj;
        }
    }
})();