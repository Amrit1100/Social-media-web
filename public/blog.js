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

