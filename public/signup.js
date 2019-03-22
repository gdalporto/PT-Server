function displaySubscribe(){
    return `
    <form class="registerFormJS registerForm" role="form" action="/user" method="post">
        <fieldset name="user-info">
            <legend>Create a user account</legend>
            <input class="registerUserNameBoxJS" id="username" type="email" name="userName" required placeholder="your@email.com"/><br>
            <input class="registerPasswordBoxJS" type="password" name="password" required placeholder="password"/><br>
            <input class="registerFirstNameBoxJS" type="text" name="firstName" required placeholder="first name"/><br>
            <input class="registerLastNameBoxJS" type="text" name="lastName" required placeholder="last name"/><br>
            <input class="emailJS" type="checkbox" name="emailPrefs" value="email" checked>Email me band updates!<br> 
            <button type="submit" class="registerFormButtonJS standardButton">submit</button>
        </fieldset>
    </form>
    <div class="errorMessage"></div>        
    `;
}

function displayNewUser(newUser){
    $(".subscribeJS").html(newUser);
};



function createNewUser(userData, callback) {
    let postUrl="/user/";
    fetch(postUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if(!(response.status==201)){
            throw new Error(response);
        }
        return response.json();
    })
    .catch(err => {
        messageJson = err.json();
        console.log(messageJson);
        return Promise.reject(messageJson);
    })
};






function startSigninPage(){

    checkAuthStatus(status, function (stat) {
        $(".headerJS").html(displayHeader(stat));
            if(!(((stat)) == "authenticated")) {
            $(".subscribeJS").html(displaySubscribe());
    
            $(".registerFormButtonJS").on("click",function(event){
                event.preventDefault();
                const isValidEmail = username.checkValidity();
                let email;
                if($(".emailJS").prop("checked") == true){
                        email=true;
                }
                else if ($(".emailJS").prop("checked") == false){
                        email=false;
                };
                const userData = {
                    username: $(".registerUserNameBoxJS").val(),
                    password: $(".registerPasswordBoxJS").val(),
                    firstName:$(".registerFirstNameBoxJS").val(),
                    lastName:$(".registerLastNameBoxJS").val(),
                    email: email
                };
                checkValidations(isValidEmail, userData, function(response){
                    if(response.status == "valid"){
                        createNewUser(userData, function(res) {
                            console.log(res.body);
                            console.log("userData is",userData);
                            loginUser({username:userData.username, password:userData.password});

                        });
                    }
                    else {
                        $(".errorMessage").html("");    
                        Object.keys(response).forEach(function(key) {
                            console.log(key, response[key]);
                            $(".errorMessage").append(`${response[key]}<br>`);    
                        });

                        
                    }

                });

    
            });
       }  
    // IF LOGGED IN, DISPLAY ERROR
    
       else {
            $(".subscribeJS").html("Error, already signed in");
            $(".logout").on("click", function(event) {
                event.preventDefault();
                logoutUser();
            })

        };

    })

};



$(startSigninPage);