;(function () {
  var $add_task = $(".add-task"),//form
      $task_list = $(".task-list"),//ul
    task_list = [];//列表

    init();
    //按钮点击
    $add_task.on('submit',function (ev) {
        ev.preventDefault();//取消默认事件

        var obj = {};
        obj.content = $add_task.find(".text").val();//把值传到obj里面
        // console.log(obj);

        if(!obj.content) return;

        add_task_list(obj);//添加数据
        $add_task.find(".text").val(null);//提交后清空文本
        renewHtml();
    });
    //把数值传到浏览器
    function add_task_list(obj) {
        task_list.push(obj);
        store.set('task',task_list);
    }
    //初始化
    function init() {
        task_list = store.get('task') || [];
        renewHtml();
    }
    //更新html
    function renewHtml() {
        $task_list.html(null);

        var is_complateArr = [];//新建一个数组把选中的放进去

        for(var i = 0; i < task_list.length; i++)
        {
            if(task_list[i].complate)
            {
                is_complateArr[i] = task_list[i];//选中当前项等于新建数组
            }
            else
            {
                var $item = createHtml(i,task_list[i]);
                $task_list.prepend($item);
            }
        }

        for(var j = 0; j < is_complateArr.length; j++)
        {
            var $item01 = createHtml(j,is_complateArr[j]);
            if(!$item01) continue;
            $task_list.append($item01);
            $item01.addClass("unline");
        }

        var $delete=$(".delete.r-main");//删除
        var $complate = $(".task-list .complate");//复选框
        // console.log($delete);
        delete_event($delete);//删除事件
        deteal_event();//详细事件
        is_complate($complate);//选中事件

    }
    //生成html
    function createHtml(index,data) {
        if(!data) return;
        var str = '<li data-index="'+index+'">'+
            '<input type="checkbox" '+(data.complate?"checked":"")+' class="complate">'+
            '<p class="content">'+data.content+'</p>'+
            '<div class="right">'+
            '<span class="delete r-main">删除</span>'+
            '<span class="deteal r-main">详细</span>'+
            '</div>'+
            '</li>';
        return $(str);
    }
    //删除
    function delete_event($delete) {
        $delete.on('click',function () {
            var index = $(this).parent().parent().data("index");
            // console.log(index);
            delete_alert(index);//弹窗
        })
    }
    //删除弹窗
    function delete_alert(index) {
        // var off = confirm("你确定删除吗？");
        // if (!off) return;
        $(".Alert").show();
        $(".primary.confirm").bind('click',function () {
            // delete task_list[index];
            task_list.splice(index,1);
            $(".Alert").hide();
            delete_up_data();//splice
            renewHtml();
        });
        $(".cancel").click(function () {
            $(".Alert").hide();
        })
    }
    //更新数据
    function delete_up_data() {
        store.set("task",task_list);
    }
    //详细列表——————————————————————————————
    function deteal_event() {
        $(".deteal.r-main").on("click",function () {
            var index = $(this).parent().parent().data("index");
            var $item = deteal_create_html(task_list[index]);//生成html
            $task_list.after($item);//插入html

            up_deteal_data(index);//详细列表，提交数据调用
            db_click();//双击事件
            dataTime();//日期插件

            $(".task-detail-mask,.colse").click(function () {
                $(".task-detail").remove();//删除详细框
                $(".task-detail-mask").remove();//删除遮罩层
            })
        })
    }

    //生成html
    function deteal_create_html(data) {
        var str = '<div class="task-detail-mask"></div>'+
            '<div class="task-detail">'+
            '<form class="up-task">'+
            '<h2 class="content">'+data.content+'</h2>'+
            '<div class="input-item">'+
            '<input type="text" id="dbText" class="dbText">'+
            '</div>'+
            '<div class="input-item">'+
            '<textarea>'+(data.dsk || "")+'</textarea>'+
            '</div>'+
            '<div class="remind input-item">'+
            '<label for="b">提醒时间</label>'+
            '<input id="b" class="datetime" type="text" value="'+(data.time || '')+'">'+
            '</div>'+
            '<div class="input-item">'+
            '<button>更新</button>'+
            '</div>'+
            '<div class="colse">X</div>'+
            '</form>'+
            '</div>';
        return str;
    }

    //双击生成
    function db_click() {
        var $dbH = $(".task-detail .up-task .content");
        $dbH.dblclick(function () {
            var $dbText = $("#dbText");
            $dbH.hide();
            $dbText.show();
            $dbText.focus();

            $dbText.blur(function () {
                $dbText.hide();
                $dbH.show();
                if(!$dbText.val())
                    return;
                else
                    $dbH.text($dbText.val())
            })
        })
    }

    //详细列表提交数据
    function up_deteal_data(index) {
        var $upTask = $(".task-detail .up-task");
        $upTask.on('submit',function (ev) {
            ev.preventDefault();//取消默认事件

            //创建新的对象并且放进去
            var newObj = {};
            newObj.content = $upTask.find(".content").text();
            newObj.dsk = $upTask.find(".input-item textarea").val();
            newObj.time = $upTask.find(".remind .datetime").val();

            up_data(newObj,index);
            time_remind();//时间到了，提醒事件
        })
    }

    //把新建的数据放进浏览器
    function up_data(newObj,index) {
        task_list[index] = $.extend({},task_list[index],newObj);
        store.set("task",task_list);
        renewHtml();
    }

    //复选框选中事件
    function is_complate($complate) {
        $complate.on("click",function () {
            //在数据里添加complate
            var index = $(this).parent().data("index");
            if(task_list[index].complate)
            {
                up_data({complate:false},index);
            }
            else
            {
                up_data({complate:true},index);
            }
        })
    }

    //日期插件
    function dataTime() {
        $.datetimepicker.setLocale('ch');//设置中文
        $('.datetime').datetimepicker({
            yearStart:2016,     //设置最小年份
            yearEnd:2018,        //设置最大年份
            //timepicker:false,    //关闭时间选项
        });
    }

    // time_remind();
    //时间到了，提醒事件
    function time_remind() {
        //1.获取最新的时间 cur_time
        //2，获取结束时间（更新的时间） end_time
        //if(end_time - cur_time < 1) 播放音乐
        var time = null;

            time = setInterval(function () {
                var cur_time = new Date().getTime();//获取最新的时间
                /*动态获取结束时间*/
                for(var i = 0; i < task_list.length; i++)
                {
                    /*如果时间为空或者已经被选取则跳过*/
                    if(!task_list[i].time || task_list[i].complate || task_list[i].off) continue;
                    var end_time=(new Date(task_list[i].time)).getTime();//获取结束时间（更新的时间）
                    if(end_time - cur_time < 1)
                    {
                        // console.log(1);
                        //弹出提示框
                        meg_show(task_list[i].content);
                        //在数据里添加off
                        up_data({off:true},i);
                        //关闭定时器
                        clearInterval(time);
                        //播放音乐
                        play_music();

                    }
                }
            },1000)

    }

    //播放音乐
    function play_music() {

        var music = document.querySelector(".music_yousa");
        music.play();
    }
    //弹出提示框
    function meg_show(content) {
        $(".msg").show();
        $(".msg-content").text(content);
        $(".msg-konw").on("click",function () {
            $(".msg").hide();
            // time_remind();
        });

    }

    store.clear();
}())