<?php

$lrs = new TinCan\RemoteLRS(
        'https://testnew.waxlrs.com/TCAPI', '1.0.0', 'WYLvNyYOrfHePhvAlFAQ', 'soEUMLQG8SCdA1ULzbTs'
);
$response = $lrs->queryStatements(['limit' => 200]);
$res = json_decode($response);

$i = 0;
$arr = array();

foreach ($res->statements as $v) {
    $arr[] = $v->actor->name;
}

$finalArr = array_count_values($arr);
$res = array();
foreach ($finalArr as $key => $value) {
    $res[] = array('name' => $key, 'y' => $value);
}
$jsonChart = json_encode($res);
?>
<script type="text/javascript">
$(function () {
    // Create the chart
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Student Statistics'
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