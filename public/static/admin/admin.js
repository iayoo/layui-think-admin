layui.extend({
    setting:'setting'
}).define(['element','dropdown','jquery','layer','setting','menu'], function(exports) {
    let element = layui.element; //导航的hover效果、二级菜单等功能，需要依赖element模块
    // let dropdown = layui.dropdown;
    let $ = layui.jquery;
    let layer = layui.layer;
    let menu = layui.menu;

    let admin = {
        curIframeIndex:0,
        open:openPage,
        tabs:[],
        indexPage:null,
        refresh:refresh,
        flexible:flexible,
        popup:popup,
        iframeLoading:iframeLoading,

    };
    admin.indexPage = $('body');
    admin.menu = menu;

    $('.layui-nav-item').off("mouseover");
    /**
     * 刷新iframe
     */
    function refresh (obj) {
        let curIframe = $(".layui-tab-content .layui-tab-item").eq(admin.curIframeIndex).find("iframe")[0];
        admin.iframeLoading(1000);
        curIframe.contentWindow.location.reload(true);
    }

    function isMobile() {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            return true
        }
        return false
    }

    function flexible(){
        admin.menu.flexible(isMobile());
        return;
    }

    function popup(obj){
        let url = $(obj).data('href');
        let title = $(obj).text()
        if (url !== ''){
            layer.open({
                type: 2, //类型，解析url
                closeBtn: 1, //关闭按钮是否显示 1显示0不显示
                title: title, //页面标题
                shadeClose: true, //点击遮罩区域是否关闭页面
                shade: 0.8,  //遮罩透明度
                area: ['900px', '500px'],  //弹出层页面比例
                content: url //弹出层的url
            });
        }
    }

    function openPage(url,title,id){
        handleTagChange(id,url,title)
    }

    function iframeLoading(time){
        let loading = "<div class='ia-loading'><div><i class='layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop' style='font-size: 50px'></i></div></div>";
        let tabEl = $(".layui-layout-admin .layui-body .layui-tab-content");
        if (tabEl.children('.ia-loading').length <= 0){
            tabEl.append(loading);
        }
        tabEl.children('.ia-loading').css("display", "flex").fadeIn(100);
        tabEl.attr('height',0)
        if (time !== undefined){
            if (time === 0){
                return;
            }
        }else{
            time = 1000;
        }
        setTimeout(function () {
            tabEl.removeAttr('height')
            tabEl.children('.ia-loading').fadeOut(500);
        },time)
    }

    function handleTagChange(id,href,title){
        let isHasTab = false;
        admin.tabs.map(function (item){
            if (id === item.id){
                element.tabChange('window-tab', id); //切换到：用户管理
                isHasTab = true;
            }
        })
        if (href !== undefined && !isHasTab){
            admin.iframeLoading();
            //新增一个Tab项
            element.tabAdd('window-tab', {
                title: title//用于演示
                ,content:  '<iframe id="' + id + '" data-frameid="' + id + '" frameborder="0" scrolling="auto" src="' +
                    href + '" style="width:100%;height:100%;"></iframe>'
                ,id: id //实际使用一般是规定好的id，这里以时间戳模拟下
            })
            admin.tabs.push({id:id,href:href,title:title})
            element.tabChange('window-tab', id); //切换到：用户管理
        }
    }

    element.on('tabDelete(window-tab)', function(data){
        admin.tabs.splice(data.index,1)
    });

    // 监听事件
    admin.indexPage.on('click', '*[ia-event]', function(){
        let _this = $(this)
            ,attrEvent = _this.attr('ia-event');
        if (admin[attrEvent]){
            admin[attrEvent].call(this, _this);
        }
    })

    //监听tab点击
    element.on('tab(window-tab)', function(data){
        admin.curIframeIndex = data.index
        let lay_id=$(this).attr("lay-id");
        let nav_tree=$(".layui-nav-tree");
        //移除其他选中
        nav_tree.find("a[menu-id]").parent().removeClass("layui-this");
        //选中点击的
        let kv="a[menu-id='"+lay_id+"']";
        let p = nav_tree.find(kv).parents('.layui-nav-item');
        if (!p.hasClass('layui-nav-itemed')){
            p.addClass('layui-nav-itemed')
        }
        nav_tree.find(kv).parent().addClass("layui-this")
    });

    $('#IA_layui_Tdesign > .page-loading').fadeOut(500);

    admin.menu.change = handleTagChange

    exports('admin',admin);
});