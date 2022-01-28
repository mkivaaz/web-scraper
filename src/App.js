

const feed = document.querySelector('#feed')

const BASE_URL = "http://localhost:8000/"

fetch(BASE_URL+"results",{
    method:"POST",
    body: JSON.stringify({title: "Hi"})
})
    .then(response=> response.json())
    .then( data => console.log(data))
    .catch(err => {
        console.log(err)
    })