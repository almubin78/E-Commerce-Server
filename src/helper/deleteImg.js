const fs = require('fs').promises;

const deleteImage = async(userImagePath) => {
    try {
        await  fs.access(userImagePath)
        await fs.unlink(userImagePath)
        console.log('Images was deleted successfully')
    } catch (error) {
        console.log('user Image does not exits')
    }
   
}
module.exports = deleteImage


// const fs = require('fs').promises;

// const deleteImage =  (userImagePath) => {
//   fs.access(userImagePath)
//     .then(() => fs.unlink(userImagePath))
//     .then(() => console.log('Images was deleted successfully'))
//     .catch((err) => { console.log('user Image does not exits'); })
// }
// module.exports = deleteImage