let getblog = async()=>{
    const parts = window.location.pathname.split("/");
    const slug = parts[parts.length - 1]; 
    console.log(slug);
}

getblog()


