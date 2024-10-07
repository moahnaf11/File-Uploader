# File-Uploader

A stripped down version of Google Drive! Users can sign up with an account and log in. 
Implemented the passport.js LocalStrategy for authenticating users upon Log In. 
Stored user credentials in a postgreSQL database modelled using prisma! 
Hashed user passwords for extra security using bcryptjs. 
Instantiated User sessions using the express-session library coupled with prisma-session-storage to allow users to have access to their account when they have not logged out. 
Conducted server-side form validations for the sign up and log in forms and displayed proper error messages to enhance user experience and provide proper guidance on the expected input fields! 
Users are able to CRUD(Create, Read, Update, Delete) folders and upload files inside them. 
Added a 4MB limit to max file upload size. 
Implemented all database CRUD operations using PrismaClient. 
Users are able to download files on their file system as well as generate a shareable link to send to others.  