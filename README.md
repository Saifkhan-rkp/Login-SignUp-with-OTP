# Important

 ## change .env literals
   
   MONGODB_URL=
   SMS_API_KEY=
   EMAIL=
   EMAIL_PSWD=
   
 ## Install All dependencies
 
    $npm install

 ## To run API
   
    $npm start
 
# Server is On..!

 link http://localhost:8080

 //MONGOBD is for only One Week


 ## Routes
 
 # 'http://localhost:8080/auth' routes
 
 post : '/login'
   
  body -
   
   
     {
       "username" : "username",
       "password" : "password"
     }
   
   
  return -
     
        {
           "token" : "jwt Token",
           "message" : "Success/Failed/whatever"
        } 

 post : '/signup' 
   
   body -
    
        {
            username : un,
            password : pswd,
            email : email,
            phone : phone,
            first_name : f_n,
            last_name : l_n            
        }
    
   return -
        
        {
           url : "/auth/verify/:id?token=&value=#",
           message : "Success/Failed/whatever"
        } 
      
  get : '/verify/:id'

        http://localhost:8080/auth/verify/:id?token=&value=
        id - new ObjectId() of otp DB
        token - jwt token
        value - otp
    
   return -
        
        {
           message : "Success/Failed/whatever"
        } 
      

# 'http://localhost:8080/' direct routes

  get : '/resendOTP'

  post : '/forgetPassword' -

   body -

          {
              "email": "email"
          }

          or 

          {
              "phone" : "phone"
          }

  post : '/resetPassword/:id?token=&value='
      id -id - new ObjectId() of otp DB
      token - jwt token
      value - otp

   body -

         {
             "password" : "pswd"
         }

