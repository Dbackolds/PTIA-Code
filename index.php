<?php
/**
 * 管理系统入口文件
 */

// 启动会话
session_start();

// 检查是否已登录
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // 未登录，重定向到登录页面
    header('Location: /admin/login.php');
    exit;
}

// 已登录，重定向到管理面板
header('Location: dashboard.php');
exit;