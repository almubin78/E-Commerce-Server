### Installed packages
```
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-rate-limit": "^7.3.1",
    "express-validator": "^7.1.0",
    "http-errors": "^2.0.0",
    "jsonwebtoken": "^9.0.0",
    "mongodb": "^5.4.0",
    "mongoose": "^8.4.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.13",
    "xss-clean": "^0.1.4"
  }
```

﻿

 # E-commerce MERN Stack project

 - /api/users (D)

* POST /register → create the user account 
* POST /activate → activate the user account 
* GET /profile → get the user account 
* DELETE /:id → delete the user account 
* PUT /:id → update the user account 
* PUT /update-password/:id → update the password --- * POST /forget-password → forget the password - 
* PUT /reset-password → reset the password ...

* PUT - Admin /ban/:id → ban the user
* PUT - Admin /unban/:id → unban the user
* GET - Admin /export-users → export all the users 
* GET - Admin - /all-users → get all users including 