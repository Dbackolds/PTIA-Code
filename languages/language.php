<?php
/**
 * 语言处理器
 */

// 开启会话，用于存储语言偏好
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// 引入语言配置
require_once 'config.php';

// 语言切换处理
if (isset($_GET['lang']) && array_key_exists($_GET['lang'], $supported_languages)) {
    $_SESSION['lang'] = $_GET['lang'];
    setcookie('lang', $_GET['lang'], time() + (86400 * 30), "/"); // 30天过期
    
    // 重定向到同一页面，但移除URL中的lang参数
    $redirect_url = strtok($_SERVER['REQUEST_URI'], '?');
    $query = $_GET;
    unset($query['lang']);
    
    if (!empty($query)) {
        $redirect_url .= '?' . http_build_query($query);
    }
    
    header("Location: $redirect_url");
    exit;
}

// 获取当前语言
$current_lang = getCurrentLanguage();

// 加载语言文件
function loadLanguageFile($file) {
    global $current_lang;
    $lang_file = dirname(__FILE__) . "/$current_lang/$file.php";
    
    if (file_exists($lang_file)) {
        return include $lang_file;
    } else {
        // 如果找不到请求的语言文件，则返回空数组
        return [];
    }
}

// 翻译函数
function __($key, $file = 'common', $replacements = []) {
    static $translations = [];
    
    // 如果还没有加载这个文件的翻译，则加载
    if (!isset($translations[$file])) {
        $translations[$file] = loadLanguageFile($file);
    }
    
    // 查找翻译
    $text = isset($translations[$file][$key]) ? $translations[$file][$key] : $key;
    
    // 应用替换
    if (!empty($replacements)) {
        foreach ($replacements as $placeholder => $value) {
            $text = str_replace('{' . $placeholder . '}', $value, $text);
        }
    }
    
    return $text;
}

// 翻译并输出
function _e($key, $file = 'common', $replacements = []) {
    echo __($key, $file, $replacements);
}

// 获取当前语言代码
function getCurrentLangCode() {
    global $current_lang;
    return $current_lang;
}

// 获取HTML语言属性
function getHtmlLang() {
    global $supported_languages, $current_lang;
    return $supported_languages[$current_lang]['locale'];
} 