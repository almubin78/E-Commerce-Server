
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./secret');


// console.log(DEFAULT_IMAGE);
app.listen(port,async()=>{
    console.log(`Running at ${port}`);
    await connectDB()
})