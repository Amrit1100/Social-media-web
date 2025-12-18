// navbar and user login check
const getdetails = async () => {
  let response = await fetch("/me", {
    method: "POST",
    credentials: "include"
  })

  let data = await response.json()
  if (data.msg === "NotloggedIn") {
    document.querySelector(".auth-btns").classList.add("showauth")
    window.location.href = "http://localhost:3000"
    return "NotloggedIn"
  } else {
    document.querySelector(".account").classList.add("showauth")
    return "loggedIn"
  }
}
userState = getdetails()

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


document.querySelector(".publishbtn").addEventListener("click", async()=>{
    let title = document.querySelector("#title").value
    let content = document.querySelector("#content").value
    if (!title || !content){
      Toastify({ text: "Both Fields are required", duration: 3000, gravity: "top", position: "center", close: true, backgroundColor: "#d41313ff", }).showToast();
    }else{
       let response = await fetch("/add-blog", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({title,content})
      })
       let data = await response.json()
       Toastify({ text: data.msg, duration: 3000, gravity: "top", position: "center", close: true, backgroundColor: "#a19e00ff", }).showToast();
       if(data.msg=="success"){
      document.querySelector("#title").value = ""
      document.querySelector("#content").value = ""
       }
    }
})