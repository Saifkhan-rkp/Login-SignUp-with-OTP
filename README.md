###Server is On..!
 link http://localhost:8080


 //MONGOBD is for only One Week


 ##Routes
 post : '/login'

 post : '/signup' -
        {
            username : un,
            password : pswd,
            email : email,
            phone : phone,
            first_name : f_n,
            last_name : l_n            
        }
get : '/verify/:id'
    /verify/:id?token=&value=
    id - new ObjectId() of otp DB
    token - jwt token
    value - otp
.get('/resendOTP',resendOTP);

post : '/forgetPassword' -
        {
            email: email
        }
        or 
        {
            phone : phone
        }
post : '/resetPassword/:id?token=&value='
    id -id - new ObjectId() of otp DB
    token - jwt token
    value - otp

    {
        password : pswd
    }

