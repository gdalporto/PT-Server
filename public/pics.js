

function displayImages(){
    return `
        <div> 
            <img src="originalMLC.jpg" alt="Picture of the MLC (Midlife Crisis) Band" class = "pic" >
        </div>
        <div> 
            <img src="originalMLC2.jpg" alt="Picture 2 of the MLC (Midlife Crisis) Band" class = "pic" >
        </div>
    `;
}








function startPicsPage(){

    checkAuthStatus(status, function (stat) {
        $(".headerJS").html(displayHeader(stat));
        $(".imagesJS").html(displayImages());
        $(".logout").on("click", function(event) {
            event.preventDefault();
            logoutUser();
        })

    });
}

$(startPicsPage);