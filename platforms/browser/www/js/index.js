var selectedProducts = new Array();

function showProducts(){
	var productList = document.getElementById("product-list").getElementsByTagName("input");
	for(i = 0; i < productList.length; i++){
		if(productList[i].checked){
			selectedProducts.push(productList[i].getAttribute("value"));
			document.getElementById("selected-products").innerHTML += "<br/><b>&nbsp&nbsp&nbsp-" + productList[i].getAttribute("value") + "</b>";
			}
	}
}
function getSelectedRecipes(){
		if (selectedProducts.length==0) {
				document.getElementById("recipe-list").innerHTML = "Powietrzem się nie najesz! Cofnij i wybierz produkty, które masz";
				document.getElementById("optional-image").innerHTML = "<div style='width:800px; margin:0 auto;'><img align='middle' style='max-width: 50%; height: auto; width: auto;' src='img/talerz_pusty.jpg'/></div>";
				return;
		}
		else {
				var allRecipes =  document.getElementsByClassName("recipe");
				var recipesToShow = [];
				for(i=0; i < allRecipes.length; i++){
					for(j=0; j < selectedProducts.length; j++){
						if(allRecipes[i].getAttribute("ingredients").includes(selectedProducts[j])){
								recipesToShow.push(allRecipes[i]);
						}
					}
				}
			for(k = 0; k < recipesToShow.length; k++){
			if(!document.getElementById("recipe-list").innerHTML.includes(recipesToShow[k].innerHTML)){
				document.getElementById("recipe-list").innerHTML += recipesToShow[k].innerHTML;
			}
}
}
function showMeal() {
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("txtHint").innerHTML = this.responseText;
            }
        xmlhttp.open("GET","http://jkrekora.cba.pl/json.php",true);
        xmlhttp.send();
    }
}

var pictureSource;
var destinationType;
var selectedProducts=null;
document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
   pictureSource=navigator.camera.PictureSourceType;
   destinationType=navigator.camera.DestinationType;
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
