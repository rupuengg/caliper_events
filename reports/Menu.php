<?php
if (!isset($graph)) {
    $graph = '';
}
if (!isset($page)) {
    $page = '';
}
?>
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand logo" href="#"><img src="http://qainfotech.com/wp-content/themes/aaika/images/qainfotech_logo.jpg" alt="QA"></a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="spacer-hr"></li>
                <li><a class="home" href="javascript:;" onclick="navigate('/home')">Activity Stream</a></li>
                <li>
                    <a href="javascript:;">Weekly Logged-In Report</a>
                    <ul class="nav navbar-nav" style="display:none;position:absolute;width:300px;background:#f8f8f8;">
                        <li style="width:100%;"><a class="weekly-session-other" href="javascript:;" onclick="navigate('/weekly-session-other')">Weekly Logged-In Report</a></li>
                        <li style="width:100%;"><a class="weekly-course" href="javascript:;" onclick="navigate('/weekly-course')">Weekly Course Popularity</a></li>
<!--                        <li style="width:100%;"><a class="book-view" href="javascript:;" onclick="navigate('/book-view')">Weekly Book Popularity</a></li>-->
                        <li style="width:100%;"><a class="student-activity" href="javascript:;" onclick="navigate('/student-activity')">Student Activity Weekly Trend</a></li>
                        <li style="width:100%;"><a class="student-session" href="javascript:;" onclick="navigate('/student-session')">Student Session Duration(Daily Report)</a></li>
                        <li style="width:100%;"><a class="question-complexity" href="javascript:;" onclick="navigate('/question-complexity')">Question Complexity Per Quiz</a></li>
                    </ul> 
                </li>
            </ul>
        </div>
    </div>
</nav>