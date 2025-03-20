$(document).ready(function() {
    // 初始化WOW.js动画
    new WOW().init();
    
    // 初始化AOS动画库
    AOS.init({
        duration: 1000,
        once: true,
        offset: 120
    });
    
    // 导航栏滚动效果
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });
    
    // 平滑滚动
    $('a.smooth-scroll').click(function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });
    
    // 轮播图自动播放设置
    $('.carousel').carousel({
        interval: 5000
    });
    
    // 团队成员悬停效果
    $('.team-member').hover(
        function() {
            $(this).find('.social-icons').slideDown();
        },
        function() {
            $(this).find('.social-icons').slideUp();
        }
    );
    
    // 发展历程时间轴动画增强
    $('.timeline-item').each(function(index) {
        $(this).attr('data-wow-delay', (0.1 * (index + 1)) + 's');
    });
    
    // 初始化时间轴交互效果
    $('.timeline-badge').on('mouseenter', function() {
        $(this).parent('.timeline-item').find('.timeline-content').addClass('content-highlight');
    }).on('mouseleave', function() {
        $(this).parent('.timeline-item').find('.timeline-content').removeClass('content-highlight');
    });
    
    // 滚动到时间轴部分时触发视差效果
    $(window).scroll(function() {
        var scrollTop = $(window).scrollTop();
        var historySection = $('.history-section');
        
        if (historySection.length) {
            var sectionTop = historySection.offset().top;
            var sectionHeight = historySection.height();
            
            if (scrollTop > sectionTop - window.innerHeight && 
                scrollTop < sectionTop + sectionHeight) {
                var translateY = (scrollTop - sectionTop + window.innerHeight) * 0.05;
                historySection.find('.timeline::after').css('height', translateY + 'px');
            }
        }
    });
}); 