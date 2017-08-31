function sendMyRecipe(){
    var title=$("#title").val();
    var ingredients=$("#ingredients").val();
    var recipe_text=$("#recipe_text").val();
    var dataString="title="+title+"&ingredients="+ingredients+"&recipe_text="+recipe_text;
    if($.trim(title).length>0 & $.trim(ingredients).length>0 & $.trim(recipe_text).length>0){
        $.ajax({
            type: "POST",
            url:"http://jkrekora.cba.pl/insert.php",
            data: dataString,
            crossDomain: true,
            cache: false,
            beforeSend: function(dataString){ $("#submit-recipe").val("Connection...");},
            success: function(data){
                $("#submit-recipe").val("Success");
            }
        });
        document.getElementById("title").value='';
        document.getElementById("ingredients").value='';
        document.getElementById("recipe_text").value='';
        $("#submit-recipe").val("Success");
    } else{
        $("#submit-recipe").val("Failed");
    }
};
var selectedProducts = new Array();
function showAllRecipes(){
    if (window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    } else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET","http://jkrekora.cba.pl/allrecipes.php",true);
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == XMLHttpRequest.DONE){
            document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.send();
}
function showProducts(){
    selectedProducts.length=0;
    document.getElementById("selected-products").innerHTML = "";
    var productList = document.getElementById("product-list").getElementsByTagName("input");
    for(i = 0; i < productList.length; i++){
        if(productList[i].checked){
            selectedProducts.push(productList[i].getAttribute("value"));
            document.getElementById("selected-products").innerHTML += "<br/><b>&nbsp&nbsp&nbsp- " + productList[i].getAttribute("value") + "</b>";
        }
    }
}
function getSelectedRecipes(){
    var selectedRecipesStr="";
    document.getElementById("recipe-list").innerHTML = " ";
    document.getElementById("optional-image").innerHTML = "";
    if (selectedProducts.length==0){
        document.getElementById("recipe-list").innerHTML = "<p>Powietrzem się nie najesz! Cofnij i wybierz produkty, które masz w lodówce.<p>";
        document.getElementById("optional-image").innerHTML = "<div><img src='img/talerz_pusty.jpg'></div>";
        return;
    } else{
        for(i = 0; i < selectedProducts.length; i++){
            if (window.XMLHttpRequest){
                xmlhttp = new XMLHttpRequest();
            } else{
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.open("GET","http://jkrekora.cba.pl/selectedRecipes.php?ingredients="+selectedProducts[i],true);
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState == XMLHttpRequest.DONE){
                    var recipesToArray = xmlhttp.responseText.split("_doc_splitter_");
                    console.log(recipesToArray.length);
                    for(i=0;i<recipesToArray.length-1;i++){
                      if(!document.getElementById("recipe-list").innerHTML.includes(recipesToArray[i])){
                          document.getElementById("recipe-list").innerHTML += recipesToArray[i];
                          var detailsPageContent = "<a href=\"#recipeDetails\" class=\"ui-btn ui-btn-inline ui-corner-all ui-shadow\" onclick=showRecipeDetails()>Szczegóły</a>"
                          document.getElementById("recipe-list").innerHTML += detailsPageContent;
                      }
                    }
                    if(document.getElementById("recipe-list").innerHTML==" "){
                        document.getElementById("recipe-list").innerHTML = "<p>Nie znaleziono przepisów wykorzystujących Twoje składniki. Wybierz inne składniki.<br/>Albo może czas udać sie do sklepu? :)</p>";
                        document.getElementById("optional-image").innerHTML = "<div><img src='img/goshop.jpg'></div>";
                    }
                }
            }
            xmlhttp.send();
        }
    }
}

var pictureSource;   // picture source
var destinationType; // sets the format of returned value

// Wait for device API libraries to load
//
document.addEventListener("deviceready",onDeviceReady,false);

// device APIs are available
//
function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
  // Uncomment to view the base64-encoded image data
  // console.log(imageData);

  // Get image handle
  //
  var smallImage = document.getElementById('smallImage');

  // Unhide image elements
  //
  smallImage.style.display = 'block';

  // Show the captured photo
  // The in-line CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI
  // console.log(imageURI);

  // Get image handle
  //
  var largeImage = document.getElementById('largeImage');

  // Unhide image elements
  //
  largeImage.style.display = 'block';

  // Show the captured photo
  // The in-line CSS rules are used to resize the image
  //
  largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhoto() {
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
	destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
	destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
	destinationType: destinationType.FILE_URI,
	sourceType: source });
}

// Called if something bad happens.
//
function onFail(message) {
  alert('Failed because: ' + message);
}

function onPhotoURISuccess(imageURI) {

    // Show the selected image
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = imageURI;
}

// A button will call this function
//
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}

function uploadPhoto() {

    //selected photo URI is in the src attribute (we set this on getPhoto)
    var imageURI = document.getElementById('smallImage').getAttribute("src");
    if (!imageURI) {
        alert('Please select an image first.');
        return;
    }

    //set upload options
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";

    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://jkrekora.cba.pl/uploadImage.php"), win, fail, options);
}

// Called if something bad happens.
//
function onFail(message) {
    console.log('Failed because: ' + message);
}

function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    //alert("Response =" + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
