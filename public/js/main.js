const Scroller = new Scroll(),
    database = firebase.database();
var cache = [],
    scriptLoaded = false;

/**
 * @description This function is executed when a change occurs in the scroll reference of the database, and will execute the scroll function with the new indexxes of the selected lines.
 */
database.ref('scroll').on('value', snapshot => {
    if (snapshot.val() && scriptLoaded) {
        Scroller.scroll(snapshot.val().sort((a, b) => {
            return a - b
        }))
        $("#overlay").hide()
    } else if (snapshot.val()) {
        cache = snapshot.val().sort((a, b) => {
            return a - b
        })
    } else Scroller.scroll([0]), M.toast({
        html: "Geen huidige regel gevonden..."
    })
    // if (snapshot.val()) Scroller.scroll(snapshot.val())
});

/**
 * @description This function is executed when a change occurs in the confetti reference of the database, and will either start or stop the confetti.
 */
database.ref('confetti').on('value', snapshot => {
    snapshot.val() ? confetti.start() : confetti.stop()
});

/**
 * @description This function is executed when a change occurs in the exclude reference of the database, and will toggle the exclude class on the given indexxes.
 */
database.ref('exclude').on('value', function (snapshot) {
    $(".exclude").removeClass("exclude")
    snapshot.val().forEach(exclude => {
        $(`#${exclude}`).addClass("exclude")
    })
});

/**
 * @description This function is executed when a the user is either logged in or did a false attempt to login. It only toggles styles and does not take care of any real database rights since that is handled on the server. No hackerbois!! ;)
 */
firebase.auth().onAuthStateChanged((user) => {
    if (user && user.email == 'superuser@lentefeest.ga') $("body").attr("loggedin", "true")
});

/**
 * @description This block of code is executed when jQuery is successfully initialized and will give every line a unique index, and will also handle the click events (on the lines and on the scrollspy) 
 */
$(async () => {
    // $('.dropdown-trigger').dropdown();
    $("#overlay h4").text("Script inlezen...")
    $.ajax({
        "async": true,
        "crossDomain": true,
        "url": "https://docs.google.com/document/d/e/2PACX-1vR7aUYBBloQVrz25_jg7NtOv8XgAyfhaJ7psswUDa9HZBumq--eBIeyACzFzeEcdvRB1N3nFDUQIcdm/pub?embedded=true",
        "method": "GET"
    }).done(function (response) {
        response = response.replace(response.substring(response.indexOf("li{"), response.indexOf("</style>")), "")
        $("#overlay h4").text("Script inlezen...")
        $("#script").html(response);
        if (localStorage.getItem("theme") == "dark") $("body").attr("theme", "dark")
        if (location.hash == "#embed") $(".navbar-fixed").hide(), $("body").attr("embed", "true") //   These attributes are read by the CSS
        if (location.hash == "#mobile" || $(window).width() < 900) $("body").attr("mobile", "true") // and will hide/show some elements
        // $("#script p > span").each(function (index) {
        //     $(this).attr("id", `scene-${index}`)
        //     if ($(this).text()) {
        //         var text = $(this).text()
        //         console.log(text)
        //         // $(this).text(text.substring(0, text.indexOf(text.match(/\d+/))) + text.match(/\d+/)[0])
        //         $("#scrollspy > ul").append(`<li index="${index}"><a>${$(this).text()}</a></li>`)
        //     }
        // })
        $("#script *").each(function (index) {
            $(this).attr("id", index)
            $(this).find("*").each(function () {
                if ($(this).css("font-weight") == 700) {
                    $(this).addClass("bold")
                }
                if ($(this).css("text-decoration").indexOf("underline") > -1) {
                    if ($(this).text()) {
                        var text = $(this).text()
                        $(this).addClass("scene")
                        $(this).text(text.substring(0, text.indexOf(text.match(/\d+/))) + text.match(/\d+/)[0])
                        $("#scrollspy > ul").append(`<li index="${index}"><a>${$(this).text()}</a></li>`)
                        return
                    }
                }
            })
            if (!$(this).is(".title")) $(this).click(function () {
                Scroller.scrollTo(false, this)
            });
        })
        $("#scrollspy > ul > li").each(function () {
            $(this).attr("value", $(this).text())
            $(this).click(() => Scroller.scroll([$(`#${$(this).attr("index")}`).attr("id")], true))
        })
        $("#overlay h4").text("Positie bepalen...")
        $(".fixed-action-btn").click(() => Scroller.scrollTop())
        scriptLoaded = true
        if (cache.length) Scroller.scroll(cache), $("#overlay").hide()
    });
})

const
    /**
     * @description This function will prompt a password and tries to login with that given password into the superuser account on the firebase authentication server.
     */
    login = () => {
        firebase.auth().signInWithEmailAndPassword('superuser@lentefeest.ga', prompt("Wat is de geheime code niffo")).catch(() => alert("HA REKT IS FOUT"))
    },

    /**
     * @description This function is executed when the user clicks on "Einde". It will toggle the confetti boolean on in the database.
     */
    toggleConfetti = () => {
        database.ref('confetti').set(confetti.isRunning() ? false : true)
    },

    /**
     * @description This function is executed when the user clicks on the lightbulb in the navbar and toggles dark mode by giving the body tag a attribute called theme. The CSS will recogize the `theme="dark"` and will change styles to dark.
     */
    toggleTheme = () => {
        if ($("body").attr("theme") == "dark") $("body").attr("theme", "light"), localStorage.setItem("theme", "light")
        else $("body").attr("theme", "dark"), localStorage.setItem("theme", "dark")
    }

$(window).on('resize', Scroller.assignSelector).keydown(Scroller.onKeydown).scroll(Scroller.onScroll);