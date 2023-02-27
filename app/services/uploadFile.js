const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require("firebase/storage");
const {initializeApp} = require("firebase/app")
const config = require("../../config/firebase-config");
const multer = require("multer")

initializeApp(config.firebaseConfig)

const storage = getStorage()

const giveCurrentDateTime = () => {
    const today = new Date()
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    const dateTime = date +"-"+ time
    return dateTime
  };

//const upload = multer({ storage: multer.memoryStorage() })

async function imageUpload(req, res) {
    try {
        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, `user-profiles/${dateTime + "_" + req.file.originalname}`)

        // Create file metadata including the content type 
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)

        //Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref)

        console.log("Success upload")
        return res.send({
            message: "File uploaded to firebase storage",
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        })
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

module.exports = {imageUpload};

