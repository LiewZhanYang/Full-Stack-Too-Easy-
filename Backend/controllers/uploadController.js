const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    region: 'ap-southeast-1', // Your preferred AWS region
    accessKeyId: 'YOUR_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
});

const s3 = new AWS.S3();

const uploadFile = (req, res) => {
    const fileContent = fs.readFileSync(req.file.path);
    const params = {
        Bucket: 'your-bucket-name', // Replace with your bucket name
        Key: req.file.originalname, // File name you want to save as in S3
        Body: fileContent,
        ContentType: req.file.mimetype, // Set the content type
    };

    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
        // Clean up temporary file
        fs.unlinkSync(req.file.path);

        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send('Error uploading file');
        }
        console.log(`File uploaded successfully at ${data.Location}`);
        res.send(`File uploaded successfully at ${data.Location}`);
    });
};

module.exports = { uploadFile };