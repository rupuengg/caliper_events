function showWeeklySessionOther(rawData) {
    $('#container').highcharts({
        chart: {
            type: 'line',
            height: 550
        },
        title: {
            text: rawData.title
        },
        xAxis: {
            categories: rawData.datas.cates,
            labels: {
                rotation: -45,
                style: {
                    fontSize: '11px',
                    fontFamily: 'Verdana, sans-serif',
                    textOverflow: 'none'
                }
            },
            title: {
                text: rawData.htitle
            }
        },
        yAxis: {
            title: {
                text: rawData.vtitle
            },
//            plotLines: [{
//                    color: '#000000',
//                    width: 1,
//                    value: 14,
//                    dashStyle: 'longdashdot',
//                    zIndex: 100
//                }],
            min: 0,
            minTickInterval: 2,
            lineWidth: 1
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        credits: {
            enabled: false
        },
        series: rawData.datas.data
    });
}

function showWeeklySession(rawData) {
    $('#container').highcharts({
        chart: {
            type: 'column',
            height: 550
        },
        title: {
            text: rawData.title
        },
        xAxis: {
            type: 'category',
            title: {
                text: rawData.htitle
            },
            labels: {
                rotation: -45,
                style: {
                    fontSize: '11px',
                    fontFamily: 'Verdana, sans-serif',
                    textOverflow: 'none'
                }
            }
        },
        yAxis: {
            title: {
                text: rawData.vtitle
            },
            min: 0,
            stackLabels: {
                enabled: true
            },
            minTickInterval: 2,
            plotLines: [{
                    color: '#000000',
                    width: 1,
                    value: 5,
                    dashStyle: 'longdashdot',
                    zIndex: 100
                }],
            lineWidth: 1
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}'
                }
            }
        },
        tooltip: {
//                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<b>{point.y:2f}</b> Logged-In<br/>'
        },
        credits: {
            enabled: false
        },
        series: [{
                name: 'Brands',
                colorByPoint: true,
                data: rawData.datas,
                dataLabels: {
                    enabled: true,
//                    rotation: -90,
                    color: '#FFFFFF',
//                    align: 'right',
                    format: '{point.y:1f}',
//                    y: 10,
                    style: {
                        fontSize: '11px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
    });
}

function showWeeklyCourse(rawData) {
    function plotLines(lineType) {
        switch (lineType) {
            case 'min':
                var minVal = 0;
                for (var d in rawData.datas.data) {
                    var min = Math.min.apply(Math, rawData.datas.data[d].data.map(function (o) {
                        return o == 0 ? Infinity : o;
                    }));
                    minVal += min;
                }
                return {
                    color: '#000000',
                    width: 1,
                    value: (minVal / rawData.datas.data.length),
                    dashStyle: 'longdashdot',
                    zIndex: 100
                };
                break;
            case 'max':
                var maxVal = 0;
                for (var d in rawData.datas.data) {
                    var max = Math.max.apply(Math, rawData.datas.data[d].data);
                    maxVal += max;
                }
                return {
                    color: '#000000',
                    width: 1,
                    value: (maxVal / rawData.datas.data.length),
                    dashStyle: 'longdashdot',
                    zIndex: 100
                };
                break;
        }
    }

    $('#container').highcharts({
        chart: {
            type: 'line',
            height: 550
        },
        title: {
            text: rawData.title
        },
        xAxis: {
            categories: rawData.datas.cates,
            labels: {
                rotation: -45,
                style: {
                    fontSize: '11px',
                    fontFamily: 'Verdana, sans-serif',
                    textOverflow: 'none'
                }
            },
            title: {
                text: rawData.htitle
            }
        },
        yAxis: {
            title: {
                text: rawData.vtitle
            },
            plotLines: [plotLines('min'), plotLines('max')],
            lineWidth: 1
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        credits: {
            enabled: false
        },
        series: rawData.datas.data
    });
}

function showWeeklyBook(rawData) {
    $('#container').highcharts({
        chart: {
            type: 'line',
            height: 550
        },
        title: {
            text: rawData.title
        },
        xAxis: {
            categories: rawData.datas.cates,
            labels: {
                rotation: -45,
                style: {
                    fontSize: '11px',
                    fontFamily: 'Verdana, sans-serif',
                    textOverflow: 'none'
                }
            },
            title: {
                text: rawData.htitle
            }
        },
        yAxis: {
            title: {
                text: rawData.vtitle
            },
            plotLines: [{
                    color: '#000000',
                    width: 1,
                    value: 13,
                    dashStyle: 'longdashdot',
                    zIndex: 100
                }],
            lineWidth: 1
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        credits: {
            enabled: false
        },
        series: rawData.datas.data
    });
}

function showStudentActivity(rawData) {
    $('#container').highcharts({
        chart: {
            type: 'line',
            height: 550
        },
        title: {
            text: rawData.title
        },
        xAxis: {
            categories: rawData.datas.cates,
            labels: {
                rotation: -45,
                style: {
                    fontSize: '11px',
                    fontFamily: 'Verdana, sans-serif',
                    textOverflow: 'none'
                }
            },
            title: {
                text: rawData.htitle
            }
        },
        yAxis: {
            title: {
                text: rawData.vtitle
            },
            plotLines: [{
                    color: '#000000',
                    width: 1,
                    value: 25,
                    dashStyle: 'longdashdot',
                    zIndex: 100
                }],
//            minTickInterval: 10,
            lineWidth: 1
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        credits: {
            enabled: false
        },
        series: rawData.datas.data
    });
}

function showStudentSession(rawData) {
    $('#container').highcharts({
        chart: {
            type: 'column',
            height: 450
        },
        title: {
            text: rawData.title
        },
        xAxis: {
            categories: rawData.datas.data[fKey].cates,
            labels: {
                rotation: -45,
                style: {
                    fontSize: '11px',
                    fontFamily: 'Verdana, sans-serif',
                    textOverflow: 'none'
                }
            },
            title: {
                text: rawData.htitle
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: rawData.vtitle
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            },
            minTickInterval: 2,
            plotLines: [{
                    color: '#000000',
                    width: 1,
                    value: 40,
                    dashStyle: 'longdashdot',
                    zIndex: 100
                }],
            lineWidth: 1
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false,
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: 'Total: {point.stackTotal}'
//                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                }
            }
        },
        credits: {
            enabled: false
        },
        series: rawData.datas.data[fKey].datas
    });
}

function drawGraphs(type, rawData) {
    switch (type) {
        case 'weekly-session-other':
            showWeeklySessionOther(rawData);
            break;
        case 'weekly-session':
            showWeeklySession(rawData);
            break;
        case 'weekly-course':
            showWeeklyCourse(rawData);
            break;
        case 'book-view':
            showWeeklyBook(rawData);
            break;
        case 'student-activity':
            showStudentActivity(rawData);
            break;
        case 'student-session':
            showStudentSession(rawData);
            break;
    }
}

function pick_student(objthis) {
    fKey = objthis.value;
    console.log(fKey);
    drawGraphs('student-session', rawData);
}

function callAjaxForGraph(filter) {
    $('#navbar a.'+filter).parent().addClass('active');
    $('#navbar a.'+filter).parent().parent().parent().addClass('active');
    $('#container').html('Loading...');
    $('#dvUserDropdown').remove();
    $.ajax({
        url: 'graph/' + filter + '.php',
        type: 'post',
        dataType: 'json',
        success: function (res) {
            rawData = res;
            if (filter == 'student-session') {
                fKey = res.fKey;

                $('.container.margin-50').prepend('<div id="dvUserDropdown" class="form-group col-lg-2 pull-right"></div>');
                $('.container.margin-50 .form-group').append('<select id="student-select" name="user_id" onchange="pick_student(this);" class="form-control"></select>')
                $.each(res.user_list, function (key, value) {
                    $('.container.margin-50 .form-group select').append('<option value="' + key + '">' + value + '</option>')
                });
            }
            drawGraphs(filter, res);
        }
    });
    return false;
}

$(function () {
    var appendthis = ("<div class='modal-overlay js-modal-close'></div>");
    $('a[data-modal-id]').click(function (e) {
        e.preventDefault();
        $("body").append(appendthis);
        $(".modal-overlay").fadeTo(500, 0.7);
        //$(".js-modalbox").fadeIn(500);
        var modalBox = $(this).attr('data-modal-id');
        $('#' + modalBox).fadeIn($(this).data());
    });
    $(".js-modal-close, .modal-overlay").click(function () {
        $(".modal-box, .modal-overlay").fadeOut(500, function () {
            $(".modal-overlay").remove();
        });

    });
    $(window).resize(function () {
        $(".modal-box").css({
            top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
            left: ($(window).width() - $(".modal-box").outerWidth()) / 2
        });
    });
    $(window).resize();
});

$(document).ready(function () {
    $('#navbar li').mouseover(function () {
        $(this).find('ul').css('display', 'block');
    });
    $('#navbar li').mouseout(function () {
        $(this).find('ul').css('display', 'none');
    });
    $('#navbar li > a').click(function () {
        $('#navbar li ul li a').removeClass('active');
        $('#navbar li').removeClass('active');
        $(this).parent().addClass('active');
    });
    $('#navbar li ul li a').click(function () {
        $('#navbar li').removeClass('active');
        $(this).parent().addClass('active');
        $(this).parent().parent().parent().addClass('active');
        $(this).parent().parent().prev().html($(this).text());
        $(this).parent().parent().fadeOut('2000');
    });
});
var fKey = '';
var rawData = '';