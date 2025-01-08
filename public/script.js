
function copyOnClick() {  
    // Copy the link to clipboard
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = document.getElementById('sort_link').textContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Show toast message
    showToast("Link copied to clipboard!");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message; // Set the message
    toast.classList.add("show"); // Add 'show' class to make it visible

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}