 const getdetails = async () => {
        try {
          let response = await fetch("/me", {
            method: "POSt",
            credentials: "include"
          })
          let data = await response.json()
          console.log(data)
          if (data.msg === "loggedIn") {
            document.querySelector(".email").innerHTML = data.email
          }
        } catch (err) {
          console.log(err)
        }
        return data.msg

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

      function createBlogCard(imageSrc, email, title, blogText) {
        // Create card container
        const card = document.createElement("div");
        card.className = "card";

        // Header
        const header = document.createElement("div");
        header.className = "card-header";

        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = email;

        const name = document.createElement("strong");
        name.textContent = email;

        header.appendChild(img);
        header.appendChild(name);

        //title
        const blogtitle = document.createElement("h2")
        blogtitle.textContent = title

        // Blog content
        const blogContent = document.createElement("div");
        blogContent.className = "blog-content";
        blogContent.textContent = blogText;

        // Actions
        const actions = document.createElement("div");
        actions.className = "actions";

        const likeBtn = document.createElement("button");
        likeBtn.textContent = "Like ❤️";

        const commentBtn = document.createElement("button");
        commentBtn.textContent = "Comment 💬";

        actions.appendChild(likeBtn);
        actions.appendChild(commentBtn);

        // Add all to card
        card.appendChild(header);
        card.appendChild(blogtitle)
        card.appendChild(blogContent);
        card.appendChild(actions);

        return card;
      }

      const getblogs = async () => {
        let response = await fetch("/getblogs", {
          method: "POST",
        })
        let data = await response.json()
        console.log(data.blogs)
        for (let i = 0; i <= data.blogs.length; i++) {
          let email = (data.blogs[i]).email
          let title = (data.blogs[i]).title
          let content = (data.blogs[i]).content
          let card = createBlogCard("Amrit.jpeg", email, title, content)
          document.querySelector(".container").appendChild(card)

        }
      }

      getblogs()