<?php
/**
 * 语言配置文件
 */

// 定义支持的语言
$supported_languages = [
    'zh' => [
        'code' => 'zh',
        'name' => '中文',
        'locale' => 'zh_CN',
        'letter' => '中'
    ],
    'en' => [
        'code' => 'en',
        'name' => 'English',
        'locale' => 'en_US',
        'letter' => 'EN'
    ]
];

// 默认语言
$default_language = 'zh';

// 获取当前语言
function getCurrentLanguage() {
    global $supported_languages, $default_language;
    
    // 检查是否有语言会话变量
    if (isset($_SESSION['lang']) && array_key_exists($_SESSION['lang'], $supported_languages)) {
        return $_SESSION['lang'];
    }
    
    // 检查Cookie中是否有语言设置
    if (isset($_COOKIE['lang']) && array_key_exists($_COOKIE['lang'], $supported_languages)) {
        return $_COOKIE['lang'];
    }
    
    // 检查浏览器语言偏好
    if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
        $browser_lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
        if (array_key_exists($browser_lang, $supported_languages)) {
            return $browser_lang;
        }
    }
    
    // 返回默认语言
    return $default_language;
} 