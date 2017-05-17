function capturePhoto() {
// Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
}

//Callback function when the picture has been successfully taken
function onPhotoDataSuccess(imageData) {                
    // Get image handle
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    smallImage.style.display = 'block';
    smallImage.src = imageData;
}

//Callback function when the picture has not been successfully taken
function onFail(message) {
    alert('Failed to load picture because: ' + message);
}

function movePic(file){ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
} 

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry){ 
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "ConFood";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
                    {create:true, exclusive: false},
                    function(directory) {
                        entry.moveTo(directory, newFileName,  successMove, resOnError);
                    },
                    resOnError);
                    },
    resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
    //I do my insert with "entry.fullPath" as for the path
}

function resOnError(error) {
    alert(error.code);
}

 function getImage() {
 navigator.camera.getPicture(uploadPhoto, function(message) {
 alert('get picture failed');
 }, {
 quality: 100,
 destinationType: navigator.camera.DestinationType.FILE_URI,
 sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
 });
}

function uploadPhoto(imageURI) {
 var options = new FileUploadOptions();
 options.fileKey = "file";
 options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
 options.mimeType = "image/jpeg";
 console.log(options.fileName);
 var params = new Object();
 params.value1 = "test";
 params.value2 = "param";
 options.params = params;
 options.chunkedMode = false;

var ft = new FileTransfer();
 ft.upload(imageURI, "http://jkrekora.cba.pl/upload.php", function(result){
 console.log(JSON.stringify(result));
 }, function(error){
 console.log(JSON.stringify(error));
 }, options);
 }