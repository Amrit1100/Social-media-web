const getdetails = async () => {
    let response = await fetch("/me", {
        method: "POST",
        credentials: "include"
    })

    let data = await response.json()
    if (data.msg === "NotloggedIn") {
      document.querySelector(".auth-btns").classList.add("showauth")
        return "NotloggedIn"
    } else {
      document.querySelector(".accountname").innerHTML = data.name
      document.querySelector(".account").classList.add("showauth")
        return "loggedIn"
    }
}
let userState = null;
const init = async () => {
  userState = await getdetails();
};
init();

    document.querySelector(".logout").addEventListener("click", async () => {
        console.log("Button clicked")
        if (userState === "NotloggedIn") {
          alert("User Not Logged In")
        } else {
          let response = await fetch("/logout", {
            method: "POST",
            credentials: "include"
          })
          let data = await response.json()
          alert(data.msg)
          window.location.reload()
        }
      })

const textarea = document.querySelector(".comment-input");

textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = (textarea.scrollHeight)+ "px";
});


document.querySelector(".add-comment-btn").addEventListener("click", async()=>{
  let comment = document.querySelector(".comment-input").value
  if (!comment){
    Toastify({ text: "Comment can't be empty.", duration: 3000, gravity: "top", position: "center", close: true, backgroundColor: "#d41313ff", }).showToast();
  }else{
    console.log(userState)
    if(userState == "NotloggedIn"){
      Toastify({ text: "User not logged in", duration: 3000, gravity: "top", position: "center", close: true, backgroundColor: "#d41313ff", }).showToast();
    }else{
      let slug = ((window.location.href).split("/"))[4]
      console.log(slug)
      let response = await fetch("/add-comment", {
        method : "POST",
        headers :  {"Content-Type" : "application/json"},
        body : JSON.stringify({comment,slug})
      })
      let data = await response.json()
      if(data.msg === "Success"){
        window.location.reload()
      }
    }
  }
})
