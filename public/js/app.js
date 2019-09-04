$(document).ready(function() {
    //SCROLLING FUNCTION 
    $('.parallax').parallax();
    //CLICK TO SAVE ARTICLE
    $(document).on("click", "#save", function() {
        $.ajax({
            method: "POST",
            url: "/save",
            data: {
                title: $(this).data("title"),
                link: $(this).data("link"),
                teaser: $(this).data("teaser"),
                imgLink: $(this).data("imglink")
            }
        });
    });

    //CLICKS TO DETELE ARTICLE
    $(document).on("click", "#delete", function() {
        var id = $(this).data("id");
        console.log(id);
        $.ajax({
            method: "DELETE",
            url: "/delete/" + id
        });
        location.href = "/articles";
    });
    
    //SAVES NOTES FOR SPECIFIC ARTICLE
    //TO DO: MAKE IT CLOSE!
    //MAKES HEADER NOT ACTIVE
    $(document).on("click", "#saveNote", function() {
        event.preventDefault();
        var id = $(this).data("id");
         var baseURL = window.location.origin;
        var note = $(".materialize-textarea").val().trim();
        var title = $("#noteTitle").val().trim();

        $.ajax({
            method: "POST",
            url: baseURL + "/articles/" + id,
            data: {
            	title: title,
                body: note
            }
        })
        .done(function() {
        $(".materialize-textarea").val("");
        $("#noteTitle").val(""); 
        });
       
    });

    //DELETE NOTES 
    $(document).on("click", "#deleteNote", function() {
    	event.preventDefault();
    	var id = $(this).data("id");
    	console.log(id);
    	$.ajax({
    		method: "DELETE",
    		url: "/delete/notes/" + id
    	});
        location.href = "/articles";
    });

});