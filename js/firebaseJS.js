var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');
var currentImg;


function handleImage(e){
  if (canvas) {}
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            watermarkImage(img, "Tonight AR");
            ctx.drawImage(img,0,0);
            currentImg = img;
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);

}

function watermarkImage(elemImage, text) {
  // Create test image to get proper dimensions of the image.
  var testImage = new Image();
  testImage.onload = function() {
    var h = testImage.height, w = testImage.width, img = new Image();
    // Once the image with the SVG of the watermark is loaded...
    img.onload = function() {
      // Make canvas with image and watermark
      var canvas = Object.assign(document.createElement('canvas'), {width: w, height: h});
      var ctx = canvas.getContext('2d');
      ctx.drawImage(testImage, 0, 0);
      ctx.drawImage(img, 0, 0);
      // If PNG can't be retrieved show the error in the console
      try {
        elemImage.src = canvas.toDataURL('image/png');
      }
      catch (e) {
        console.error('Cannot watermark image with text:', {src: elemImage.src, text: text, error: e});
      }
    };
    // SVG image watermark (HTML of text at bottom right)
    img.src = 'data:image/svg+xml;base64,' + window.btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" height="' + h + '" width="' + w + '">' +
        '<foreignObject width="100%" height="100%">' +
          '<div xmlns="http://www.w3.org/1999/xhtml">' +
            '<div style="position: absolute;' +
                        'right: 0;' +
                        'bottom: 0;' +
                        'font-family: Tahoma;' +
                        'font-size: 10pt;' +
                        'background: #000;' +
                        'color: #fff;' +
                        'padding: 0.25em;' +
                        'border-radius: 0.25em;' +
                        'opacity: 0.6;' +
                        'margin: 0 0.125em 0.125em 0;' +
            '">' + text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</div>' +
          '</div>' +
        '</foreignObject>' +
      '</svg>'
    );
  };
  testImage.src = elemImage.src;

}


function uploadFile(){
  var storageRef = firebase.storage().ref();

  var referenceFolder = storageRef.child("ReferenceImages");
  var modelFolder = storageRef.child("3D-Model");

  referenceFolder.put(currentImg).then(function(snapshot) {
    console.log('Uploaded a blob or file!');
  });

  //modelFolder.put(ModelFile).then(function(snapshot) {
    //console.log('Uploaded a blob or file!');
  //});
}
