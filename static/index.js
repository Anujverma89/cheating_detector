// Access webcam video
const video = document.getElementById("video");
if(!navigator.mediaDevices.getUserMedia){
    alert("No Camera device is found in your system try another one");
}else{
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            captureImage(); // Capture the first image as soon as video starts
            setInterval(captureImage, 60000); // Then capture every 30 seconds
        };
    })
    .catch(error => {
        console.error("Error accessing webcam:", error);
    });
}


function captureImage() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Show captured image
    const capturedImage = document.getElementById("captured-image");
    const imd = canvas.toDataURL("image/png");
    capturedImage.src = canvas.toDataURL("image/png");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/analyse_image", true);  // Set up the request
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
    
    // Define the callback function for the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {  // Check if the request is complete
            if (xhr.status === 200) {  // Check if the status is 200 OK
                var data = JSON.parse(xhr.responseText);  // Parse the JSON response
                // let doc = document.getElementById("infoBox");
                // doc.innerHTML = " ";
                // doc.innerText = data.data;
                let str = data.data;
                let split1 = str.split("{");
                let split2 = split1[1].split("}");
                let rowdata = split2[0].split(",");
                
                let person = rowdata[0].split(":")[1];
                let direction = rowdata[1].split(":")[1];
                let device = rowdata[2].split(":")[1];
                console.log(rowdata)
                let pc = document.getElementById("people-count");
                let pd = document.getElementById("looking-direction");
                let cd = document.getElementById("communication-device");
                pc.innerText = " ";
                pd.innerText =" ";
                cd.innerText = " ";
                pc.innerText = person;
                pd.innerText = direction;
                cd.innerText = device;

                // console.log(data.data);  // If 'data' is part of the response object
            } else {
                console.error("Error: " + xhr.statusText);
            }
        }
    };
    
    // Send the request with the image data (assuming 'imd' is the base64-encoded image string)
    var body = JSON.stringify({ image: imd });
    xhr.send(body);
    

}
