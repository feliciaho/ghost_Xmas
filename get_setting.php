<?php
@header("Cache-Control:no-cache");
@header("Expires:0");
@header("Pragma:no-cache");
@header("Content-Type:text/html;charset=utf-8");

$_COOKIE_DOMAIN = ".digeam.com";
function __result($code, $msg)
{
    echo json_encode(array('code' => $code, 'msg' => $msg));
    exit;
}

function __GetClientIp()
{
    if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown")) {
        $ip = getenv("HTTP_CLIENT_IP");
    } else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown")) {
        $ip = getenv("HTTP_X_FORWARDED_FOR");
        $ip = explode(',', $ip);
        $ip = $ip[0];
        $ip = trim($ip);
    } else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown")) {
        $ip = getenv("REMOTE_ADDR");
    } else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown")) {
        $ip = $_SERVER['REMOTE_ADDR'];
    } else {
        $ip = "unknown";
    }
    return trim($ip);
}

function __SetPost($url, $data)
{
    $PostData = http_build_query($data);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $PostData);
    $result = curl_exec($ch);
    curl_close($ch);
    return $result;
}

$PostData = array();
$PostData['user_id'] = $_COOKIE["StrID"];

$PostData['user_ip'] = __GetClientIp();
foreach ($_POST as $k => $v) {
    $PostData[$k] = $v;
}
$url = "https://webapi.digeam.com/go/event20231220";
$result = __SetPost($url, $PostData);
echo $result;
