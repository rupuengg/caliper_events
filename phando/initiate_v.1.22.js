globalPlayerObj = '';
finalTime = '';
socialShare = 0;
playerDefaultHeight = 0;
playerDefaultWidth = 0;
analyticSiteId = 3;

globalVideoTag = '';
posterUrlFn = '';
autoPlayOpt = 0;

adsOverlayError = 0;

backupUrl = '';
adUrlOpt = '';
playUrl = '';
playType = '';
sourceUrl = '';
backupType = '';
tagId = '';
overlayHeight = 0;
isLinear = 0;
isMuted = 0;
i = 0;
j = 0;

wWidth = $(window).width();
wHeight = $(window).height();

adblock = 0;
isMobileAutoPlayUI = 0;
if (isAdBlockActive)
    adblock = 1;

backupVastAdsTag = '';


function initPlayer(tagId, sourceUrl, mediaType, poster, controls, autoPlay, playerHeight, playerWidth, adUrl, backupUrl, backupType,backupAdsTag) {
    globalVideoTag = tagId;
    posterUrlFn = poster;
    autoPlayOpt = autoPlay;
    adUrlOpt = adUrl;
    playerDefaultHeight = playerHeight;
    playerDefaultWidth = playerWidth;
    i = i + 1;
    socialShare = 0;
	adsOverlayError = 0;
	backupVastAdsTag = backupAdsTag;

    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
        /*googleImaPlayerAPI(tagId, sourceUrl, adUrl, poster, playerHeight, playerWidth);
         phandoImaSdk();
         phandoImaAds(tagId, sourceUrl, adUrl, poster, playerHeight, playerWidth, mediaType);
         
         $('#ima-sample-placeholder').css('background-image', 'url(' + poster + ')');
         $('#ima-sample-videoplayer').css('width', wWidth);
         $('#ima-sample-videoplayer').css('height', wHeight);*/
        var videoTagHtml = '<video id="' + tagId + '" class="video-js vjs-default-skin vjs-big-play-centered piwikTrackContent"';
        videoTagHtml += ' ' + controls + ' ' + autoPlay + ' preload="none" width="' + playerWidth + '" height="' + playerHeight + '" poster="' + poster + '"';
        videoTagHtml += '>';

        videoTagHtml += '<source src="' + sourceUrl + '" type="' + mediaType + '">';
        videoTagHtml += '<source src="' + backupUrl + '" type="' + backupType + '">';

        videoTagHtml += '</video>';

        $('.' + tagId).html(videoTagHtml);





    } else {

        controls = (controls == 1) ? ' controls ' : ' ';
        autoPlay = (autoPlay == 1) ? ' autoplay ' : ' ';
        //  autoPlay = (1 == 1) ? ' autoplay ' : ' ';
        var videoTagHtml = '<video id="' + tagId + '" class="video-js vjs-default-skin vjs-big-play-centered piwikTrackContent"';
        videoTagHtml += ' ' + controls + ' ' + autoPlay + ' preload="none" width="' + playerWidth + '" height="' + playerHeight + '" poster="' + poster + '"';
        videoTagHtml += '>';

        if (navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Firefox/i)) {

            videoTagHtml += '<source src="' + backupUrl + '" type="' + backupType + '">';
        }
        else
        {
            videoTagHtml += '<source src="' + sourceUrl + '" type="' + mediaType + '">';
            videoTagHtml += '<source src="' + backupUrl + '" type="' + backupType + '">';
        }

        videoTagHtml += '</video>';

        $('.' + tagId).html(videoTagHtml);
        // window.frameElement.setAttribute("allowfullscreen","allowfullscreen")        
    }
}


function playerOptions(videoTagId, videoId, watermark, vastAdsUrl, muted, playerTechOrder, analyticsId) {

    isMuted = muted;
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
        return globalPlayerObj;
    } else {

        phandoImaSdk();
        var techOrd1 = 'flash';
        var techOrd2 = 'html5';
        if (playerTechOrder != '') {
            techOrderArray = playerTechOrder.split(',');
            techOrd1 = techOrderArray[0];
            techOrd2 = techOrderArray[1];
        }
        var videoPlayer = videojs(videoTagId, {responsive: true, techOrder: [techOrd1, techOrd2]}, function () { // swap techOrder to change player fallback
            var player = this;

            isPlaying = player.paused();
            if (deviceType == 'desktop' && (navigator.userAgent.match(/Chrome/i) || navigator.userAgent.indexOf("Safari") > -1)) {
                checkFullScreen(player, videoTagId);
            } else {
                if (deviceType != 'desktop')
                    $('#' + videoTagId).css('position', 'fixed');
            }
            rt = 0;
            //isPlaybackStarted1(player);
            muted = (muted == 1) ? true : false;
            muted = true;


            player.watermark({
                file: watermark,
                xpos: 50,
                ypos: 50,
                xrepeat: 0,
                opacity: 0.5
            });
            if (typeof analyticsId !== 'undefined') {
                analytics(player, videoId, analyticsId); // track video 
            }
            //player.pause();
            if ((autoPlayOpt == 1 && adUrlOpt != '') || (i > 1)) {

                player.muted(true);
                if (i == 1)
                    $('.video-js').css('opacity', '0');
                $('.' + videoTagId).css('background-color', '#000');
            }

            if (adblock == 1)
            {
                player.muted(isMuted);
                $('.video-js').css('opacity', '1');
            }


        });


        phandoSocialShare(videoTagId, videoPlayer);
        if (adblock == 0)
            phandoImaAdsSimple(videoPlayer, vastAdsUrl, videoTagId);

        videoPlayer.on('click', function () {
            if ((videoPlayer.currentTime() == 0) && j == 0 && autoPlayOpt != 1 && adUrlOpt != '' && adblock == 0) {
                j = j + 1;
                videoPlayer.muted(muted);
                $('.video-js').css('opacity', '0');
                $('.video-js').css('background-color', '#000');
                $('.' + videoTagId).css('background-color', '#000');
            }
        });

        videoPlayer.on('adstart', function () {

            $('.video-js').css('opacity', '1');
            if (!isMuted)
                videoPlayer.muted(false);
            else
                videoPlayer.muted(true);

            $('#ima-controls-div').show();
            $('#ima-ad-container').show();
            $('.vjs-error-display').css('visibility', 'hidden');
            $('.vjs-sharing-container1').css('visibility', 'hidden');
            socialShare = 1;
        });

        videoPlayer.on('adclick', function () {
            $('.vjs-sharing-container1').css('visibility', 'visible');
            videoPlayer.pause();
        });

        videoPlayer.on('adend', function () {
            $('.vjs-sharing-container1').css('visibility', 'visible');
            $('.video-js').css('opacity', '1');
            if (!isMuted)
                videoPlayer.muted(false);
            else
                videoPlayer.muted(true);

            //videoPlayer.src({ type: playType, src: playUrl });
            //videoPlayer.load();

            videoPlayer.currentTime(0);
            videoPlayer.play();
            socialShare = 0;
            $('.vjs-loading-spinner').hide();

        });

        isPlaybackStartedNew(videoPlayer);
        globalPlayerObj = videoPlayer;

        //videoPlayer.src('');        
        //videoPlayer.src({ type: playType, src: playUrl });
        //$('.vjs-error-display').remove();
        $('#ima-controls-div').hide();
        //$('.vjs-default-skin').css('background','red');
        //$('.vjs-play-progress').css('background','#b30000');
        //$('.vjs-volume-level').css('background','#b30000');


        return videoPlayer;
    }
}

function skipads(src) {
    isEnded = 1;
}

