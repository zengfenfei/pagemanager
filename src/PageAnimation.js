define(function (require) {
    var $ = require('jquery');

    var DURATION = 500;
    var EASING = 'easing';

    var MOVE_ANIMATION_COVER = 'cover';
    var MOVE_ANIMATION_SLIDE = 'slide';
    var MOVE_ANIMATION_REVEAL = 'reveal';

    /**
     * oldPage Current displaying dom
     * newPage The new Page dom to show
     *
     */
    function pageAnimation (oldPage, newPage, cb) {

    }

    /**
     *
     * type: cover | slide | reveal
     *
     * e.g.
     *  reveal-left: old page move from left
     *  cover-left: new page move in from right
     *  slide-left: both page move to left
     *
     */
    function createMoveAni (dir, type) {
        var moveAnimations = [MOVE_ANIMATION_COVER, MOVE_ANIMATION_SLIDE, MOVE_ANIMATION_REVEAL];
        if (moveAnimations.indexOf(type) === -1) {
            throw new Error('Unkown move animation type ' + type);
        }
        var translateDir;
        if (dir === 'left' || dir === 'right') {
            translateDir = 'translateX';
        } else if (dir === 'up' || dir === 'down') {
            translateDir = 'translateY';
        } else {
            console.assert(false, 'Unkown direction for cover animation of page: ' + dir);
            return;
        }

        var translationNegative = (dir === 'right' || dir === 'down');
        var horizontal = (dir === 'right' || dir === 'left');

        return function (oldPage, newPage, cb) {
            var container = oldPage.parentNode;
            var translation = horizontal ? container.clientWidth : container.clientHeight;
            translationNegative && (translation = -translation);

            oldPage.style.webkitTransform = 'none';
            if (type !== MOVE_ANIMATION_REVEAL) {
                newPage.style.webkitTransform = translateDir + '(' + translation + 'px)';
                container.appendChild(newPage); // Make new Page on top of the old one.
            } else {
                newPage.style.webkitTransform = 'none';
                container.insertBefore(newPage, oldPage);   // Old page is on top of new page, then old page move away, reveal new Page
            }

            var animationCount = 0;
            function callback () {
                animationCount--;
                if (animationCount > 0) {
                    return;
                }
                animationCount = null;

                if (type === MOVE_ANIMATION_REVEAL) {
                    container.appendChild(newPage);
                }
                oldPage.style.webkitTransform = 'none';
                newPage.style.webkitTransform = 'none';

                cb && cb();
            }

            /*
            left animation
                 ________________________________
                | type   | old page  | new page  |
                |--------|-----------------------|
                | cover  | -         | move left |
                | slide  | move left | move left |
                | reveal | move left | -         |
                |________________________________|
            */
            if (type != MOVE_ANIMATION_REVEAL) {
                var newPageAniProps = {};
                newPageAniProps[translateDir] = 0;
                animationCount++;
                $(newPage).animate(newPageAniProps, DURATION, EASING, callback);
            }

            if (type != MOVE_ANIMATION_COVER) {
                var oldPageAniProps = {};
                oldPageAniProps[translateDir] = (-translation) + 'px';
                animationCount++;
                $(oldPage).animate(oldPageAniProps, DURATION, EASING, callback);
            }
        }
    }



    // SetTimeout callback function
    function setStyle (style, prp, value) {
        style[prp] = value;
    }

    var animations = {
        'cover-left': createMoveAni('left', MOVE_ANIMATION_COVER),
        'cover-right': createMoveAni('right', MOVE_ANIMATION_COVER),
        'cover-up': createMoveAni('up', MOVE_ANIMATION_COVER),
        'cover-down': createMoveAni('down', MOVE_ANIMATION_COVER),
        'slide-left': createMoveAni('left', MOVE_ANIMATION_COVER),
        'slide-right': createMoveAni('right', MOVE_ANIMATION_COVER),
        'slide-up': createMoveAni('up', MOVE_ANIMATION_COVER),
        'slide-down': createMoveAni('down', MOVE_ANIMATION_COVER),
        'reveal-left': createMoveAni('left', MOVE_ANIMATION_REVEAL),
        'reveal-right': createMoveAni('right', MOVE_ANIMATION_REVEAL),
        'reveal-up': createMoveAni('up', MOVE_ANIMATION_REVEAL),
        'reveal-down': createMoveAni('down', MOVE_ANIMATION_REVEAL),
    };


    return animations;
});