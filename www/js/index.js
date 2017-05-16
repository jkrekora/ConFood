$(document).ready(function () {
    $(":checkbox").click(function () {
        var thisVar = $(this);
        var id = thisVar.attr('id');
        var isChecked = thisVar.is(':checked');
        alert("id" + id + "   " + "Checked " + isChecked);
        //code to store it on local storage

    });
});

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
 ft.upload(imageURI, "http://wizard.uek.krakow.pl/~s182368/images/upload.php", function(result){
 console.log(JSON.stringify(result));
 }, function(error){
 console.log(JSON.stringify(error));
 }, options);
 }
 