/**
 * @class Scroll
 * @classdesc This class handles all the scolling to - and algoritms to scroll to - any highlighted piece of script, saved in the database
 */
class Scroll {
    /**
     * @description Contains some handy variabled :)
     */
    constructor() {
        this.scrolled = 0
        this.scrolling = false
        this.topMargin = 0
        this.elems = []
    }

    /**
     * @description This function is executed when a user clicks (using arrowkeys/space also counts as click) on a script sentence. It calculates which other sentences belong to the selected one and then pushes an array of line indexxes to the realtime firebase database
     */
    async scrollTo(elems, that) {
        if (!elems) {
            if (location.hash == "#embed" || $(that).text() == "") return
            var elems_after = [$(that).attr("id")]
            for (var i = 1; i < 100; i++) {
                var elem = $(`#${(elems_after[i-1])}`).next()
                // if (elem.find("span").text() == "" || elem.hasClass("c3")) break
                if (!elem.text()) break
                elems_after.push(elem.attr("id"))
                // if (elem.hasClass("c4") || elem.hasClass("asdasddsasad")) break
            }
            elems_after = elems_after.splice(1, 1)
            var elems_before = [$(that).attr("id")]
            for (var i = 1; i < 100; i++) {
                var elem = $(`#${(elems_before[i-1])}`).prev()
                // if (elem.find("span").text() == "" || elem.hasClass("c3")) break
                if (!elem.text()) break
                elems_before.push(elem.attr("id"))
            }
            elems = elems_after.concat(elems_before)
        }
        this.elems = filter_array(elems)
        if (this.elems.length == 0) return
        firebase.database().ref('scroll').set(this.elems)
        return
    }

    /**
     * @description This function is executed when the database is updated, and will scroll to 300px above the first index (selected line). It will also call to assingSelector to move the purple bar to the selected portion.
     */
    scroll = async (val, scene) => {
        if ($("#overlay").is(":visible")) $("#overlay").hide()
        this.topMargin = scene ? 100 : 200
        this.elems = val
        this.assignSelector()
        $(".c24 .selected").removeClass("selected")
        if (this.scrolling) return
        this.scrolling = true
        $('html, body').animate({
                scrollTop: ($(`#${this.elems[0]}`).offset().top - this.topMargin),
            },
            (location.hash == "#embed" ? 500 : 200),
            'linear',
            () => {
                this.scrolling = false
                this.scrolled = ($(`#${this.elems[0]}`).offset().top - this.topMargin)
            }
        )
    }

    /**
     * @description This function is executed when the FAB (floating action button) is pressed, and will (client side) scroll the user back to the current position.
     */
    scrollTop = async () => {
        this.scroll(this.elems)
    }

    /**
     * @description This function is executed by the scroll function and moves the purple bar to the current selected lines.
     */
    assignSelector = function () {
        if (!this.elems || !this.elems.length) return
        if (location.hash == "#mobile" || $(window).width() < 900) $("body").attr("mobile", "true")
        else $("body").attr("mobile", "false")
        var height = 0
        this.elems.forEach(elem => height += $(`#${elem}`).height())
        // $(".indicator").css("top", ($(`#${max(this.elems)}`).offset().top - height))
        $(".indicator").css("top", ($(`#${max(this.elems)}`).offset().top - height) + $(`#${max(this.elems)}`).height())
        $(".indicator").css("left", ($(`#0`).offset().left - 20))
        $(".indicator").css("height", height)
    }

    /**
     * @description This function is executed when any key is pressed on the page. It then filters for the arrow keys which will irritate thru the lines.
     */
    onKeydown = async (e) => {
        if ([37, 38].includes(e.which)) {
            e.preventDefault();
            for (var id = parseInt(min(this.elems)) - 1; id < parseInt(min(this.elems)) + 100; id--) {
                if ($(`#${id}`).text()) {
                    $(`#${id}`).click()
                    break
                }
            }
        } else if ([32, 39, 40].includes(e.which)) {
            e.preventDefault();
            for (var id = parseInt(max(this.elems)) + 1; id < parseInt(max(this.elems)) + 100; id++) {
                if ($(`#${id}`).text()) {
                    $(`#${id}`).click()
                    break
                }
            }
        }
    }

    /**
     * @description This function is executed when the scroll event is fired on the document. It will check which scene is currently visable in the window and set the scrollspy & little thinghy in the up-left corner to the current scene
     */
    onScroll = async () => {
        if (this.elems.length == 0) return
        // var y = (($(`#${elems[0]}`).offset().top - this.topMargin) - $(window).scrollTop())
        // if ((y < -30 || y > 30)) $(".fixed-action-btn").show()
        // else $(".fixed-action-btn").hide()
        var elScrolledBy = [],
            currentSceneText = 'scene 1'

        $(".c26").each(function () {
            if ($(this).text() != "") {
                if (window.scrollY + ($(window).height() / 2) > ($(this).offset().top + $(this).height()))
                    elScrolledBy.push($(this))
            }
        })

        if (elScrolledBy[elScrolledBy.length - 1]) currentSceneText = $(elScrolledBy[elScrolledBy.length - 1]).first().text()
        $("a.active").removeClass("active")
        $(`li[value="${currentSceneText}"`).find("a").addClass("active")
        $("#currentScene span").text(currentSceneText)
    }
}

/**
 * @private
 * @description This function is currently only executed by the scrollTo function, and will remove any empty, null, undefined or false items from the given array (note: its async so an await on the call is required!)
 */
const filter_array = function (test_array) {
        var index = -1,
            arr_length = test_array ? test_array.length : 0,
            resIndex = -1,
            result = [];
        while (++index < arr_length) {
            var value = test_array[index]
            if (value) result[++resIndex] = value
        }
        return result;
    },
    min = function (input) {
        if (toString.call(input) !== "[object Array]")
            return false;
        return Math.min.apply(null, input);
    },
    max = function (input) {
        if (toString.call(input) !== "[object Array]")
            return false;
        return Math.max.apply(null, input);
    }