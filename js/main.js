/*
  1:歌曲搜索接口
    请求地址:https://autumnfish.cn/search
    请求方法:get
    请求参数:keywords(查询关键字)
    响应内容:歌曲搜索结果

  2:歌曲url获取接口
    请求地址:https://autumnfish.cn/song/url
    请求方法:get
    请求参数:id(歌曲id)
    响应内容:歌曲url地址
  3.歌曲详情获取
    请求地址:https://autumnfish.cn/song/detail
    请求方法:get
    请求参数:ids(歌曲id)
    响应内容:歌曲详情(包括封面信息)
  4.热门评论获取
    请求地址:https://autumnfish.cn/comment/hot?type=0
    请求方法:get
    请求参数:id(歌曲id,地址中的type固定为0)
    响应内容:歌曲的热门评论
  5.mv地址获取
    请求地址:https://autumnfish.cn/mv/url
    请求方法:get
    请求参数:id(mvid,为0表示没有mv)
    响应内容:mv的地址
*/

var app = new Vue({
    el: "#player",
    data: {
        query: "李荣浩",
        musicList: [],
        musicUrl: "",
        //歌曲封面
        musicCover: "",
        //歌曲热评
        hotComments: [],
        //播放状态
        isPlaying: false,
        //遮罩层显示状态
        isShow: false,
        //mv地址
        mvUrl: "",
        // 当前歌曲索引
        currentIndex: null,
    },
    mounted() {
        this.searchMusic();
    },
    methods: {
        searchMusic: function() {
            var that = this;
            axios.get("https://autumnfish.cn/search?keywords=" + this.query).then(
                function(response) {
                    // console.log(response);
                    that.musicList = response.data.result.songs;

                },
                function(err) {}
            )
        },

        // 播放歌曲，获取歌曲url，同时获取当前音乐索引
        playMusic: function(musicId, index) {
            // console.log(musicId);
            //调用接口
            this.currentIndex = index;
            var that = this;
            axios.get("https://autumnfish.cn/song/url?id=" + musicId).then(
                function(response) {
                    // console.log(response);
                    // console.log(response.data.data[0].url);
                    that.musicUrl = response.data.data[0].url;
                },
                function(err) {}
            )

            // 歌曲封面展示,更改img的src属性
            axios.get("https://autumnfish.cn/song/detail?ids=" + musicId).then(
                function(response) {
                    // console.log(response);
                    // console.log(response.data.songs[0].al.picUrl);
                    that.musicCover = response.data.songs[0].al.picUrl;
                },
                function(err) {}
            )

            //歌曲评论获取
            axios.get("https://autumnfish.cn/comment/hot?type=0&id=" + musicId).then(
                function(response) {
                    // console.log(response);
                    // console.log(response.data.hotComments);
                    that.hotComments = response.data.hotComments;
                },
                function(err) {}
            )
        },

        // 歌曲播放
        play: function() {
            // console.log("play");
            this.isPlaying = true;
        },

        // 歌曲暂停
        pause: function() {
            // console.log("pause");
            this.isPlaying = false;
        },

        //获取当前音乐索引
        // getIndex: function(index) {
        // this.currentIndex = index;
        // console.log(this.currentIndex);
        // },

        //上一曲
        before: function() {
            if (this.currentIndex === 0) {
                this.currentIndex = this.musicList.length - 1;
            } else {
                this.currentIndex--;
            }
            // console.log(this.currentIndex);
            this.playMusic(this.musicList[this.currentIndex].id);
        },

        //下一首
        next: function() {
            if (this.currentIndex === this.musicList.length - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            // console.log(this.currentIndex);
            this.playMusic(this.musicList[this.currentIndex].id);
        },

        //播放mv
        playMV: function(mvid) {
            var that = this;
            axios.get("https://autumnfish.cn/mv/url?id=" + mvid).then(
                function(response) {
                    // console.log(response.data.data.url);
                    that.isShow = true;
                    that.mvUrl = response.data.data.url;
                },
                function(err) {}
            )
        },

        //隐藏遮罩层
        hide: function() {
            this.isShow = false;
        }
    }
})