<?
    $user = "user";
    $pass = "pass";
    $db_name = "base";
    $address = "localhost";
    $link = mysql_connect( $address, $user, $pass);
    mysql_select_db($db_name);
	  $fhandle = fopen($_FILES['image']['tmp_name'], "r");
    $content = base64_encode(fread($fhandle, $_FILES['image']['size']));
    fclose($fhandle);
	  $query = mysql_query("INSERT INTO images (image) VALUES (\""$content"\")";
?>
