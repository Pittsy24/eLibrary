const $ = require("jQuery");

$(()=>{
    $(".icon").click((event) => {
        $(".selected").removeClass("selected");
        $(event.currentTarget).addClass("selected");
    });
})

