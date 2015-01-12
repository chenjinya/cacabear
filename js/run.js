(function(){
    // for apple touchmove window
    document.addEventListener("touchmove",function(e){
        e.preventDefault();  
    })
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };
      })();
    imgUrl = "http://tieba.baidu.com/tb/zt/weixingame/washbear/img/bear.png";
    lineLink = "https://github.com/chenjinya";
    descContent = '我擦！贴吧熊孩子！';
    shareTitle = '我擦！贴吧熊孩子！';
    appid = '';
    var Game = function(){
        this.constuctor();
        //this.eraseDone();
    };
    Game.prototype={
        x:0,
        y:0,
        timeLimit:300,//计时30秒
        strokeWidth:10,
        restTime:0,
        runTime:0,
        startFlag:false,
        eraserRange:[80, 142, 160, 160],
        imageArray:[
            "img/01.png",
            "img/02.png",
            "img/03.png",
            "img/04.png",
            "img/05.png"

        ],
        imageArrayIndex:0,
        imageStack:[],
        imageStackIndex:0,
        eraseCount:0,
        backgroundColor:[
            [51,204,255],
            [230,238,100],
            [238,136,100],
            [51,204,255],
            [140,189,92],
            [178,108,196],
            [178,108,166]
        ],
        backgroundColorIndex:0,
        canDeal:false,
        constuctor:function(){


            this.stage = $("#gameStage");
            this.timeCounter = $("#leftCounter");
            this.rightCounter = $("#rightCounter")
            this.dialog = $("#dialog");
            this.init();
        },
        init:function(){

            this.fullWindow();
            this.bindEvent();

            this.initDraw();


        },
        fullWindow:function(){
            this.windowWidth = $(document).width();
            this.windowHeight = $(window).height();
            $("#container").width(this.windowWidth).height(this.windowHeight);
            //不能用.width.height，否则比例拉伸
            this.stage[0].width = this.windowWidth;
            this.stage[0].height = this.windowHeight;
            this.strokeWidth = this.windowWidth/30;
           
        },
        bindEvent:function(){
            var self = this;
            this.stage.on("touchstart",function(e){
                //console.warn("touch start")
            }).on("touchmove",function(e){
                var target = e.touches[0];
                self.drawEraserLine(self.x,self.y,target.pageX,target .pageY)
                //self.drawEraserPointer(target .pageX,target .pageY)
                self.x = target.pageX;
                self.y = target.pageY;
                self.restTime =1;


            }).on("touchend",function(e){
                var target = e;
                self.x = target.pageX;
                self.y = target.pageY;
                self.restTime = 0 ;
                //console.warn(e)

            });
			
			
            this.dialog.on("click","#restartGame",function(){
                self.start();
                self.dialog.hide();
				
            }).on("click","#startGame",function(){
                    self.start();
					
                    self.dialog.hide();
            }).on("click","#shareGame",function(){
					
                    shareTimeline()
                }).on("click",".contact",function(){
                
            });

        },
        initDraw:function(){
            this.stage[0].width=0;
            this.stage[0].height = 0;
            this.stage[0].width = this.windowWidth;
            this.stage[0].height = this.windowHeight;
            this.backgroundColorIndex =this.runTime%this.backgroundColor.length;
            this.context = this.stage[0].getContext( '2d' );
            var context = this.context;

            context.clearRect( 0, 0,this.windowWidth, this.windowHeight);

            context.lineJoin="round";//线段链接
            context.lineCap= "round";
           // console.warn(this.windowHeight,this.windowWidth)
            context.fillStyle = "rgb("+this.backgroundColor[this.backgroundColorIndex].join(",")+")";//填充背景色
            context.fillRect( 0, 0,this.windowWidth, this.windowHeight);
            this.initBody();
        },

        initBody:function(){
            var self = this;
            if (this.imageStack.length ==0 ){
                this.loadImg(this.imageArray[0],function(img){
                    self.imageStack.push(img);
                    self.initImage(img)
                    self.imageStackIndex=0;
                    self.timeCounter.html("计时:0");
                    self.infoDialog();

                });

                for(var i =1; i< self.imageArray.length; i++){
                    this.loadImg(self.imageArray[i],function(img){
                        self.imageStack.push(img);

                    });
                }

            }else{
                this.initImage(this.imageStack[this.imageStackIndex]);

            }


        },
        initImage:function(image){
                if(!image){
                    this.imageStackIndex=0;
                    this.initDraw();
                    return;
                }
                var scale = image.width/image.height;
            if(this.windowWidth > this.windowHeight){
                image.height =this.windowHeight-20;
                image.width =image.height*scale;

            }else{
                image.width =this.windowWidth/1 -20;
                image.height =image.width/scale;
            }

                this.image = image;
                this.drawImage(image);
                this.imageStackIndex++
                if(this.imageStackIndex >= this.imageStack.length - 1){
                    this.imageStackIndex ==0;
                }

        },
        loadImg:function(src,callback){
            var image = new Image();
            image.src = src;
            image.onload = function() {

                callback(image);
            }
        },
        drawImage:function(image){
            var self =this;
            var context = this.context;
            var imglocatX = (self.windowWidth-image.width)/2;
            var imglocatY = (self.windowHeight-image.height)/2;
            //console.log(self.windowWidth,imglocatX,image.width)
            self.eraserRange=[imglocatX,imglocatY,image.width,image.height];
            //console.log(self.er)
           // console.log(self.eraserRange)
            context.drawImage(image, imglocatX, imglocatY,image.width, image.height);
           // context.fillRect( 0, 0,this.windowWidth, this.windowHeight);

        },
        drawEraserLine:function(sx,sy,ex,ey){

            var context = this.context;
            context.strokeStyle="rgb("+this.backgroundColor[this.backgroundColorIndex].join(",")+")";//划线颜色
            context.lineWidth=this.strokeWidth*2;
            if( this.restTime == 0){
                context.moveTo(ex,ey);//移动起点

            }
            context.lineTo(ex,ey);
            context.stroke();
        },
        drawEraserPointer:function(x,y){

            var context = this.context;
            context.fillStyle = 'rgb(255,255,255)';
            context.beginPath();
            context.arc( x, y, this.strokeWidth/2, 0, Math.PI * 2, true );
            context.closePath();
            context.fill();
        },
        orEraserAll:function(imgdata){
            return this.orAllClear(imgdata,this.backgroundColor[this.backgroundColorIndex]);

        },
        orOneClear:function(imgdata,colorArray,from,end,faltLimit){

            var colorReduce = 10;//色差
            var faltCount = 0;
            for ( var i =from; i<end; i++ ){
                if( !imgdata.data[i*4]){
                    return 0;
                }
                if(  (Math.abs(imgdata.data[i*4] - colorArray[0]) >colorReduce ) &&  (Math.abs(imgdata.data[i*4+1] -colorArray[1]) >colorReduce )&& (Math.abs(imgdata.data[i*4+2] - colorArray[2]) >colorReduce ) ){
                    faltCount++
                    if (faltCount > faltLimit){
                        return 1;
                    }

                }
            }
            return 0;
        },
        createRandList:function(l){

                var seedArray = [];
                var length = l;
                for(var i=0; i<length; i++){
                    seedArray.push(i);
                }
                for(var i=0; i<length; i++){
                    var tmp = seedArray[i];
                    var j = Math.floor(Math.random()*length);
                    seedArray[i] =seedArray[j];
                    seedArray[j] = tmp;
                }
               return seedArray;
        },
        orAllClear:function(imgdata,color){
            var faltLimit =1;//宽松度
            var length = imgdata.data.length;
            var colorArray = color;
            var lines = length/4;
            var randArray=[];
            var frequnt = 100;//频率
            var orFail =0;
            var index = 0;
            var mulitiple = Math.ceil(lines/frequnt);
            for (var i =0; i<frequnt; i+=2){
                randArray.push([i,i+1]);
            }
            var seed =this.createRandList(randArray.length);
            for (i =0 ; i<randArray.length; i++){
                index = seed[i];
                orFail += this.orOneClear(imgdata,colorArray,mulitiple*randArray[index][0],mulitiple*randArray[index][1],faltLimit);
                if ( orFail !=0){
                    return false;
                }
            }
            return true;
        },
        start:function(){

            this.startFlag = true;

            this.runTime =0;
            this.restTime=0;
            this.eraseCount =0;
            this.canDeal = false;
            this.rightCounter.html("计数:0");
            this.timeCounterGo();
            this.initDraw();
        },
        timeCounterGo:function(){
            var self = this;

            this.timeInterval = setInterval(function(){
                self.runTime++;
                self.timeCounter.html("计时:"+((self.timeLimit-self.runTime)/10).toFixed(1));
                if(self.startFlag){
                    var imgData=self.context.getImageData(self.eraserRange[0],self.eraserRange[1],self.eraserRange[2],self.eraserRange[3]);
                    //console.log(self.eraserRange)
                    if(self.orEraserAll(imgData) ){
                        self.startFlag = false;
                        setTimeout(function(){
                            self.startFlag = true;
                            self.initDraw();
                            self.eraseCount++;
                            self.rightCounter.html("计数:"+self.eraseCount);

                        },200);//延迟出来
                        //console.log(imgData)
                    }
                }

                if( self.runTime >= self.timeLimit){
                    self.eraseDone();
                }

            },100);
        },
        netTooSlow:function(){

            var html = ' <div><p>渣网速</p><p>没有擦掉贴吧熊</p></div>'+
                    '<div class="btn_wrapper"> <div id="shareGame" class="btn">右上角分享</div>'+
                    '<div id="restartGame" class="btn">重新开始</div><p ><a class="contact" href="http://tieba.baidu.com" >百度贴吧，为兴趣而生</a></p>' +
                    '<p><a class="contact" href="http://www.chenjinya.cn" >about</a></p></div>';


            shareTitle = this.runTime/10+'秒内我擦死了'+this.eraseCount+'只贴吧熊孩子';
            this.startFlag = false;
            this.showDialog(html);
        },
        eraseDone:function(num){
            //console.warn("it;s clear")
            //this.context.closePath();
            this.startFlag = false;
            this.timeCounter.html("计时:0")
            clearInterval(this.timeInterval);

            var html = ' <div><p>'+this.runTime/10+'秒内我擦死了'+this.eraseCount+'只贴吧熊孩子！</p>'+'</div>'+
                '<div class="btn_wrapper"> <div id="shareGame" class="btn">右上角分享</div>'+
                '<div id="restartGame" class="btn">重新开始</div><p><a class="contact" href="http://tieba.baidu.com?fr=washbear" >百度贴吧，为兴趣而生</a></p>' +
                '</div>';
            if (this.eraseCount == 0){
                html = ' <div><p>真遗憾</p><p>没有擦死贴吧熊</p></div>'+
                    '<div class="btn_wrapper"> <div id="shareGame" class="btn">右上角分享</div>'+
                    '<div id="restartGame" class="btn">重新开始</div><p ><a class="contact" href="http://tieba.baidu.com?fr=washbear" >百度贴吧，为兴趣而生</a></p>' +
                    '</div>';
            }

            shareTitle = this.runTime/10+'秒内我擦死了'+this.eraseCount+'只贴吧熊孩子';
            this.startFlag = false;
            this.showDialog(html);
        },
        infoDialog:function(){
            var html = ' <div><p>我擦！贴吧熊孩子！</p><p>'+this.timeLimit/10+'秒看你能擦几个？</p></div>'+
                '<div class="btn_wrapper"> <div id="startGame" class="btn">开始</div><div id="shareGame" class="btn">右上角分享</div><p><a class="contact" href="http://tieba.baidu.com?fr=washbear" >百度贴吧，为兴趣而生</a></p>'+
                '</div>';
            this.showDialog(html);
        },
        showDialog:function(html){
            var html =' <div class="dialog_container">'+html+
            '</div>';
            this.dialog.html(html);

            this.dialog.show();
        },
        animate:function(){
            requestAnimationFrame(this.animate);
            //this.draw();

        }
        


    };

    window.Game =new Game();
})();
//=============weixin
    