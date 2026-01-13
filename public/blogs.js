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
userState = getdetails()


document.querySelector(".logout").addEventListener("click", async () => {
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


const getblogs = async () => {
  document.querySelector(".blogscontainer").style.display = "none"
  let response = await fetch("/getblogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  })
  let data = await response.json()
  if (data.msg === "success") {
    document.querySelector(".blogscontainer").style.display = "grid"
    document.querySelector(".loaderback").style.display = "none"
    let blogs = data.blogs
    for (let i = 0; i < blogs.length; i++) {
      let blog = blogs[i]
      const blogCard = document.createElement("div");
      blogCard.className = "blogcard";

      blogCard.innerHTML = `
  <img src="dp.jpg" alt="" class="dp">
  <div class="blogcontent">
    <div class="blogtitle">${blog.title}</div>

    <div class="userinfo">
      <img src="Amrit.jpeg" alt="img" class="userimg">
      <div class="username">${blog.username}</div>
    </div>

    <div class="blogpara">
      ${blog.content}
    </div>

    <div class="readbtn">
      <a href="/blog/${blog.blogid}" class="readmore">Read More</a>
    </div>
  </div>
`;
      document.querySelector(".blogscontainer").appendChild(blogCard)
    }
  } else {
    alert(data.msg)
  }

}

getblogs()