function playerOptionsAdaptive(videoTagId, videoId, watermark, vastAdsUrl, muted, playerTechOrder, analyticsId, sourceUrl, sourceType) {



    isMuted = muted;
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {

        return globalPlayerObj;
    } else {

        if (isMobileAutoPlayUI == 1)
            socialShare = 0;

        phandoImaSdk();
        if (navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Firefox/i)) {
            var videoPlayer = videojs(videoTagId, {sources: [{
                        techOrder: ['flash', 'html5'],
                        type: backupType,
                        src: backupUrl
                    }]

            }, function () {
                var player = this;

                $('#' + videoTagId).css('position', 'fixed');


                muted = (muted == 1) ? true : false;

                player.muted(muted);

            });

        }
        else
        {
            var videoPlayer = videojs(videoTagId, {sources: [{
                        techOrder: ['html5', 'flash'],
                        type: sourceType,
                        src: sourceUrl
                    }, {
                        techOrder: ['html5', 'flash'],
                        type: backupType,
                        src: backupUrl
                    }]

            }, function () {
                var player = this;
                if (deviceType == 'desktop' && (navigator.userAgent.match(/Chrome/i) || navigator.userAgent.indexOf("Safari") > -1)) {
                    checkFullScreen(player, videoTagId);
                } else {

                    if (navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/UC/i)) {

                        //$(".video-js").css('margin-top','70px');
                    } else {
                        $('#' + videoTagId).css('position', 'fixed');
                    }
                }
                muted = (muted == 1) ? true : false;
                player.muted(muted);

            });

        }

        $('#change').bind('click', function () {
            videoPlayer.currentTime(0);
            videoPlayer.play();
//        changeSource({
//            type: sourceType,
//            src: sourceUrl
//        }, videoPlayer);
        });

        videoPlayer.watermark({
            file: watermark,
            xpos: 50,
            ypos: 50,
            xrepeat: 0,
            opacity: 0.5
        });


        if (typeof analyticsId !== 'undefined') {
            analytics(videoPlayer, videoId, analyticsId); // track video 
        }

        phandoSocialShare(videoTagId, videoPlayer);
        if (adblock == 0)
            phandoImaAdsSimple(videoPlayer, vastAdsUrl, videoTagId);


        $('#ima-controls-div').hide();
//        videoPlayer.setTimeout(changefor2g, 20000);


        function changefor2g()
        {

            var isPlaying = !videoPlayer.paused();

            if (isPlaying) {
                var state = this.currentTime();
                if (state == 0) {
                    videoPlayer.src({type: "video/mp4", src: backupUrl});
                    //$('#'+videoTagId).after('<video width="400" controls><source src="http://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"><source src="mov_bbb.ogg" type="video/ogg"></video>');
                    // videoPlayer.dispose();
                }
            } else {
                videoPlayer.setTimeout(changefor2g, 20000);
            }
        }
        $('#ima-controls-div').hide();

        /*if(adUrlOpt!=''){
         
         videoPlayer.muted(1);
         $('.video-js').css('opacity','0');
         }*/

        videoPlayer.one('click', function () {
            if ((videoPlayer.currentTime() == 0) && j == 0 && autoPlayOpt != 1 && deviceType != 'mobile') { // TODO: remove mobile if click on player will skip ads
                j = j + 1;
                videoPlayer.muted(true);
                $('.video-js').css('opacity', '0');
                $('.video-js').css('background-color', '#000');
                $('.' + videoTagId).css('background-color', '#000');
            }
        });

        if ((autoPlayOpt == 1 && adUrlOpt != '' && adblock != 1) && !(navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Chrome/i))) {

            videoPlayer.muted(true);
            $('.video-js').css('opacity', '0');
            $('.video-js').css('background-color', '#000');
            $('.' + videoTagId).css('background-color', '#000');
        }

        $(".vjs-live-display").hide();

        videoPlayer.on('adstart', function () {
            $('#ima-controls-div').show();
            $('#ima-ad-container').show();
            $('.video-js').css('opacity', '1');
            if (!isMuted)
                videoPlayer.muted(false);
            else
                videoPlayer.muted(true);
            socialShare = 1;
            $('.vjs-sharing-container1').css('visibility', 'hidden');

        });


        videoPlayer.on('adend', function () {
            $('.video-js').css('opacity', '1');
            if (!isMuted)
                videoPlayer.muted(false);
            else
                videoPlayer.muted(true);
            videoPlayer.currentTime(0);
            videoPlayer.play();
            $('.vjs-sharing-container1').css('visibility', 'visible');
            socialShare = 0;
            $('.vjs-loading-spinner').hide();
        });
        isPlaybackStartedNew(videoPlayer);


        globalPlayerObj = videoPlayer;


        return videoPlayer;
    }
}

function initPlaylist(tagId, sourceUrl, mediaType, poster, controls, autoPlay, playerHeight, playerWidth, vastAdsUrl, showList) {
    controls = (controls == 1) ? ' controls ' : ' ';
    autoPlay = (autoPlay == 1) ? ' autoplay ' : ' ';
    var col1Class = 'col-md-8';
    var col2Class = 'col-md-4';
    if (showList == 0) {
        var col1Class = 'col-md-12';
    }
    var videoTagHtml = '<div class="row" style="background-color:#000;"><div class="' + col1Class + '"><video oncontextmenu="return false;" id="' + tagId + '" class="video-js vjs-default-skin vjs-big-play-centered"';
    videoTagHtml += ' ' + controls + ' ' + autoPlay + ' preload="none" width="' + playerWidth + '" height="' + playerHeight + '"';
    videoTagHtml += '>';
    videoTagHtml += '</video></div>';
    if (showList == 1) {
        videoTagHtml += '<div class="' + col2Class + '"><div class="playlist-components">';
        videoTagHtml += '<div class="playlist">';
        videoTagHtml += '<ul></ul></div>';
        videoTagHtml += '<div class="button-holder">';
        videoTagHtml += '<img id="prev" alt="Previous video" src="http://phando.com/phandoPlayer/phando/img/Previous.png">';
        videoTagHtml += '<img id="next" alt="Next video" src="http://phando.com/phandoPlayer/phando/img/Next.png">';
        videoTagHtml += '</div></div>';
    }
    videoTagHtml += '</div>';

    $('.' + tagId).html(videoTagHtml);
}

function playlistOptions(videoTag, videos, videoId, watermark, vastAdsUrl, muted, playerTechOrder, analyticsId, isCont) {
    var demoModule = {
        init: function () {
            this.els = {};
            this.cacheElements();
            this.initVideo();
            this.createListOfVideos();
            this.bindEvents();
            this.overwriteConsole();
        },
        overwriteConsole: function () {
            console._log = console.log;
            console.log = this.log;
        },
        log: function (string) {
            demoModule.els.log.append('<p>' + string + '</p>');
            console._log(string);
        },
        cacheElements: function () {
            this.els.$playlist = $('div.playlist > ul');
            this.els.$next = $('#next');
            this.els.$prev = $('#prev');
            this.els.log = $('div.panels > pre');
        },
        initVideo: function () {
            this.player = videojs(videoTag);
            this.player.playList(videos);
        },
        createListOfVideos: function () {
            var html = '';
            for (var i = 0, len = this.player.pl.videos.length; i < len; i++) {
                html += '<li data-videoplaylist="' + i + '">' +
                        '<span class="number">' + (i + 1) + '</span>' +
                        '<span class="poster"><img src="' + videos[i].poster + '"></span>' +
                        '<span class="title">' + videos[i].title + '</span>' +
                        '</li>';
            }
            this.els.$playlist.empty().html(html);
            this.updateActiveVideo();
        },
        updateActiveVideo: function () {
            var activeIndex = this.player.pl.current;

            this.els.$playlist.find('li').removeClass('active');
            this.els.$playlist.find('li[data-videoplaylist="' + activeIndex + '"]').addClass('active');
        },
        bindEvents: function () {
            var self = this;
            this.els.$playlist.find('li').on('click', $.proxy(this.selectVideo, this));
            this.els.$next.on('click', $.proxy(this.nextOrPrev, this));
            this.els.$prev.on('click', $.proxy(this.nextOrPrev, this));
            this.player.on('next', function (e) {
                console.log('Next video');
                self.updateActiveVideo.apply(self);
                if (isCont == 1) {
                    isContinues = 1;
                }
            });
            this.player.on('prev', function (e) {
                console.log('Previous video');
                self.updateActiveVideo.apply(self);
            });
            this.player.on('lastVideoEnded', function (e) {
                console.log('Last video has finished');
            });
        },
        nextOrPrev: function (e) {
            var clicked = $(e.target);
            this.player[clicked.attr('id')]();
        },
        selectVideo: function (e) {
            var clicked = e.target.nodeName === 'LI' ? $(e.target) : $(e.target).closest('li');

            if (!clicked.hasClass('active')) {
                console.log('Selecting video');
                var videoIndex = clicked.data('videoplaylist');
                this.player.playList(videoIndex);
                this.updateActiveVideo();
            }
        }
    };

    demoModule.init();

    var techOrd1 = 'flash';
    var techOrd2 = 'html5';
    if (playerTechOrder != '') {
        techOrderArray = playerTechOrder.split(',');
        techOrd1 = techOrderArray[0];
        techOrd2 = techOrderArray[1];
    }

    var videoPlayer = videojs(videoTag, {responsive: true, techOrder: [techOrd1, techOrd2]}, function () { // swap techOrder to change player fallback
        var player = this;
        player.ads();
        muted = (muted == 1) ? 'true' : 'false';
        player.muted(muted);
        player.vast({
            url: vastAdsUrl,
            playAdAlways: true
        });

        player.watermark({
            file: watermark,
            xpos: 50,
            ypos: 50,
            xrepeat: 0,
            opacity: 0.5,
        });
        if (typeof analyticsId !== 'undefined') {
            analytics(player, videoId, analyticsId); // track video 
        }

    });

    phandoSocialShare(videoTag, videoPlayer);
    return globalPlayerObj = videoPlayer;
}

