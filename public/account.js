function displayAccountDetails(thisUser){

    let emailStatus = "";

    if((thisUser.user.email)==false){
        emailStatus = "unchecked";
    }
    else {
        emailStatus = "checked";
    }
    console.log("emailStatus:", emailStatus);
    return `
    <form class="updateFormJS updateForm" role = "form" action="/user" method="put">
        <fieldset name="update-user-info">
            <legend>Update a user account</legend>
            <input class="UDuserNameBoxJS" id="username" type="email" value="${thisUser.user.username}" name="UDuserName" readonly>Username (cannot change)<br>
            <input class="UDfirstNameBoxJS" type="text" value="${thisUser.user.firstName}" name="UDfirstName">First Name<br>
            <input class="UDlastNameBoxJS" type="text" value="${thisUser.user.lastName}" name="UDlastName">Last Name<br>
            <input class="UDemailJS" type="checkbox" value="" name="UDemailPrefs" value="email" ${emailStatus}>Email me band updates!<br>
            <button type="submit" class="updateButtonJS standardButton">submit</button>
        </fieldset>
    </form>
    <br>       
    <div class="errorMessage"></div>        
 
    `;    
 }


function getUserList(callback) {
    let myToken = window.localStorage.getItem("authorizationToken");
    let codedPayload = myToken.split('.')[1];
    let decodedPayload = JSON.parse(window.atob(codedPayload));

    let getUrl = "/protected/user";
    fetch(getUrl, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          headers: {
              authorization: `Bearer ${window.localStorage.getItem("authorizationToken")}`,
              id: decodedPayload.user.id,
          }
    })
    .then(response => {
        return response.json();
    }) 
    // parses response to JSON
    .then(jsonData =>{
        callback(jsonData);
    })
    .catch(err => {
        console.error(err);
        $(".userButtonJS").html("Error - authentication or server failed");    
    })
};

function missingFieldsMessage(){

    $(".updateFormJS").html("ERROR, USERNAME REQUIRED");
    
};


function updateUser(userData) {
    let putUrl="/protected/user";
    fetch(putUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${window.localStorage.getItem("authorizationToken")}`,
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if(!(response.status==201)){
            console.log(response);
            missingFieldsMessage();
            throw new Error("Username Required");
        };
        return response.json();
    })
    .then(jsonData =>{
        console.log("after .json:", jsonData);
        displayUpdatedUser(jsonData);

    })
    .catch(err => {
        console.error(err);
        $(".subscribeJS").html("Error - API failed");    
    })
}

function displayUpdatedUser(updatedUser){
    $(".updateUserJS").html(
        `
        Your updated information is: <br>
        Username: ${updatedUser.username} <br>
        First Name: ${updatedUser.firstName} <br>
        Last Name: ${updatedUser.lastName} <br>
        Receive emails? ${updatedUser.email} <br>       
        `
        );
};


function startAccountPage(){

    let status = "not yet set";

    checkAuthStatus(status, function (stat) {
        $(".headerJS").html(displayHeader(stat));

        if(!(((stat)) == "authenticated")) {
            $(".updateUserJS").html("Error, user not authenticated");
       }  

       // IF LOGGED IN, DISPLAY ACCOUNT CRUD OPERATION
    
       else {
            getUserList(function(thisUser){
                $(".updateUserJS").html(displayAccountDetails(thisUser));
                $(".updateButtonJS").on("click",function(event){
                    event.preventDefault();
                    let email;
                    const isValidEmail = username.checkValidity();
                    console.log (isValidEmail);
                    if($(".UDemailJS").prop("checked") == true){
                            email=true;
                    }
                    else {
                            email=false;
                    };
                    const userData = {
                        username: $(".UDuserNameBoxJS").val(),
                        firstName:$(".UDfirstNameBoxJS").val(),
                        lastName:$(".UDlastNameBoxJS").val(),
                        password:"fakepassword",
                        email: email
                    };

                    checkValidations(isValidEmail, userData, function(response){
                        if(response.status == "valid"){
                            updateUser(userData);      
                            
                        }
                        else {
                            $(".errorMessage").html("");    
                            Object.keys(response).forEach(function(key) {
                                console.log(key, response[key]);
                                $(".errorMessage").append(`${response[key]}<br>`);    
                            });
    
                            
                        }
    
                    });
    



                                  
                })
            
            });
            $(".logout").on("click", function(event) {
                event.preventDefault();
                logoutUser();
            })               
        };     
    })
};



$(startAccountPage);