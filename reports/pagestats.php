<?php
$loader = require '../autoload.php';

$page = 'pagestats';

$lrs = new TinCan\RemoteLRS(
        'https://testnew.waxlrs.com/TCAPI', '1.0.0', 'WYLvNyYOrfHePhvAlFAQ', 'soEUMLQG8SCdA1ULzbTs'
);
$response = $lrs->queryStatements(['limit' => 200]);
$res = json_decode($response);

$i = 0;
$arr = array();
foreach ($res->statements as $v) {
    $a = (array) $v->verb->display;
    if ($a['en-US'] == 'experienced') {
        //$arr[$i]['verb'] = $a['en-US'];
        $a = (array) $v->object->definition->name;
        $arr[] = $a['en-US'];
        //$a= (array)$v->object->definition->description;
        //$arr[$i]['description'] = $a['en-US'];
    }
    $i++;
}

$finalArr = array_count_values($arr);
$res = array();
foreach ($finalArr as $key => $value) {
    $res[] = array('name' => $key, 'y' => $value);
}
$jsonChart = json_encode($res);
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="../../favicon.ico">

        <title>QA - Tin Can </title>

        <!-- Bootstrap core CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

        <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
        <link href="../../assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">

        <!-- Custom styles for this template -->
        <link href="navbar-fixed-top.css" rel="stylesheet">

        <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
        <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
        <script src="../../assets/js/ie-emulation-modes-warning.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js"></script>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/data.js"></script>

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
        <style>
            a.logo{margin:0 15px 0 0; padding:0}
            a.logo img{ height:50px}
            .navbar-default{border-color:#87A2C8}
            .spacer-hr{ width:70px; height:50px}
            .margin-50{ margin-top:80px}
        </style>
    </head>

    <body>

        <!-- Fixed navbar -->
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand logo" href="#"><img src="http://qainfotech.com/wp-content/themes/aaika/images/qainfotech_logo.jpg" alt="QA"></a>
                </div>
                <?php include_once 'Menu.php'; ?>
            </div>
        </nav>

        <div class="container margin-50" id="container">

            <!-- Main component for a primary marketing message or call to action -->


        </div> <!-- /container -->


        <!-- Bootstrap core JavaScript
        ================================================== -->
        <!-- Placed at the end of the document so the pages load faster -->

        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        <script type="text/javascript">
            $(function () {
                // Create the chart
                $('#container').highcharts({
                    chart: {
                        type: 'column',
                        height: 550
                    },
                    title: {
                        text: 'Page Statistics'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'Total Views'
                        }

                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: false,
                                format: '{point.y:.1f}%'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                    },
                    series: [{
                            name: 'Title',
                            colorByPoint: true,
                            data: <?php echo $jsonChart; ?>,
                        }],
                });
            });
        </script>

    </body>
</html>


