function googleImaPlayerAPI(tagClass, mediaUrl, adUrl, poster, playerHeight, playerWidth) {

    var googletag = googletag || {};
    googletag.cmd = googletag.cmd || [];
    (function () {
        var gads = document.createElement('script');
        gads.async = true;
        gads.type = 'text/javascript';
        gads.src = '//www.googletagservices.com/tag/js/gpt.js';
        var node = document.getElementsByTagName('script')[0];
        node.parentNode.insertBefore(gads, node);
    })();

    googletag.cmd.push(function () {
        // Supply YOUR_NETWORK/YOUR_UNIT_PATH in place of 6062/iab_vast_samples.
        googletag.defineSlot('/6062/iab_vast_samples', [728, 90], 'companionDiv')
                .addService(googletag.companionAds())
                .addService(googletag.pubads());
        googletag.companionAds().setRefreshUnfilledSlots(true);
        googletag.pubads().enableVideoAds();
        googletag.enableServices();
    });

    var imaHtml = '<div id="ima-sample-container"><div id="ima-sample-videoplayer"><div id="ima-sample-placeholder"><img class="playBtnImg" src="http://phando.com/phandoPlayer/phando/img/play-button.png"></div></div></div>';

    $('.' + tagClass).html(imaHtml);
    $('#ima-sample-placeholder').css('height', playerHeight);
    $('#ima-sample-placeholder').css('width', playerWidth);
}


