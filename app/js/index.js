window.onload = function () {
    var images = ["/assets/images/profile_image.jpg", "/assets/images/profile_image_clicked.jpg"]

    var imgState = 0;

    var imgTag = document.getElementById("imgClickAndChange");

    imgTag.addEventListener("click", function (event) {
        imgState = (++imgState % images.length);
        event.target.src = images[imgState];
    });
}