
function displayHooks(){

    return `
    <div class="heroImageJS heroImage">
    </div>
    <div class="newGigsJS newGigs">
    </div>
    <div class="">
    </div>
    `;


}



function displayHero(){
    return `
        <h1 class="homepageTitle">Welcome to the MidLife Crisis Band</h1>
        <div> 
            <img src="originalMLC.jpg" alt="Picture of the MLC (Midlife Crisis) Band" class = "heroImagePic" >
        </div>
    `;
}

function displayGigs(){
    return `
        <h2 class="gigsList">Join Us at an Upcoming Gig:</h2>
        <div class="gigsContainer"
            <ul>
                <li>March 1, 2019: Behans Irish Bar, 1327 Broaway, Burlingame CA 94010</li>
                <li>April 9, 2019: Vinyl Room, 221 Park Rd, Burlingame, CA 94010</li>
            </ul>
        </div>
    `;
}



function displayLandingPage(){


    return `
    <div class="landingPageBody">
        <div class="shadingContainer">
            <h1 class="headline landingPageCopy">The Midlife Crisis (MLC)</h1>
            <h2 class="subHeadline landingPageCopy">Follow the hottest band in Silicon Valley</h2>
            <div class="benefits landingPageCopy">
                <p class="CTA">Subscribe to get up-to-the-minute and exclusive:</p>
                <div class="benefitsContainer">
                    <ul class="benefitsList">
                        <li class="benefit"><img src="icon-event-white.png" class="icon"><span class="benefitCopy">Upcoming Gigs</span></li>
                        <li class="listItem"><img src="icon-note-white.png" class="icon"><span class="benefitCopy">New Releases</span></li>
                        <li class="listItem"><img src="icon-pic-white.png" class="icon"><span class="benefitCopy">Pics From Performances</span></li>
                    </ul>
                </div>
            </div>
            <div class="signInSignUp">
                <div class="signIn">
                    <form class="signInFormJS signInForm" role="form" action="/login.html" method="get">
                        <button type="submit" class="loginStartButtonJS standardButton">Login</button>
                    </form>
                </div>
                <div class="signUp">
                    <form class="registerFormJS registerForm" role="form" action="/signup.html" method="get">
                        <button type="submit" class="registerStartButtonJS standardButton">Sign Up</button>
                    </form>
                </div>
            </div>
            <div class="demoCredentials">
                <p>Demo Credentials:</p>
                <p>username: me</p>
                <p>password: Hello12345</p>
            </div>
        </div>
    </div>
    <br>        
    `;
}



function startBand(){


    let status = "not yet set";

    checkAuthStatus(status)
        .then(function (stat) {

            // check authentication status.
            if(stat !== "authenticated") {
                // if not logged in, then display a subscribe button below upcoming concerts
                $(".headerJS").html(displayHeader(stat));
                $(".mainJS").html(displayLandingPage());
                
            }  
            // If logged in do not display
        
            else if((stat)== "authenticated")
                {
                    $(".headerJS").html(displayHeader(stat));
                    $(".mainJS").html(displayHooks());
                    $(".heroImageJS").html(displayHero());
                    $(".newGigsJS").html(displayGigs());        
                };

        })

    $(".headerJS").on("click",".logout" ,function(event) {
        event.preventDefault();
        logoutUser();
    })


};



$(startBand);