function phandoImaSdk() {
    (function (vjs) {
        'use strict';
        var extend = function (obj) {
            var arg;
            var index;
            var key;
            for (index = 1; index < arguments.length; index++) {
                arg = arguments[index];
                for (key in arg) {
                    if (arg.hasOwnProperty(key)) {
                        obj[key] = arg[key];
                    }
                }
            }
            return obj;
        },
                ima_defaults = {
                    debug: true,
                    timeout: 5000,
                    prerollTimeout: 1000
                },
        imaPlugin = function (options, readyCallback) {
            var player = this;

            /**
             * Creates the ad container passed to the IMA SDK.
             * @ignore
             */
            player.ima.createAdContainer_ = function () {
                // The adContainerDiv is the DOM of the element that will house
                // the ads and ad controls.

                vjsControls = player.getChild('controlBar');
                adContainerDiv =
                        vjsControls.el().parentNode.insertBefore(
                        document.createElement('div'),
                        vjsControls.el());
                adContainerDiv.id = 'ima-ad-container';
                adContainerDiv.style.width = player.width() + 'px';
                adContainerDiv.style.height = player.height() + 'px';
                adContainerDiv.style.position = 'absolute';
                adContainerDiv.addEventListener(
                        'mouseover',
                        player.ima.showAdControls_,
                        false);
                adContainerDiv.addEventListener(
                        'mouseout',
                        player.ima.hideAdControls_,
                        false);
                player.ima.createControls_();
                google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE);
                adDisplayContainer =
                        new google.ima.AdDisplayContainer(adContainerDiv, contentPlayer);
            };

            /**
             * Creates the controls for the ad.
             * @ignore
             */
            player.ima.createControls_ = function () {
                controlsDiv = document.createElement('div');
                controlsDiv.id = 'ima-controls-div';
                controlsDiv.style.width = '100%';
                countdownDiv = document.createElement('div');
                countdownDiv.id = 'ima-countdown-div';
                countdownDiv.innerHTML = 'Advertisement';
                countdownDiv.style.display = showCountdown ? 'block' : 'none';
                seekBarDiv = document.createElement('div');
                seekBarDiv.id = 'ima-seek-bar-div';
                seekBarDiv.style.width = player.width() + 'px';
                progressDiv = document.createElement('div');
                progressDiv.id = 'ima-progress-div';
                playPauseDiv = document.createElement('div');
                playPauseDiv.id = 'ima-play-pause-div';
                playPauseDiv.className = 'ima-playing';
                playPauseDiv.addEventListener(
                        'click',
                        player.ima.onAdPlayPauseClick_,
                        false);
                muteDiv = document.createElement('div');
                muteDiv.id = 'ima-mute-div';
                muteDiv.className = 'ima-non-muted';
                muteDiv.addEventListener(
                        'click',
                        player.ima.onAdMuteClick_,
                        false);
                fullscreenDiv = document.createElement('div');
                fullscreenDiv.id = 'ima-fullscreen-div';
                fullscreenDiv.className = 'ima-non-fullscreen';

                if (navigator.userAgent.match(/MSIE 10/i)) {  // specific compatibility code for IE 10 IMA 
                    fullscreenDiv.addEventListener(
                            'click',
                            player.ima.onAdFullscreenClick_,
                            false);
                    adContainerDiv.appendChild(controlsDiv);
                    controlsDiv.appendChild(countdownDiv);
                    controlsDiv.appendChild(seekBarDiv);
                    controlsDiv.appendChild(playPauseDiv);
                    controlsDiv.appendChild(muteDiv);
                    controlsDiv.appendChild(fullscreenDiv);
                    seekBarDiv.appendChild(progressDiv);
                } else {
                    fullscreenDiv.addEventListener(
                            'click',
                            player.ima.onAdFullscreenClick_,
                            false);
                    adContainerDiv.insertBefore(
                            controlsDiv,
                            adContainerDiv.childNodes[adContainerDiv.childNodes.length]);
                    controlsDiv.insertBefore(
                            countdownDiv, controlsDiv.childNodes[controlsDiv.childNodes.length]);
                    controlsDiv.insertBefore(
                            seekBarDiv, controlsDiv.childNodes[controlsDiv.childNodes.length]);
                    controlsDiv.insertBefore(
                            playPauseDiv, controlsDiv.childNodes[controlsDiv.childNodes.length]);
                    controlsDiv.insertBefore(
                            muteDiv, controlsDiv.childNodes[controlsDiv.childNodes.length]);
                    controlsDiv.insertBefore(
                            fullscreenDiv, controlsDiv.childNodes[controlsDiv.childNodes.length]);
                    seekBarDiv.insertBefore(
                            progressDiv, seekBarDiv.childNodes[controlsDiv.childNodes.length]);
                }
            };

            /**
             * Initializes the AdDisplayContainer. On mobile, this must be done as a
             * result of user action.
             */
            player.ima.initializeAdDisplayContainer = function () {
                adDisplayContainerInitialized = true;
                adDisplayContainer.initialize();
            };

            player.ima.requestAds = function () {
                if (!adDisplayContainerInitialized) {
                    adDisplayContainer.initialize();
                }
                var adsRequest = new google.ima.AdsRequest();
                adsRequest.adTagUrl = settings.adTagUrl;

                adsRequest.linearAdSlotWidth = player.width();
                adsRequest.linearAdSlotHeight = player.height();
                adsRequest.nonLinearAdSlotWidth =
                        settings.nonLinearWidth || player.width();
                adsRequest.nonLinearAdSlotHeight =
                        settings.nonLinearHeight || (player.height()); // TODO: height settigns for overlay ads Default: player.height() / 3
		
                adsLoader.requestAds(adsRequest);
				
            };

            /**
             * Listener for the ADS_MANAGER_LOADED event. Creates the AdsManager,
             * sets up event listeners, and triggers the 'adsready' event for
             * videojs-ads-contrib.
             * @ignore
             */
            player.ima.onAdsManagerLoaded_ = function (adsManagerLoadedEvent) {
                adsManager = adsManagerLoadedEvent.getAdsManager(
                        contentPlayheadTracker, adsRenderingSettings);

                adsManager.addEventListener(
                        google.ima.AdErrorEvent.Type.AD_ERROR,
                        player.ima.onAdError_);
                adsManager.addEventListener(
                        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
                        player.ima.onContentPauseRequested_);
                adsManager.addEventListener(
                        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
                        player.ima.onContentResumeRequested_);

                adsManager.addEventListener(
                        google.ima.AdEvent.Type.LOADED,
                        player.ima.onAdLoaded_);
                adsManager.addEventListener(
                        google.ima.AdEvent.Type.STARTED,
                        player.ima.onAdStarted_);
                adsManager.addEventListener(
                        google.ima.AdEvent.Type.CLICK,
                        player.ima.onAdClick_);
                adsManager.addEventListener(
                        google.ima.AdEvent.Type.COMPLETE,
                        player.ima.onAdComplete_);
                adsManager.addEventListener(
                        google.ima.AdEvent.Type.SKIPPED,
                        player.ima.onAdSkipped_);

                player.trigger('adsready');
            };

            /**
             * Start ad playback, or content video playback in the absence of a
             * pre-roll.
             */
            player.ima.start = function () {
                try {
                    adsManager.init(
                            player.width(),
                            player.height(),
                            google.ima.ViewMode.FULLSCREEN);		
                    adsManager.setVolume(player.muted() ? 0 : player.volume());
                    adsManager.start();
					player.ima.resize;

                    $('.vjs-control-bar').hide();
                    $('.vjs-caption-settings').hide();

                } catch (adError) {
                    player.ima.onAdError_(adError);

                    $('.vjs-control-bar').hide();
                    $('.vjs-caption-settings').hide();
                }
            };

            /**
             * Listener for errors fired by the AdsLoader.
             * @param {google.ima.AdErrorEvent} event The error event thrown by the
             *     AdsLoader. See
             *     https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdError.Type
             * @ignore
             */
            player.ima.onAdsLoaderError_ = function (event) {
				window.console.log('AdsLoader error: ' + event.getError());
				if(adsOverlayError == 0) {
					var errorStr1 = event.getError(); console.log(errorStr1);
					var errorStr = errorStr1.toString();
					var errorCode1 = errorStr.indexOf("503"); console.log('Error Code:'+errorCode1);
					var errorCode2 = errorStr.indexOf("501"); console.log('Error Code:'+errorCode2);
					if(errorCode1 > 0 || errorCode2 > 0) { 
						console.log('Getting creative mis-match error. loading alternate ads.');
						changeMediaSrcWithAdsTag('', globalPlayerObj, backupVastAdsTag);
					}
					adsOverlayError = 1;
				}
				
                /*$('.video-js').css('opacity', '1');
                if (!isMuted)
                    player.muted(false);
                else
                    player.muted(true);

                window.console.log('AdsLoader error: ' + event.getError());
                var piwikTracker = Piwik.getTracker(analyticsUrl, 4);
                piwikTracker.trackEvent('Ads', 'AdError', event.getError(), 1);

                var piwikTracker1 = Piwik.getTracker(analyticsUrl, 5);
                piwikTracker1.trackEvent('Ads', 'AdLoaderError', event.getError(), 1);

                if (adsManager) {
                    adsManager.destroy();
                }
                player.trigger('adserror');
                $('#ima-ad-container').hide();
                $('.vjs-control-bar').css('display', 'block');
                $('.vjs-sharing-container1').css('visibility', 'visible');
                if (deviceType == 'desktop') {
                    $('.video-js').css('opacity', '1');
                    $('.vjs-loading-spinner').hide();
                }
                if (isMobileAutoPlayUI == 1 || deviceType == 'mobile' || deviceType == 'desktop') {
                    socialShare = 2;
                    player.currentTime(0);
                    player.play();
                }*/
            };

            /**
             * Listener for errors thrown by the AdsManager.
             * @param {google.ima.AdErrorEvent} adErrorEvent The error event thrown by
             *     the AdsManager.
             * @ignore
             */
            player.ima.onAdError_ = function (adErrorEvent) {
				
                window.console.log('Ad error: ' + adErrorEvent.getError());

                var piwikTracker = Piwik.getTracker(analyticsUrl, analyticSiteId);
                piwikTracker.trackEvent('Ads', 'AdError', 'AdError', 1);

                var piwikTracker1 = Piwik.getTracker(analyticsUrl, 4);
                piwikTracker1.trackEvent('Ads', 'AdError', adErrorEvent.getError(), 1);

                if (isMobileAutoPlayUI == 1) {
                    adsManager.setVolume(0);
                    setTimeout(function () {
                        adsManager.destroy();
                    }, 1000);
                } else {
                    adsManager.destroy();
                }

                adContainerDiv.style.display = 'none';
                player.trigger('adserror');
                $('#ima-controls-div').hide();
                $('.vjs-control-bar').show();
                $('.video-js').removeClass('vjs-ad-playing');
                $('.vjs-sharing-container1').css('visibility', 'visible');
                if (deviceType == 'desktop') {
                    $('.video-js').css('opacity', '1');
                    //$('.vjs-loading-spinner').hide();
                }
                if (isMobileAutoPlayUI == 1 || deviceType == 'mobile' || deviceType == 'desktop') {
                    socialShare = 2;
                    player.currentTime(0);
                    player.play();
                }
                //player.load();
                //player.play();
            };

            /**
             * Pauses the content video and displays the ad container so ads can play.
             * @param {google.ima.AdEvent} adEvent The AdEvent thrown by the AdsManager.
             * @ignore
             */
            player.ima.onContentPauseRequested_ = function (adEvent) {
                adsActive = true;
                adPlaying = true;
                player.off('ended', localContentEndedListener);
                if (adEvent.getAd().getAdPodInfo().getPodIndex() != -1) {
                    // Skip this call for post-roll ads
                    isLinear = 1;
                    player.ads.startLinearAdMode();
                }
                adContainerDiv.style.display = 'block';
                controlsDiv.style.display = 'block';
                vjsControls.hide();
                player.pause();
            };

            /**
             * Resumes content video and hides the ad container.
             * @param {google.ima.AdEvent} adEvent The AdEvent thrown by the AdsManager.
             * @ignore
             */
            player.ima.onContentResumeRequested_ = function (adEvent) {
                adsActive = false;
                adPlaying = false;
                player.on('ended', localContentEndedListener);
                adContainerDiv.style.display = 'none';
                vjsControls.show();
                if (!currentAd) {
                    // Something went wrong playing the ad
                    player.ads.endLinearAdMode();
                } else if (!contentComplete &&
                        // Don't exit linear mode after post-roll or content will auto-replay
                        currentAd.getAdPodInfo().getPodIndex() != -1) {
                    player.ads.endLinearAdMode();
                }
                countdownDiv.innerHTML = '';
            };

            /**
             * Starts the content video when a non-linear ad is loaded.
             * @param {google.ima.AdEvent} adEvent The AdEvent thrown by the AdsManager.
             * @ignore
             */
            player.ima.onAdLoaded_ = function (adEvent) {
                if (!adEvent.getAd().isLinear()) {
                    player.muted(0);
                    $('.video-js').css('opacity', '1');
                    player.play();
                }
            };

            /**
             * Starts the interval timer to check the current ad time when an ad starts
             * playing.
             * @param {google.ima.AdEvent} adEvent The AdEvent thrown by the AdsManager.
             * @ignore
             */
            player.ima.onAdStarted_ = function (adEvent) {
                currentAd = adEvent.getAd();
                var piwikTracker = Piwik.getTracker(analyticsUrl, analyticSiteId);
                piwikTracker.trackEvent('Ads', 'AdPlay', 'AdPlay', 1);
                if (currentAd.isLinear()) {
                    //globalPlayerObj.pause();
//                    var adHtmlNew = '<div class="vast-skip-button"></div>';
//                    $('#' + globalVideoTag).append(adHtmlNew);
//
//                    $('.' + globalVideoTag).on('click', '.enabled', function () {
//                        adsManager.addEventListener(
//                                google.ima.AdEvent.Type.SKIPPED,
//                                player.ima.onAdSkipped_);
//                        // Stop and clear ad assets
//                        adsManager.stop();
//                        $('.vast-skip-button').hide();
//                    });
//                    finalTime = 5;
//                    skipTimer(currentAd, adsManager);

                    adTrackingTimer = setInterval(
                            player.ima.onAdPlayheadTrackerInterval_, 250);
                    // Don't bump container when controls are shown
                    adContainerDiv.className = '';
                } else {
                    // Bump container when controls are shown
                    adContainerDiv.className = 'bumpable-ima-ad-container';
                    $('.vjs-control-bar').show();
                    overlayHeight = $('#ima-ad-container').height();

                }
            };

            /**
             * Clears the interval timer for current ad time when an ad completes.
             * @param {google.ima.AdEvent} adEvent The AdEvent thrown by the AdsManager.
             * @ignore
             */
            player.ima.onAdComplete_ = function (adEvent) {
                var piwikTracker = Piwik.getTracker(analyticsUrl, analyticSiteId);
                piwikTracker.trackEvent('Ads', 'AdEnded', 'AdEnded', 1);
                if (currentAd.isLinear()) {
                    $('.vjs-control-bar').show();
                    clearInterval(adTrackingTimer);
                    $('.vast-skip-button').hide();
                    if ((navigator.userAgent.match(/iPad/i))) {
                        player.requestFullscreen();
                    }
                }
            };

            player.ima.onAdSkipped_ = function (adEvent) {
                var piwikTracker = Piwik.getTracker(analyticsUrl, analyticSiteId);
                piwikTracker.trackEvent('Ads', 'AdSkip', 'AdSkip', 1);
                player.currentTime(0);
                player.play();
                if (currentAd.isLinear()) {
                    $('.vjs-control-bar').show();
                    clearInterval(adTrackingTimer);
                }
            };

            /**
             * Gets the current time and duration of the ad and calls the method to
             * update the ad UI.
             * @ignore
             */
            player.ima.onAdPlayheadTrackerInterval_ = function () {
                var remainingTime = adsManager.getRemainingTime();
                var duration = currentAd.getDuration();
                var currentTime = duration - remainingTime;
                currentTime = currentTime > 0 ? currentTime : 0;
                var isPod = false;
                var adPosition, totalAds;
                if (currentAd.getAdPodInfo()) {
                    isPod = true;
                    adPosition = currentAd.getAdPodInfo().getAdPosition();
                    totalAds = currentAd.getAdPodInfo().getTotalAds();
                }

                // Update countdown timer data
                var remainingMinutes = Math.floor(remainingTime / 60);
                var remainingSeconds = Math.floor(remainingTime % 60);
                if (remainingSeconds.toString().length < 2) {
                    remainingSeconds = '0' + remainingSeconds;
                }
                var podCount = ': ';
                if (isPod) {
                    podCount = ' (' + adPosition + ' of ' + totalAds + '): ';
                }
                countdownDiv.innerHTML =
                        'Advertisement' + podCount +
                        remainingMinutes + ':' + remainingSeconds;

                // Update UI
                var playProgressRatio = currentTime / duration;
                var playProgressPercent = playProgressRatio * 100;
                progressDiv.style.width = playProgressPercent + '%';
            };

            /**
             * Hides the ad controls on mouseout.
             * @ignore
             */
            player.ima.hideAdControls_ = function () {
                playPauseDiv.style.display = 'none';
                muteDiv.style.display = 'none';
                fullscreenDiv.style.display = 'none';
                controlsDiv.style.height = '14px';
            };

            /**
             * Shows ad controls on mouseover.
             * @ignore
             */
            player.ima.showAdControls_ = function () {
                controlsDiv.style.height = '37px';
                playPauseDiv.style.display = 'block';
                muteDiv.style.display = 'block';
                fullscreenDiv.style.display = 'block';
            };

            /**
             * Listener for clicks on the play/pause button during ad playback.
             * @ignore
             */
            player.ima.onAdClick_ = function () {
                var piwikTracker = Piwik.getTracker(analyticsUrl, analyticSiteId);
                piwikTracker.trackEvent('Ads', 'AdClick', 'AdClick', 1);
                playPauseDiv.className = 'ima-paused';
                adsManager.pause();
                adPlaying = false;
            };

            player.ima.onAdPlayPauseClick_ = function () {
                if (adPlaying) {
                    playPauseDiv.className = 'ima-paused';
                    adsManager.pause();
                    adPlaying = false;
                } else {
                    playPauseDiv.className = 'ima-playing';
                    adsManager.resume();
                    adPlaying = true;
                }
            };

            /**
             * Listener for clicks on the mute button during ad playback.
             * @ignore
             */
            player.ima.onAdMuteClick_ = function () {
                if (adMuted) {
                    muteDiv.className = 'ima-non-muted';
                    adsManager.setVolume(1);
                    // Bubble down to content player
                    player.muted(false);
                    adMuted = false;
                } else {
                    muteDiv.className = 'ima-muted';
                    adsManager.setVolume(0);
                    // Bubble down to content player
                    player.muted(true);
                    adMuted = true;
                }
            };

            /**
             * Listener for clicks on the fullscreen button durin ad playback.
             * @ignore
             */
            player.ima.onAdFullscreenClick_ = function () {
                if (player.isFullscreen()) {
                    player.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
            };

            /**
             * Listens for the video.js player to change its fullscreen status. This
             * keeps the fullscreen-ness of the AdContainer in sync with the player.
             * @ignore
             */
            player.ima.onFullscreenChange_ = function () {
                if (player.isFullscreen()) {
                    $('#ima-seek-bar-div').css('width', '100%');

                    fullscreenDiv.className = 'ima-fullscreen';
                    adContainerDiv.style.width = window.screen.width + 'px';
                    adContainerDiv.style.height = window.screen.height + 'px';
                    adsManager.resize(
                            window.screen.width,
                            window.screen.height,
                            google.ima.ViewMode.FULLSCREEN);
                } else {
                    fullscreenDiv.className = 'ima-non-fullscreen';

                    if (deviceType == 'desktop' && (navigator.userAgent.match(/Chrome/i) || navigator.userAgent.indexOf("Safari") > -1)) {
                        var pHt = $('.' + globalVideoTag).height();
                        var pWt = $('.' + globalVideoTag).width();

                        adContainerDiv.style.width = pWt;
                        adContainerDiv.style.height = pHt;
                        adsManager.resize(
                                pWt,
                                pHt,
                                google.ima.ViewMode.NORMAL);

                        if (isLinear == 1)
                        {
                            $('#ima-controls-div').show();
                            $('#ima-ad-container').css('width', playerDefaultWidth);
                            $('#ima-ad-container').css('height', pHt);


                        }
                        else {

                            $('#ima-ad-container').css('height', overlayHeight);
                            $('#ima-controls-div').hide();
                            $('#ima-ad-container').css('width', playerDefaultWidth);

                        }

                    } else {

                        if (deviceType == 'desktop') {
                            var pHt = $('.' + globalVideoTag).height();
                            var pWt = $('.' + globalVideoTag).width();

                            adContainerDiv.style.width = pWt;
                            adContainerDiv.style.height = pHt;
                            adsManager.resize(
                                    pWt,
                                    pHt,
                                    google.ima.ViewMode.NORMAL);
                        } else {

                            adContainerDiv.style.width = player.width() + 'px';
                            adContainerDiv.style.height = player.height() + 'px';
                            if (deviceType == 'mobile') {
                                if (isLinear == 1) {
                                    adsManager.resize(
                                            player.width(),
                                            player.height(),
                                            google.ima.ViewMode.NORMAL);
                                } else {
                                    adsManager.resize(
                                            player.width(),
                                            overlayHeight,
                                            google.ima.ViewMode.NORMAL);
                                }
                            } else {
                                adsManager.resize(
                                        player.width(),
                                        overlayHeight,
                                        google.ima.ViewMode.NORMAL);
                            }
                        }
                    }
                }
            };

            /**
             * Listens for the video.js player to change its volume. This keeps the ad
             * volume in sync with the content volume if the volume of the player is
             * changed while content is playing
             * @ignore
             */
            player.ima.onVolumeChange_ = function () {
                var newVolume = player.muted() ? 0 : player.volume();
                if (adsManager) {
                    adsManager.setVolume(newVolume);
                }
            };

            /**
             * Seeks content to 00:00:00. This is used as an event handler for the
             * loadedmetadata event, since seeking is not possible until that event has
             * fired.
             * @ignore
             */
            player.ima.seekContentToZero_ = function () {
                player.off('loadedmetadata', player.ima.seekContentToZero_);
                player.currentTime(0);
            };

            /**
             * Seeks content to 00:00:00 and starts playback. This is used as an event
             * handler for the loadedmetadata event, since seeking is not possible until
             * that event has fired.
             * @ignore
             */
            player.ima.playContentFromZero_ = function () {
                player.off('loadedmetadata', player.ima.playContentFromZero_);
                player.currentTime(0);
                player.play(); // TODO: comment this line to stoop playing video in background
            };

            /**
             * Destroys the AdsManager, sets it to null, and calls contentComplete to
             * reset correlators. Once this is done it requests ads again to keep the
             * inventory available.
             * @ignore
             */
            player.ima.resetIMA_ = function () {
                if (adsManager) {
                    adsManager.destroy();
                    adsManager = null;
                }
                if (adsLoader && !contentComplete) {
                    adsLoader.contentComplete();
                }
                contentComplete = false;
            };

            /**
             * Ads an EventListener to the AdsManager. For a list of available events,
             * see
             * https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdEvent.Type
             * @param {google.ima.AdEvent.Type} event The AdEvent.Type for which to
             *     listen.
             * @param {function} callback The method to call when the event is fired.
             */
            player.ima.addEventListener = function (event, callback) {
                if (adsManager) {
                    adsManager.addEventListener(event, callback);
                }
            };

            /**
             * Returns the instance of the AdsManager.
             * @return {google.ima.AdsManager} The AdsManager being used by the plugin.
             */
            player.ima.getAdsManager = function () {
                return adsManager;
            };

            /**
             * Sets the content of the video player. You should use this method instead
             * of setting the content src directly to ensure the proper ad tag is
             * requested when the video content is loaded.
             * @param {?string} contentSrc The URI for the content to be played. Leave
             *     blank to use the existing content.
             * @param {?string} adTag The ad tag to be requested when the content loads.
             *     Leave blank to use the existing ad tag.
             * @param {?boolean} playOnLoad True to play the content once it has loaded,
             *     false to only load the content but not start playback.
             */
            player.ima.setContent =
                    function (contentSrc, adTag, playOnLoad) {
                        player.ima.resetIMA_();
                        settings.adTagUrl = adTag ? adTag : settings.adTagUrl;
                        //only try to pause the player when initialised with a source already
                        if (!!player.currentSrc()) {
                            player.pause();
                        }
                        if (contentSrc) {
                            player.src(contentSrc);
                        }
                        if (playOnLoad) {
                            player.on('loadedmetadata', player.ima.playContentFromZero_);
                        } else {
                            player.on('loadedmetadata', player.ima.seekContentToZero_);
                        }
                    };

            /**
             * Adds a listener for the 'ended' event of the video player. This should be
             * used instead of setting an 'ended' listener directly to ensure that the
             * ima can do proper cleanup of the SDK before other event listeners
             * are called.
             * @param {function} listener The listener to be called when content
             *     completes.
             */
            player.ima.addContentEndedListener = function (listener) {
                contentEndedListeners.push(listener);
            };

            /**
             * Pauses the ad.
             */
            player.ima.pauseAd = function () {
                if (adsActive && adPlaying) {
                    playPauseDiv.className = 'ima-paused';
                    adsManager.pause();
                    adPlaying = false;
                }
            };

            /**
             * Resumes the ad.
             */
            player.ima.resumeAd = function () {
                if (adsActive && !adPlaying) {
                    playPauseDiv.className = 'ima-playing';
                    adsManager.resume();
                    adPlaying = true;
                }
            };

            /**
             * Set up intervals to check for seeking and update current video time.
             */
            player.ima.setUpPlayerIntervals_ = function () {
                updateTimeIntervalHandle =
                        setInterval(player.ima.updateCurrentTime, seekCheckInterval);
                seekCheckIntervalHandle =
                        setInterval(player.ima.checkForSeeking, seekCheckInterval);
            };

            /**
             * Updates the current time of the video
             */
            player.ima.updateCurrentTime = function () {
                if (!contentPlayheadTracker.seeking) {
                    contentPlayheadTracker.currentTime = player.currentTime();
                }
            };

            /**
             * Detects when the user is seeking through a video.
             * This is used to prevent mid-rolls from playing while a user is seeking.
             *
             * There *is* a seeking property of the HTML5 video element, but it's not
             * properly implemented on all platforms (e.g. mobile safari), so we have to
             * check ourselves to be sure.
             */
            player.ima.checkForSeeking = function () {
                var tempCurrentTime = player.currentTime();
                var diff = (tempCurrentTime - contentPlayheadTracker.previousTime) * 1000;
                if (Math.abs(diff) > seekCheckInterval + seekThreshold) {
                    contentPlayheadTracker.seeking = true;
                } else {
                    contentPlayheadTracker.seeking = false;
                }
                contentPlayheadTracker.previousTime = player.currentTime();
            };

            /**
             * Changes the flag to show or hide the ad countdown timer.
             *
             * @param {boolean} showCountdownIn Show or hide the countdown timer.
             */
            player.ima.setShowCountdown = function (showCountdownIn) {
                showCountdown = showCountdownIn;
                countdownDiv.style.display = showCountdown ? 'block' : 'none';
            };

            /**
             * Current plugin version.
             */
            var VERSION = '0.2.0';

            /**
             * Stores user-provided settings.
             */
            var settings;

            /**
             * Video element playing content.
             */
            var contentPlayer;

            /**
             * Boolean flag to show or hide the ad countdown timer.
             */
            var showCountdown;

            /**
             * Video.js control bar.
             */
            var vjsControls;

            /**
             * Div used as an ad container.
             */
            var adContainerDiv;

            /**
             * Div used to display ad controls.
             */
            var controlsDiv;

            /**
             * Div used to display ad countdown timer.
             */
            var countdownDiv;

            /**
             * Div used to display add seek bar.
             */
            var seekBarDiv;

            /**
             * Div used to display ad progress (in seek bar).
             */
            var progressDiv;

            /**
             * Div used to display ad play/pause button.
             */
            var playPauseDiv;

            /**
             * Div used to display ad mute button.
             */
            var muteDiv;

            /**
             * Div used to display ad fullscreen button.
             */
            var fullscreenDiv;

            /**
             * IMA SDK AdDisplayContainer.
             */
            var adDisplayContainer;

            /**
             * True if the AdDisplayContainer has been initialized. False otherwise.
             */
            var adDisplayContainerInitialized = false;

            /**
             * IMA SDK AdsLoader
             */
            var adsLoader;

            /**
             * IMA SDK AdsManager
             */
            var adsManager;

            /**
             * IMA SDK AdsRenderingSettings.
             */
            var adsRenderingSettings = null;

            /**
             * Ad tag URL. Should return VAST, VMAP, or ad rules.
             */
            var adTagUrl;

            /**
             * Current IMA SDK Ad.
             */
            var currentAd;

            /**
             * Timer used to track content progress.
             */
            var contentTrackingTimer;

            /**
             * Timer used to track ad progress.
             */
            var adTrackingTimer;

            /**
             * True if ads are currently displayed, false otherwise.
             * True regardless of ad pause state if an ad is currently being displayed.
             */
            var adsActive = false;

            /**
             * True if ad is currently playing, false if ad is paused or ads are not
             * currently displayed.
             */
            var adPlaying = false;

            /**
             * True if the ad is muted, false otherwise.
             */
            var adMuted = false;

            /**
             * True if our content video has completed, false otherwise.
             */
            var contentComplete = false;

            /**
             * Handle to interval that repeatedly updates current time.
             */
            var updateTimeIntervalHandle;

            /**
             * Handle to interval that repeatedly checks for seeking.
             */
            var seekCheckIntervalHandle;

            /**
             * Interval (ms) on which to check if the user is seeking through the
             * content.
             */
            var seekCheckInterval = 1000;

            /**
             * Threshold by which to judge user seeking. We check every 1000 ms to see
             * if the user is seeking. In order for us to decide that they are *not*
             * seeking, the content video playhead must only change by 900-1100 ms
             * between checks. Any greater change and we assume the user is seeking
             * through the video.
             */
            var seekThreshold = 100;

            /**
             * Stores data for the content playhead tracker.
             */
            var contentPlayheadTracker = {
                currentTime: 0,
                previousTime: 0,
                seeking: false,
                duration: 0
            };

            /**
             * Stores data for the ad playhead tracker.
             */
            var adPlayheadTracker = {
                currentTime: 0,
                duration: 0,
                isPod: false,
                adPosition: 0,
                totalAds: 0
            };

            /**
             * Content ended listeners passed by the publisher to the plugin. Publishers
             * should allow the plugin to handle content ended to ensure proper support
             * of custom ad playback.
             */
            var contentEndedListeners = [];

            /**
             * Local content ended listener for contentComplete.
             */
            var localContentEndedListener = function () {
                if (adsLoader && !contentComplete) {
                    adsLoader.contentComplete();
                    contentComplete = true;
                }
                for (var index in contentEndedListeners) {
                    contentEndedListeners[index]();
                }
                clearInterval(updateTimeIntervalHandle);
                clearInterval(seekCheckIntervalHandle);
                player.one('play', player.ima.setUpPlayerIntervals_);
            };

            settings = extend({}, ima_defaults, options || {});

            // Currently this isn't used but I can see it being needed in the future, so
            // to avoid implementation problems with later updates I'm requiring it.
            if (!settings['id']) {
                window.console.log('Error: must provide id of video.js div');
                return;
            }
            contentPlayer = document.getElementById(settings['id'] + '_html5_api');
            // Default showing countdown timer to true.
            showCountdown = true;
            if (settings['showCountdown'] == false) {
                showCountdown = false;
            }

            player.one('play', player.ima.setUpPlayerIntervals_);

            player.on('ended', localContentEndedListener);

            var contrib_ads_defaults = {
                debug: settings.debug,
                timeout: settings.timeout,
                prerollTimeout: settings.prerollTimeout
            };

            var ads_plugin_settings =
                    extend({}, contrib_ads_defaults, options['contribAdsSettings'] || {});

            player.ads(ads_plugin_settings);

            adsRenderingSettings = new google.ima.AdsRenderingSettings();
            adsRenderingSettings.loadVideoTimeout = 30000; //TODO: this setting is define the load time for ads video
            adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
            if (settings['adsRenderingSettings']) {
                for (var setting in settings['adsRenderingSettings']) {
                    adsRenderingSettings[setting] =
                            settings['adsRenderingSettings'][setting];
                }
            }

            if (settings['locale']) {
                google.ima.settings.setLocale(settings['locale']);
            }

            player.ima.createAdContainer_();

            adsLoader = new google.ima.AdsLoader(adDisplayContainer);

            //adsLoader.getSettings().setVpaidAllowed(true);
            adsLoader.getSettings().setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.INSECURE);
            if (settings.vpaidAllowed == false) {
                adsLoader.getSettings().setVpaidAllowed(false);
            }

            if (settings.locale) {
                adsLoader.getSettings().setLocale(settings.locale);
            }

            adsLoader.getSettings().setPlayerType('videojs-ima');
            adsLoader.getSettings().setPlayerVersion(VERSION);

            adsLoader.addEventListener(
                    google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
                    player.ima.onAdsManagerLoaded_,
                    false);
            adsLoader.addEventListener(
                    google.ima.AdErrorEvent.Type.AD_ERROR,
                    player.ima.onAdsLoaderError_,
                    false);

            if (!readyCallback) {
                readyCallback = player.ima.start;
            }
			
            player.on('readyforpreroll', readyCallback);
            player.on('fullscreenchange', player.ima.onFullscreenChange_);
            player.on('volumechange', player.ima.onVolumeChange_);
        };

        vjs.plugin('ima', imaPlugin);
    }(window.videojs));
}

