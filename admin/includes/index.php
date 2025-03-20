<?php
/**
 * 防止直接访问includes目录
 */

// 重定向到管理面板
header('Location: ../dashboard.php');
exit;
?>