<?php

    $fn = $_SERVER['HTTP_X_FILENAME'];
    file_put_contents(
        'upload/' . $fn,
        file_get_contents('php://input')
    );
    echo "$fn uploaded";

?>