function phandoImaAds(tagClass, mediaUrl, adUrl, poster, playerHeight, playerWidth, mediaType) {
    var Ads = function () {
        this.placeholder = document.getElementById('ima-sample-placeholder');
        this.placeholder.addEventListener('click', this.bind(this, this.init));
        //var adUrl = document.getElementById('adUrl').value;

        this.options = {
            id: 'content_video',
            adTagUrl: adUrl,
            debug: true,
            nativeControlsForTouch: false
        };

        this.events = [
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            google.ima.AdEvent.Type.CLICK,
            google.ima.AdEvent.Type.COMPLETE,
            google.ima.AdEvent.Type.FIRST_QUARTILE,
            google.ima.AdEvent.Type.LOADED,
            google.ima.AdEvent.Type.MIDPOINT,
            google.ima.AdEvent.Type.PAUSED,
            google.ima.AdEvent.Type.STARTED,
            google.ima.AdEvent.Type.THIRD_QUARTILE
        ];

        //this.console = document.getElementById('ima-sample-console');
    };

    Ads.prototype.init = function () {
        // Create the player
        this.createPlayer();
        this.player = videojs('content_video');

        $('.vjs-caption-settings').remove();
        // Initialize the IMA plugin
        this.player.ima(
                this.options,
                this.bind(this, this.adsManagerLoadedCallback));
        this.player.ima.initializeAdDisplayContainer();

        $('#content_video').bind('click', function () {
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
                this.player.requestFullscreen();
            }
            this.player.play();
        });

        // Request ads and play the video
        this.player.ima.requestAds();
        this.player.play();
        globalPlayerObj = this.player;
    };

    Ads.prototype.createPlayer = function () {
        var dumbPlayer = document.createElement('video');
        dumbPlayer.id = 'content_video';
        dumbPlayer.className = 'video-js videojs-sublime-skin';
        dumbPlayer.setAttribute('width', '100%');
        dumbPlayer.setAttribute('height', '100%');
        document.createAttribute('controls');
        dumbPlayer.setAttribute('autostart', 'true');
        dumbPlayer.setAttribute('preload', 'auto');
        var contentSrc = document.createElement('source');
        contentSrc.setAttribute('src', mediaUrl);
        contentSrc.setAttribute('type', mediaType);
        dumbPlayer.appendChild(contentSrc);
        this.placeholder.parentNode.appendChild(dumbPlayer);
        this.placeholder.parentNode.removeChild(this.placeholder);
    };

    Ads.prototype.adsManagerLoadedCallback = function () {
        for (var index = 0; index < this.events.length; index++) {
            this.player.ima.addEventListener(
                    this.events[index],
                    this.bind(this, this.onAdEvent));
        }
        this.player.ima.start();
    };

    Ads.prototype.onAdEvent = function (event) {
        //this.console.innerHTML =this.console.innerHTML + '<br/>Ad event: ' + event.type;
    };

    Ads.prototype.bind = function (thisObj, fn) {
        return function () {
            fn.apply(thisObj, arguments);
        };
    };


    var ads = new Ads();
}

