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

const getinfo = async () => {
    let response = await fetch("/profile", {
        method: "POST",
        credentials: "include"
    })

    let data = await response.json()
    if(data.msg === "Not Logged In"){
        window.location.href = "http://localhost:3000"
    }else{
      let username = document.querySelector(".user-name")
      let bio = document.querySelector(".user-bio")
      document.querySelector(".accountname").innerHTML = data.name
      username.innerHTML = data.name
      let profileurl = data.profileurl
      if(!profileurl){
          document.querySelector(".user-image").src = "/account.jpg"
      }else{
        document.querySelector(".user-image").src = profileurl
      }
      if (!data.bio){
        bio.innerHTML = ""
      }else{
        bio.innerHTML = data.bio
      }
      document.querySelector(".preload").classList.add("hidepreload")
      }
        // Sample data
        // let blogContainer = document.querySelector(".blog-container")
        // console.log(data.msg)
        //  for (let i=0; i<=data.msg.length; i++){
        //     console.log(data.msg[i])
        //     let title = (data.msg[i]).title
        //     let content = (data.msg[i]).content
        //     console.log(title)
        //       const blogCard = document.createElement("div");
        //         blogCard.className = "blog-card";
        //         const h4 = document.createElement("h4");
        //         h4.className = "blog-title";
        //         h4.textContent = title;
        //          const p1 = document.createElement("p");
        //         p1.className = "blog-content";
        //         p1.textContent = content;
        //            blogCard.appendChild(h4);
        //             blogCard.appendChild(p1);
        //             blogContainer.appendChild(blogCard)

         }

getinfo()
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


const modal = document.getElementById("editModal");
const openBtn = document.getElementById("openModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

// Open modal
openBtn.addEventListener("click", () => {
  document.getElementById("usernameInput").value = document.querySelector(".user-name").innerHTML
  document.getElementById("bioInput").value = document.querySelector(".user-bio").innerHTML
  modal.classList.add("show")
});

// Close modal
cancelBtn.addEventListener("click", () => {
  modal.classList.remove("show")
});

// Save data
saveBtn.addEventListener("click", async() => {
  const username = document.getElementById("usernameInput").value;
  const bio = document.getElementById("bioInput").value;

  if (!username){
    Toastify({ text: "Name can't be empty", duration: 3000, gravity: "top", position: "right", close: true, backgroundColor: "#d41313ff",}).showToast();
 }else{
  try{
    let response = await fetch("/changeinfo", {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({username,bio})
    })
    let data = await response.json()
      Toastify({ text: data.msg, duration: 3000, gravity: "top", position: "right", close: true, backgroundColor: "#d41313ff",}).showToast();
      if(data.msg === "Username Updated"){
        Toastify({ text: data.msg, duration: 3000, gravity: "top", position: "right", close: true, backgroundColor: "#d41313ff",}).showToast();
        location.reload()
      }
  }catch(err){
    Toastify({ text: "Something went wrong. Please try again!", duration: 3000, gravity: "top", position: "right", close: true, backgroundColor: "#d41313ff",}).showToast();
  }
 }
  // modal.classList.remove("show")
});


// Photo Modal logic


  document.querySelector(".user-image").addEventListener("click", ()=>{
      document.querySelector(".photo-overlay").classList.add("showPhotoModal")
   })

document.querySelector(".cancelphoto").addEventListener("click", ()=>{
   document.querySelector(".photo-overlay").classList.remove("showPhotoModal")
})


document.querySelector("#selectphotoinput").addEventListener("change", ()=>{
  const fileInput = document.querySelector("#selectphotoinput");
  const selectedFileBox = document.querySelector("#selectedFileBox");
  const fileName = document.querySelector("#fileName"); 
   if (fileInput.files.length > 0){
   let name = fileInput.files[0].name;
   fileName.innerText = "Selected: " + name;
   selectedFileBox.classList.remove("hiddenphoto");
   document.querySelector(".uploadphoto").classList.add("showuploadphoto")
  }else{
    selectedFileBox.classList.add("hiddenphoto");
    document.querySelector(".uploadphoto").classList.remove("showuploadphoto")
  }

})

document.querySelector(".uploadphoto").addEventListener("click", async()=>{
   const fileInput = document.querySelector("#selectphotoinput")
   if(fileInput.files.length>0){
      const file = fileInput.files[0]
      const formData = new FormData
      formData.append("photo", file)
      console.log(formData)
      let response = await fetch("/uploadphoto", {
        method : "POST",
        body : formData
      })
      let data = await response.json()
      console.log(data)
   }else{
    alert("No Files Selected!")
   }
})


