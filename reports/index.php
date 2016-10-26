<?php $page = end(explode('/', $_SERVER['PHP_SELF'])); ?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <meta name="description" content="">
        <meta name="author" content="">
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <link rel="icon" href="../../favicon.ico">

        <title>QA - Stack Event</title>

        <!-- Bootstrap core CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

        <link href="https://cdn.datatables.net/1.10.10/css/jquery.dataTables.min.css" rel="stylesheet">


        <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
        <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/data.js"></script>

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        <script src="https://cdn.datatables.net/1.10.10/js/jquery.dataTables.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.js" type="text/javascript" charset="utf-8"></script>
        <style>
            a.logo{margin:0 15px 0 0; padding:0}
            a.logo img{ height:50px}
            .navbar-default{border-color:#87A2C8}
            .spacer-hr{ width:70px; height:50px}
            .margin-50{ margin-top:80px}

            .modal-box {
                display: none;
                position: absolute;
                z-index: 1000;
                width: 50%;
                background: white;
                border-bottom: 1px solid #aaa;
                border-radius: 4px;
                box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(0, 0, 0, 0.1);
                background-clip: padding-box;
            }

            .modal-box header,
            .modal-box .modal-header {
                padding: 1.25em 1.5em;
                border-bottom: 1px solid #ddd;
            }

            .modal-box header h3,
            .modal-box header h4,
            .modal-box .modal-header h3,
            .modal-box .modal-header h4 { margin: 0; }

            .modal-box .modal-body { padding: 2em 1.5em; height:500px;overflow:scroll;}

            .modal-box footer,
            .modal-box .modal-footer {
                padding: 1em;
                border-top: 1px solid #ddd;
                background: rgba(0, 0, 0, 0.02);
                text-align: right;
            }

            .modal-overlay {
                opacity: 0;
                filter: alpha(opacity=0);
                position: absolute;
                top: 0;
                left: 0;
                z-index: 900;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.3) !important;
            }

            a.close,.close {
                line-height: 1;
                font-size: 1.5em;
                position: absolute;
                top: 5%;
                right: 2%;
                text-decoration: none;
                color: #000;
            }

            a.close:hover {
                color: #222;
                -webkit-transition: color 1s ease;
                -moz-transition: color 1s ease;
                transition: color 1s ease;
            }
        </style>
    </head>
    <body>
        <?php include_once 'Menu.php'; ?>
        <div class="container margin-50">
            <div id="container"></div>
        </div>
        <a class="js-open-modal btn" href="javascript:;" data-modal-id="popup" style="display:none;"> Pop Up One</a>
        <div id="popup" class="modal-box">
            <header>
                <a href="javascript:;" class="js-modal-close close">×</a>
                <h3>Event JSON</h3>
            </header>
            <div class="modal-body">
                <p>Modal Body</p>
            </div>
        </div>
        <script type="text/javascript" src="public/js/index.js"></script>
        <script type="text/javascript" src="public/js/grapgh.js"></script>
        <script type="text/javascript" src="public/js/routing.js"></script>
    </body>
</html>