function getMediaDuration(playerObj) {
    return playerObj.duration().toFixed(2);
}


function changeSource(src, player) {
    player.pause();
    player.currentTime(0);

    player.src(src);

    player.ready(function () {
        this.one('loadeddata', videojs.bind(this, function () {
            this.currentTime(0);
        }));
        this.load();
        this.play();
    });
    player.controls('true');
    $('.changeSrc').remove();
    $('.vast-blocker').remove();
}

function changeMediaSourceWithAds(src, player, poster, title, vast, watermark) {

    var newtag = globalVideoTag + '1';
    $("." + globalVideoTag).after("<div class='" + newtag + "'></div>");
    var sourceUrl = src;
    var poster = poster;
    var vastAdsUrl = vast;



    initPlayer(newtag, sourceUrl, 'video/mp4', poster, 1, 1, '100%', '100%', vastAdsUrl);

    var phandoPlayer = playerOptions(newtag, '6e68768', watermark, vastAdsUrl, 0, 'flash,html5', 2);
    $("." + globalVideoTag).hide();
    globalVideoTag = newtag;
}

function changeMediaSource(src, player, poster, title) {
    player.pause();
    player.currentTime(0);

    player.src(src);
    player.poster(poster);
    vTitle = title;

    player.ready(function () {
        this.one('loadeddata', videojs.bind(this, function () {
            this.currentTime(0);
        }));
        this.load();
        $('.vjs-loading-spinner').hide();
        //this.play();
    });
    player.controls('true');
}

