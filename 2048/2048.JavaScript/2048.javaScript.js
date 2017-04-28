var game={
    data:null,//保存2048游戏所有格子数字的二维数组
    RN:4, CN:4, //总行数和总列数
    score:0,//得分
    status:1,//游戏状态
    GAMEOVER:0,//专门表示游戏结束状态
    RUNNING:1,//专门表示游戏运行状态
    start:function(){//启动游戏
        //this->game
        this.status=this.RUNNING;
        this.score=0;//重置得分为0
        //生成RN行*CN列的二维数组
        this.data=[];//先创建空数组
        for(var r=0;r<this.RN;r++){//外层循环遍历行
            this.data[r]=[];//每遍历一行就添加一个空数组
            //内层循环遍历行中的格
            for(var c=0;c<this.CN;c++){
                //每遍历一格，就向当前行中添加元素0
                this.data[r][c]=0;
            }
        }
        //在两个位置生成2或4
        this.randomNum();this.randomNum();
        this.updateView();//将data中的数据更新到页面
//事件: 浏览器自动触发或用户手动触发的页面状态改变
        //事件发生时，都会自动触发一个事件处理函数来响应
//如何:
        //让网页，当键盘按下时，自动执行function
        document.onkeydown=function(e){
            //this->document
            switch(e.keyCode){//判断按键号
                case 37: this.moveLeft(); break;//是37
                case 38: this.moveUp(); break; //是38
                case 39: this.moveRight(); break; //是39
                case 40: this.moveDown(); break; //是40
            }
        }.bind(this);//用start中正确的this->game代替函数中不想要的this
    },
    randomNum:function(){//在随机的一个空位置生成2或4
        while(true){
            //在0~RN-1随机生成行号r
            var r=Math.floor(Math.random()*this.RN);
            //在0~CN-1随机生成列号c
            var c=Math.floor(Math.random()*this.CN);
            //如果data中r行c列为0
            if(this.data[r][c]==0){
                //在data中r行c列的位置保存一个2或4
                this.data[r][c]=Math.random()<0.5?2:4;
                break;//退出循环
            }
        }
    },
    updateView:function(){//将data中数据更新到页面的对应div中
        for(var r=0;r<this.RN;r++){//遍历data
            for(var c=0;c<this.CN;c++){
                //查找id为"c"+r+c的div
                var div=document.getElementById("c"+r+c);
                //如果当前元素不是0
                if(this.data[r][c]!=0){
                    //设置div的内容为data中r行c列的值
                    div.innerHTML=this.data[r][c];
                    //修改div的class属性为cell n+当前值
                    div.className="cell n"+this.data[r][c];
                }else{//否则
                    div.innerHTML="";//清空div内容
                    div.className="cell";//重置div样式为cell
                }
            }
        }
        //找到id为score的span，设置其内容为score
        document.getElementById("score")
            .innerHTML=this.score;
        //查找id为gameover的div
        var div=document.getElementById("gameover");
        if(this.status==this.GAMEOVER){//如果游戏结束:
            //设置id为final的span为score
            document.getElementById("final")
                .innerHTML=this.score;
            div.style.display="block";//显示gameover div
        }else{//否则
            div.style.display="none";//隐藏gameover div
        }
    },
    isGameOver:function(){//专门判断游戏是否结束
        //遍历data中每个元素
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                if(this.data[r][c]==0)//如果当前元素是0
                    return false;//就返回false
                //如果c<CN-1&&当前元素等于右侧元素
                if(c<this.CN-1
                    &&this.data[r][c]==this.data[r][c+1])
                    return false;//就返回false
                //如果r<RN-1&&当前元素等于下方元素
                if(r<this.RN-1
                    &&this.data[r][c]==this.data[r+1][c])
                    return false;//就返回false
            }
        }//(遍历结束)
        return true;//就返回true
    },
    moveLeft:function(){//左移所有行
        var before=String(this.data);//移动前为数组拍照
        for(var r=0;r<this.RN;r++){//遍历data中每一行
            this.moveLeftInRow(r);//左移第r行
        }
        var after=String(this.data);//移动后为数组拍照
        if(before!=after){//如果发生了移动
            this.randomNum();//随机生成数
            if(this.isGameOver())//如果游戏结束
            //就设置游戏状态为GAMEOVER
                this.status=this.GAMEOVER;
            this.updateView();//更新页面
        }
    },
    moveLeftInRow:function(r){//仅左移第r行
        //c从0开始，到<CN-1结束,遍历r行中每个格
        for(var c=0;c<this.CN-1;c++){
            //查找r行c位置后下一个不为0的位置nextc
            var nextc=this.getNextInRow(r,c);
            if(nextc!=-1){//如果找到
                if(this.data[r][c]==0){//如果c位置的值等于0
                    //用nextc位置的值代替c位置的值
                    this.data[r][c]=this.data[r][nextc];
                    //将nextc位置的值置为0
                    this.data[r][nextc]=0;
                    c--;//c留在原地
                }else if(//否则,如果c位置的值等于nextc位置值
                this.data[r][c]==this.data[r][nextc]){
                    this.data[r][c]*=2;//c位置的值*2
                    this.score+=this.data[r][c];
                    this.data[r][nextc]=0;//nextc位置的值置为0
                }
            }else break;//否则，没找到，就退出循环
        }
    },
    getNextInRow:function(r,c){//查找r行c列右侧下一个不为0位置
        //i从c+1开始，到<CN结束
        for(var i=c+1;i<this.CN;i++){
            //如果r行i列的值不是0,就返回i
            if(this.data[r][i]!=0) return i;
        }//(遍历结束)就返回-1
        return -1;
    },
    moveRight:function(){//右移所有行
        var before=String(this.data);//移动前为数组拍照
        for(var r=0;r<this.RN;r++){//遍历data中每一行
            this.moveRightInRow(r);//右移第r行
        }
        var after=String(this.data);//移动后为数组拍照
        if(before!=after){//如果发生了移动
            this.randomNum();//随机生成数
            if(this.isGameOver())//如果游戏结束
            //就设置游戏状态为GAMEOVER
                this.status=this.GAMEOVER;
            this.updateView();//更新页面
        }
    },
    moveRightInRow:function(r){//仅右移第r行
        //c从CN-1开始，到>0结束,反向遍历r行中每个格
        for(var c=this.CN-1;c>0;c--){
            //查找r行c位置前一个不为0的位置prevc
            var prevc=this.getPrevInRow(r,c);
            if(prevc!=-1){//如果找到
                if(this.data[r][c]==0){//如果c位置的值等于0
                    //用nextc位置的值代替c位置的值
                    this.data[r][c]=this.data[r][prevc];
                    //将nextc位置的值置为0
                    this.data[r][prevc]=0;
                    c++;//c留在原地
                }else if(//否则,如果c位置的值等于nextc位置值
                this.data[r][c]==this.data[r][prevc]){
                    this.data[r][c]*=2;//c位置的值*2
                    this.score+=this.data[r][c];
                    this.data[r][prevc]=0;//nextc位置的值置为0
                }
            }else break;//否则，没找到，就退出循环
        }
    },
    getPrevInRow:function(r,c){//查找r行c列左侧前一个不为0位置
        //i从c-1开始，到>=0结束, 反向遍历r行每个格
        for(var i=c-1;i>=0;i--){
            //如果r行i列的值不是0,就返回i
            if(this.data[r][i]!=0) return i;
        }//(遍历结束)就返回-1
        return -1;
    },
    moveUp:function(){//上移所有行
        var before=String(this.data);//移动前为数组拍照
        for(var c=0;c<this.CN;c++){//遍历data中每一列
            this.moveUpInCol(c);//上移第c列
        }
        var after=String(this.data);//移动后为数组拍照
        if(before!=after){//如果发生了移动
            this.randomNum();//随机生成数
            if(this.isGameOver())//如果游戏结束
            //就设置游戏状态为GAMEOVER
                this.status=this.GAMEOVER;
            this.updateView();//更新页面
        }
    },
    moveUpInCol:function(c){//仅上移第c列
        //r从0开始，到<RN-1结束,遍历c列中每一行
        for(var r=0;r<this.RN-1;r++){
            //查找c列r行下方下一个不为0的位置nextr
            var nextr=this.getNextInCol(r,c);
            if(nextr!=-1){//如果找到
                if(this.data[r][c]==0){//如果c位置的值等于0
                    //用nextr位置的值代替c位置的值
                    this.data[r][c]=this.data[nextr][c];
                    //将nextr位置的值置为0
                    this.data[nextr][c]=0;
                    r--;//r留在原地
                }else if(//否则,如果r位置值等于nextr位置值
                this.data[r][c]==this.data[nextr][c]){
                    this.data[r][c]*=2;//r位置的值*2
                    this.score+=this.data[r][c];
                    this.data[nextr][c]=0;//nextr位置的值归0
                }
            }else break;//否则，没找到，就退出循环
        }
    },
    getNextInCol:function(r,c){//查找c列r行下方下一个不为0位置
        //i从r+1开始，到<RN结束
        for(var i=r+1;i<this.RN;i++){
            //如果c列i行的值不是0,就返回i
            if(this.data[i][c]!=0) return i;
        }//(遍历结束)就返回-1
        return -1;
    },
    moveDown:function(){//下移所有行
        var before=String(this.data);//移动前为数组拍照
        for(var c=0;c<this.CN;c++){//遍历data中每一列
            this.moveDownInCol(c);//下移第c列
        }
        var after=String(this.data);//移动后为数组拍照
        if(before!=after){//如果发生了移动
            this.randomNum();//随机生成数
            if(this.isGameOver())//如果游戏结束
            //就设置游戏状态为GAMEOVER
                this.status=this.GAMEOVER;
            this.updateView();//更新页面
        }
    },
    moveDownInCol:function(c){//仅上移第c列
        //r从RN-1开始，到>0结束,反向遍历c列中每一行
        for(var r=this.RN-1;r>0;r--){
            //查找c列r行上方前一个不为0的位置prevr
            var prevr=this.getPrevInCol(r,c);
            if(prevr!=-1){//如果找到
                if(this.data[r][c]==0){//如果c位置的值等于0
                    //用prevr位置的值代替c位置的值
                    this.data[r][c]=this.data[prevr][c];
                    //将prevr位置的值置为0
                    this.data[prevr][c]=0;
                    r++;//r留在原地
                }else if(//否则,如果r位置值等于prevr位置值
                this.data[r][c]==this.data[prevr][c]){
                    this.data[r][c]*=2;//r位置的值*2
                    this.score+=this.data[r][c];
                    this.data[prevr][c]=0;//prevr位置的值归0
                }
            }else break;//否则，没找到，就退出循环
        }
    },
    getPrevInCol:function(r,c){//查找c列r行下方下一个不为0位置
        //i从r-1开始，到>=0结束
        for(var i=r-1;i>=0;i--){
            //如果c列i行的值不是0,就返回i
            if(this.data[i][c]!=0) return i;
        }//(遍历结束)就返回-1
        return -1;
    },
}
game.start();//启动游戏
