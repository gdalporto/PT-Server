function displayLogin(){
    return `
    <form class="loginFormJS  signInForm" role = "form" action="*" method="post">
        <fieldset name="user-login">
            <legend class="legendMessage">Log in to your account</legend>
            <input class="userNameBoxJS " type="email" name="userName" placeholder="your@email.com"/><br>
            <input class="passwordBoxJS " type="password" name="password" placeholder="password" autocomplete ="off"/><br>
            <button type="submit" class="loginButtonJS standardButton">submit</button>
        </fieldset>
    </form>
    <br>        
    `;
}

function unauthenticatedMessage(){
    $(".legendMessage").append(" - ERROR, INCORRECT USERNAME OR PASSWORD");
    $(".userNameBoxJS").val("");
    $(".passwordBoxJS").val("");    
};


function loginUser(userData) {
    let postUrl="/auth/login/";
    fetch(postUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if(response.status == 401) {
            unauthenticatedMessage();
        }
        return response.json();
    })
    .then(jsonData =>{
        window.localStorage.setItem("authorizationToken", jsonData.authToken);
        window.location.replace("/");    
    })
    .catch(err => {
        console.error(err);
        $(".subscribeJS").html("Error - API failed");    
    })
};







function startSigninPage(){
    let status = "not yet set";

    checkAuthStatus(status, function (stat) {
        console.log("after auth check in main body");
        $(".headerJS").html(displayHeader(stat));

        if(!(((stat)) == "authenticated")) {
            console.log("Inside If Statement, not authenticated");
            $(".loginDetailsJS").html(displayLogin());

            $(".loginButtonJS").on("click",function(event){
                event.preventDefault();
                const userData = {
                    username: $(".userNameBoxJS").val(),
                    password:$(".passwordBoxJS").val(),
                };
                console.log(userData);
                loginUser(userData);            
            });
    }  

    // IF LOGGED IN, DISPLAY ACCOUNT CRUD OPERATION

        else {
            console.log("inside else statement, authenticated");
            $(".loginDetailsJS").html("Error, user already authenticated");
            $(".logout").on("click", function(event) {
                event.preventDefault();
                logoutUser();
            })
    

        };

    });
}

$(startSigninPage);