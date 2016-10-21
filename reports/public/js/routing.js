var router;
var routing = function (mode) {
    router = new Navigo(null, mode === 'hash');
    router.on({
        '/home': function () {
            $(document).ready(function () {
                $('#container').html('');
                var html = '<div id="box"><table id="datatbl" class="display" cellspacing="0" width="100%"><thead><tr><th>Profile</th><th>Action</th><th>Actor</th><th>Time</th><th>Action</th></tr></thead></table><a class="js-open-modal btn" href="javascript:;" data-modal-id="popup" style="display:none;"> Pop Up One</a></div></div><div id="popup" class="modal-box">  <header><a href="#" class="js-modal-close close">×</a><h3>Event JSON</h3></header><div class="modal-body"><p>Modal Body</p></div>';
                $('#container').html(html);
                $('#datatbl').DataTable({
                    "ajax": {
                        "url": "event.php"
                    },
                    "columns": [
                        {"data": "profile"},
                        {"data": "action"},
                        {"data": "actor"},
                        {"data": "event_time"},
                        {"data": "full"}
                    ],
                    "order": [[3, "asc"]],
                    "ordering": true,
                    "searching": false,
                    "bProcessing": true,
                    "bServerSide": true,
                    "drawCallback": function (settings) {
                        $('a.other').on('click', function () {
                            $('.modal-body').html('<pre>' + JSON.stringify(JSON.parse($(this).prev().val()), null, 2) + '</pre>');
                            $('a.js-open-modal.btn').click();
                        });
                    }
                });
            });
        },
        'weekly-session-other': function () {
            callAjaxForGraph('weekly-session-other');
        },
        'weekly-course': function () {
            callAjaxForGraph('weekly-course');
        },
        'book-view': function(){
            callAjaxForGraph('book-view');
        },
        'student-activity': function(){
            callAjaxForGraph('student-activity');
        },
        'student-session': function(){
            callAjaxForGraph('student-session');
        },
        'this/*/:language/:what': function (params) {
            var id = 'parameterized';
            var content = el('#content-' + id).innerHTML;

            Object.keys(params).forEach(function (key) {
                content = content.replace(new RegExp('{{' + key + '}}', 'g'), params[key]);
            });
            setContent(id, content);
        },
        'test-case/*': function () {},
        'testing': function () {
            var id = 'testing';

            setContent(id, el('#content-' + id).innerHTML);
            mocha.run();
        }
    });
    router.on(function () {
        setContent('about');
    });
    router.resolve();
};

var el = function (sel) {
    return document.querySelector(sel);
}

var setContent = function (id, content) {
//    el('#container').innerHTML = content || el('#content-' + id).innerHTML;
};

var switchModes = function () {
    var trigger = el('.js-mode-trigger');
    var mode = 'history-api';
    var isLocalStorageSupported = !!window.localStorage;
    var rerenderTrigger = function (mode) {
        trigger.querySelector('input').checked = mode === 'hash';
    };

    if (isLocalStorageSupported) {
        mode = localStorage.getItem('navigo') || mode;
    }
    rerenderTrigger(mode);

    trigger.addEventListener('click', function () {
        mode = mode === 'history-api' ? 'hash' : 'history-api';
        isLocalStorageSupported && localStorage.setItem('navigo', mode);
        window.location.href = (router.root || '').replace('#', '');
        setTimeout(function () {
            window.location.reload(true);
        }, 200);
    });

    return mode;
};

var init = function () {
    routing();
};

function navigate(url){
    router.navigate(url);
}

window.onload = init;