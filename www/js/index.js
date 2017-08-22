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
var pictureSource;
var destinationType;
var selectedProducts = new Array();
function showAllRecipes(){
    if (window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    } else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET","http://jkrekora.cba.pl/allrecipes.php",true);
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.send();
}
function showProducts(){
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
    document.getElementById("recipe-list").innerHTML = "";
    document.getElementById("optional-image").innerHTML = "";
    if (selectedProducts.length==0){
        document.getElementById("recipe-list").innerHTML = "<p align='center'>Powietrzem się nie najesz! Cofnij i wybierz produkty, które masz<p>";
        document.getElementById("optional-image").innerHTML = "<div><img src='img/talerz_pusty.jpg'/></div>";
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
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    var responseToText = xmlhttp.responseText.substring(xmlhttp.responseText.indexOf("<div id=\"response\">"), xmlhttp.responseText.lastIndexOf("response-end"));
                    if(!document.getElementById("recipe-list").innerHTML.includes(responseToText)){
                        document.getElementById("recipe-list").innerHTML += xmlhttp.responseText;
                    }
                    if(document.getElementById("recipe-list").innerHTML==""){
                        document.getElementById("recipe-list").innerHTML = "<p align='center'>Nie znależiono przepisów wykorzystujących twoje skladniki. Wybierz inne skladniki.<br/> Albo może czas udać sie do sklepu? :)</p>";
                        document.getElementById("optional-image").innerHTML = "<div><img src='img/goshop.jpg'/></div>";
                    }
                }
            }
            xmlhttp.send();
        }
    }
}
var pictureSource;   // picture source
// var destinationType; // sets the format of returned value
// Wait for device API libraries to load
//
document.addEventListener("deviceready",onDeviceReady,false);
// device APIs are available
//
function onDeviceReady(){
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI){
    // Show the selected image
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = imageURI;
}
// A button will call this function
//
function capturePhoto(){
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: true});
}
function getPhoto(source){
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail,{ quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
}
function uploadPhoto(){
    //selected photo URI is in the src attribute (we set this on getPhoto)
    var imageURI = document.getElementById('smallImage').getAttribute("src");
    if (!imageURI){
        alert('Please select an image first.');
        return;
    }
    //set upload options
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    /*options.params ={
     firstname: document.getElementById("firstname").value,
     lastname: document.getElementById("lastname").value,
     workplace: document.getElementById("workplace").value
     }*/
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://jkrekora.cba.pl/upload.php"), win, fail, options);
}
// Called if something bad happens.
//
function onFail(message){
    console.log('Failed because: ' + message);
}
function win(r){
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    //alert("Response =" + r.response);
    console.log("Sent = " + r.bytesSent);
}
function fail(error){
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
/* function getSelectedRecipes(){
    if (selectedProducts.length == 0){
        document.getElementById("recipe-list").innerHTML = "Powietrzem się nie najesz! Cofnij i wybierz produkty, które masz";
        document.getElementById("optional-image").innerHTML = "<div style='width:800px; margin:0 auto;'><img align='middle' style='max-width: 50%; height: auto; width: auto;' src='img/talerz_pusty.jpg'/></div>";
        return;
    } else{
        var allRecipes = document.getElementsByClassName("recipe");
        var recipesToShow = [];
        for (i = 0; i < allRecipes.length; i++){
            for (j = 0; j < selectedProducts.length; j++){
                if (allRecipes[i].getAttribute("ingredients").includes(selectedProducts[j])){
                    recipesToShow.push(allRecipes[i]);
                }
            }
        }
        for (k = 0; k < recipesToShow.length; k++){
            if (!document.getElementById("recipe-list").innerHTML.includes(recipesToShow[k].innerHTML)){
                document.getElementById("recipe-list").innerHTML += recipesToShow[k].innerHTML;
            }
        }
    }
}
function showMeal(){
    if (window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    } else{
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
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
function onDeviceReady(){
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}
function onPhotoDataSuccess(imageURI){
    var smallImage = document.getElementById('smallImage');
    smallImage.style.display = 'block';
    smallImage.src = imageURI;
    movePic(imageURI);
}
function capturePhoto(){
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: true});
}
function onFail(message){
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
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys){
            var direct = fileSys.root;
            direct.getDirectory( myFolderApp,
            {create:true, exclusive: false},
                function(myFolderApp)
                {entry.moveTo(myFolderApp, newFileName,  successMove,  resOnError);
                },
                resOnError);
    },
        resOnError);
}
function successMove(entry){
    sessionStorage.setItem('imagepath', entry.fullPath);
}
function resOnError(error){
    alert(error.code);
}
function getImage(){
    navigator.camera.getPicture(uploadPhoto, function(message){
        alert('get picture failed');
    },{
        quality: 100,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
}
function uploadPhoto(imageURI){
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
} */
