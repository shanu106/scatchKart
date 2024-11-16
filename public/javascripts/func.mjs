
let order;
let amount;
document.getElementById('myForm').addEventListener('submit', function(event){
    event.preventDefault(); // Prevent the default form submission

    // Create a FormData object from the form
    const formData = new FormData(this);

    // Use formData to get the values
     order = formData.get('name');
    amount = formData.get('email');

    // Log the values to the console
 
  
document.getElementById('jpbtn').onclick = async function() {
    // Example amount
  

try {
    const options = {
        key: "rzp_test_wmiCq0OxkHPtnR",
        
        currency: "INR",
        name: "Scatch By Shahnawaj",
        description: "Test Transaction",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQH0LObLN3v7gg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1730658994521?e=1736380800&v=beta&t=o-ezc7glyxqoGdIU4bGZ0llJBfeIet_OUsEFsfb-1Tk",
        order_id: order,
        callback_url: "https://scatchkart.onrender.com/users/paymentVerification",
        prefill: {
            name: "Gaurav Kumar",
            email: "gaurav.kumar@example.com",
            contact: "9000090000"
        },
        notes: {
            address: "Razorpay Corporate Office"
        },
        theme: {
            color: "#3399cc"
        }
    };
 
    const razorpay = new Razorpay(options);
    razorpay.open();
   
    
    
} catch (error) {
    console.log(error);
    
}
  
};

    
});






