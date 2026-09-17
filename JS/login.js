function login(){

    const username =
    document.getElementById("username").value;

    const password =
    document.getElementById("password").value;

    if(username==="admin" && password==="1234"){

        window.location.href="home.html";
    }

    else{

        document.getElementById("error").innerHTML=
        "Invalid username or password";
    }

}

function login(){

    window.location.href="home.html";

}

