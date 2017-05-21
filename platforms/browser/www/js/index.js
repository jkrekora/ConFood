var pictureSource;   
var destinationType;
document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
   pictureSource=navigator.camera.PictureSourceType;
   destinationType=navigator.camera.DestinationType;
}
function showProducts(){
	var productList = document.getElementById("product-list");
	var selectedProducts = productList.getElementsByTagName("input");
	for(i = 0; i < selectedProducts.length; i++){
		if(selectedProducts[i].checked){
			document.getElementById("selected-products").innerHTML += "<br/><b>&nbsp&nbsp&nbsp-" + selectedProducts[i].getAttribute("value") + "</b>";
		}
	}
}
function showMeal(str) {
    if (str == "") {
        document.getElementById("txtHint").innerHTML = "";
        return;
    } else { 
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("txtHint").innerHTML = this.responseText;
            }
        };
        xmlhttp.open("GET","http://jkrekora.cba.pl/db.php?q="+str,true);
        xmlhttp.send();
    }
}
function onPhotoDataSuccess(imageURI) {

   var smallImage = document.getElementById('smallImage');
   smallImage.style.display = 'block';
   smallImage.src = imageURI;
   movePic(imageURI);
}

function capturePhoto() {
   navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
   destinationType: destinationType.FILE_URI,
   saveToPhotoAlbum: true});
}

function onFail(message) {
   alert('Failed because: ' + message);
}

function movePic(file){
   window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError);
}

function resolveOnSuccess(entry){
   var d = new Date();
   var n = d.getTime();

   var newFileName = n + ".jpg";
   var myFolderApp = "ConFood";

   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys)  {  
        //The folder is created if doesn't exist
    var direct = fileSys.root;
          direct.getDirectory( myFolderApp,
            {create:true, exclusive: false},
            function(myFolderApp) {
                entry.moveTo(myFolderApp, newFileName,  successMove,  resOnError);
            },
            resOnError);
    },
    resOnError);
}
function successMove(entry) {
   sessionStorage.setItem('imagepath', entry.fullPath);

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