function isPlaying() {
    setTimeout(function () {

    }, 100);
}

/**
 * reply funtion to reply video using player object..
 * @param object player
 * @returns none
 */
function replay(player) {
    player.currentTime(0);
    player.play();
    console.log('replaying video..');
}

function getCurrentTime(player) {
    setTimeout(function () {
        getCurrentTime(player);
    }, 1000);
    return ct = player.currentTime();
}

function overlayAds(playerObj) {
    playerObj.overlay({
        content: '',
        overlays: [{
                content: adsHtml,
                start: 0,
                end: 'end',
                align: 'bottom'
            }]
    });
}

function closeOverlay() {
    $('.vjs-overlay').remove();
    globalPlayerObj.play();
}

function isPlaybackStarted1(playerObj) {
    if (rt == 0) {
        setTimeout(function () {
            isPlaybackStarted1(playerObj);
        }, 500);
    }
    ctt = playerObj.currentTime();
    if (ctt > 0 && rt == 0) {
        overlayAds(playerObj);

        //playerObj.pause();
        rt = 1;
    }
}

function phandoImaAdsSimple(player, adsUrl, videoTagId) {

    var Ads = function () {

        this.player = player;

        this.adTagInput = adsUrl;

        // Remove controls from the player on iPad to stop native controls from stealing
        // our click
        var contentPlayer = document.getElementById(videoTagId + '_html5_api');
        if ((navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/Android/i)) &&
                contentPlayer.hasAttribute('controls')) {
            contentPlayer.removeAttribute('controls');
        }

        // Start ads when the video player is clicked, but only the first time it's
        // clicked.
        var startEvent = 'play';
        if (navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/Android/i)) {
            startEvent = 'tap';

            if (navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Firefox/i)) {
                startEvent = 'play';
            }
        }

        if (isMobileAutoPlayUI == 0) {
            this.player.one(startEvent, this.bind(this, this.init));
        }

        this.options = {
            id: videoTagId,
            debug: false
        };

        this.events = [
            google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
            google.ima.AdEvent.Type.CLICK,
            google.ima.AdEvent.Type.COMPLETE,
            google.ima.AdEvent.Type.FIRST_QUARTILE,
            google.ima.AdEvent.Type.LOADED,
            google.ima.AdEvent.Type.MIDPOINT,
            google.ima.AdEvent.Type.PAUSED,
            google.ima.AdEvent.Type.STARTED,
            google.ima.AdEvent.Type.THIRD_QUARTILE
        ];

        //this.console = document.getElementById('ima-sample-console');
        this.player.ima(
                this.options,
                this.bind(this, this.adsManagerLoadedCallback));

    };

    Ads.prototype.SAMPLE_AD_TAG = 'http://pubads.g.doubleclick.net/gampad/ads?' +
            'sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&' +
            'ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&' +
            'unviewed_position_start=1&' +
            'cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&' +
            'vid=short_onecue&correlator=';

    Ads.prototype.init = function () {
        if (this.adTagInput == '') {
            this.log('Error: please fill in an ad tag');
        } else {
            this.player.ima.initializeAdDisplayContainer();
            this.player.ima.setContent(null, this.adTagInput, true);
            this.player.ima.requestAds();
            //this.player.ima.play(); //TODO:
        }
    };

    Ads.prototype.onSampleAdTagClick_ = function () {
        this.adTagInput = adsUrl;
    };

    Ads.prototype.adsManagerLoadedCallback = function () {
        for (var index = 0; index < this.events.length; index++) {
            this.player.ima.addEventListener(
                    this.events[index],
                    this.bind(this, this.onAdEvent));
        }
        this.player.ima.start();
    };

    Ads.prototype.onAdEvent = function (event) {
        this.log('Ad event: ' + event.type);
    };

    Ads.prototype.log = function (message) {
        //this.console.innerHTML = this.console.innerHTML + '<br/>' + message;
    };

    Ads.prototype.bind = function (thisObj, fn) {
        return function () {
            fn.apply(thisObj, arguments);
        };
    };

    var ads = new Ads();

}

function skipTimer(player, adsManager)
{
    if (finalTime >= 0) {
        if (finalTime == 0) {
            $('.vast-skip-button').addClass('enabled');
            $('.vast-skip-button').html('Skip');
            finalTime = -1;
        } else {
            var remainingTime = adsManager.getRemainingTime();
            var duration = player.getDuration();
            var currentTime = duration - remainingTime;
            if (currentTime.toFixed(0) < 0) {
                currentTime = 0;
            }
            var ft = 5 - currentTime;
            console.log(currentTime + ' : ' + ft.toFixed(0));
            if (ft.toFixed(0) <= 0) {
                $('.vast-skip-button').addClass('enabled');
                $('.vast-skip-button').html('Skip');
                finalTime = -1;
            } else {
                $('.vast-skip-button').html('Skip in ' + ft.toFixed(0));
                finalTime = ft.toFixed(0) - 1;
            }

            if (globalPlayerObj.currentTime() > 0) {
                globalPlayerObj.currentTime(0);
                globalPlayerObj.pause();
            }
        }
        setTimeout(function () {
            skipTimer(player, adsManager);
        }, 1000);
    }
}


function isPlaybackStartedNew(playerObj) {
    if (socialShare == 0 || socialShare == 1) {
        setTimeout(function () {
            isPlaybackStartedNew(playerObj);
        }, 500);
    }
    curentPtime = playerObj.currentTime();
    if (curentPtime > 0 && socialShare == 0) {
        $('.vjs-sharing-container1').css('visibility', 'visible');
        socialShare = 2;
        if (isMobileAutoPlayUI == 1 || deviceType == 'mobile')
            $('.vjs-control-bar').css('display', 'block');
        //$('#ima-ad-container').hide();
    }
    if (curentPtime > 2) {
        $('.vjs-control-bar').css('display', 'block');
        playerObj.play();
    }

    if (socialShare == 2 && curentPtime < 1) {
        if (deviceType == 'desktop' && isLinear == 1)
            $('#ima-ad-container').hide();
        setTimeout(function () {
            isPlaybackStartedNew(playerObj);
        }, 500);
    }

    if (curentPtime > 0 && socialShare == 1) {
        $('.vjs-control-bar').hide();
        playerObj.currentTime(0);
        playerObj.pause();
    }

}
function checkFullScreen(playerObj, videoTagId) {

    var isfull = playerObj.isFullscreen();
    if (isfull) {
        setTimeout(function () {

            $('#' + videoTagId).removeClass('vjs-fullscreen');
            $('.' + videoTagId).css('width', '100%');
            $('.' + videoTagId).css('height', '100%');
            var pHt = $('.' + videoTagId).height();
            var pWt = $('.' + videoTagId).width();
            var pHt = $(window).height();
            var pWt = $(window).width();


            $('#' + videoTagId).css('width', pWt);
            $('#' + videoTagId).css('height', pHt);
            $('.vjs-fullscreen-control').css('content', "\e00b");
        }, 50);
    } else {

        $('#' + videoTagId).css('width', playerDefaultWidth);
        $('#' + videoTagId).css('height', playerDefaultHeight);
        $('.' + videoTagId).css('width', playerDefaultWidth);
        $('.' + videoTagId).css('height', playerDefaultHeight);
        $('.vjs-fullscreen-control').css('content', "\e000");
    }
    setTimeout(function () {
        checkFullScreen(playerObj, videoTagId);
    }, 500);
}

function changeMediaSrcWithAdsTag(src, player, vastAdsUrl) {
    player.ima.initializeAdDisplayContainer();
    player.ima.setContent('', vastAdsUrl, true);
    player.ima.requestAds();
}