var api_key = '0110ed33ece90cf6ff112ff2f4a83241';
let pages = 1
let section = document.querySelector(".Movies_Sec1")
var url = `https://api.themoviedb.org/3/movie/popular?api_key=0110ed33ece90cf6ff112ff2f4a83241`;
var contentBase = section.innerHTML;
let content = "";
let TotalPages = 1
let modal = document.querySelector('.modal')
async function GetMovies(url) {
    if (pages > 1) {
        url += `&page=${pages}`
        var response = await fetch(url);
        var jsonData = await response.json();
        var top10Movies = jsonData.results;

    }
    else {
        var response = await fetch(url);
        var jsonData = await response.json();
        var top10Movies = jsonData.results;
        TotalPages = jsonData.total_pages;
    }
    top10Movies.forEach(element => {

        content += `<div class="Movie_img" style="background-image:url(https://image.tmdb.org/t/p/w500/${element.poster_path});">
        <i id='favoritIcon' class="fa-sharp fa-solid fa-crown fa-fade" onclick="IsFavorite(event)"></i>
        <div class="Movie_Info" id = ${element.id} onclick="Movie_Click(id)">
        <p class="Info_Name">${element.original_title}</p>
        <div class="Info_Plot">
            <p>${element.overview}</p>
        </div>
    </div> </div>`
    });
    //Pagess
    content += `<div class="PageNumber d-flex justify-content-center align-items-center flex-column" style="width: 100%; ">
        <hr>
        <p style="color: azure; margin: 0;">PAGE ${pages}</p>
        <hr>
        </div>`
    section.innerHTML = content + contentBase;
    //alert(content)
}

GetMovies(url)
//alert(section.innerHTML)

async function GetMoviesNameList() {
    let names = document.querySelector('.Names_Move')
    let Contet = names.innerHTML;
    let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`
    let genres;
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            data.genres.forEach(element => {
                Contet += `<p id="${element.id}" onclick="Click(event)">${element.name}</p>`
            })

        });
    names.innerHTML = Contet
}

GetMoviesNameList()
function Click(event) {
    let ID = event.target;
    pages = 1
    content = ""
    if (!ID.id) {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=0110ed33ece90cf6ff112ff2f4a83241&page=${pages}`
        GetMovies(url);
    }
    else {
        url += `&with_genres=${ID.id}`;
        GetMovies(url);
    }

}
////////////////////////////////////


function Movie_Info(id) {
    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`
}

function Search() {
    pages = 1
    content = ""
    let item = document.querySelector('.searchInput')
    let query = item.value;
    if (query.length > 2) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}&page=${pages}`
        GetMovies(url);
    }
}

function Add_Page(event) {
    if (TotalPages - 1 > pages) {
        pages++
        //alert(pages)
        GetMovies(url);
    }
}

function Back_Click() {
    modal.style.display = "none"
    sectionB.innerHTML = '';
}

async function ActorInfo(id) {
    let url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}`;
    let Sourcecode = ''
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            const cast = data.cast;
            for (let i = 0; i < cast.length; i++) {
                if (cast[i].profile_path == null) {
                    Sourcecode += `<div class="Actor animate__animated animate__bounceInRight animate__delay-2s">
                    <div class="imgitem" style="background-image:url(image/anonim.jpg) ;"></div>
                    <div class="Actor_Name">
                        <p style="color: aliceblue;">${cast[i].name}</p>
                    </div>
                </div>`
                }
                else {
                    Sourcecode += `<div class="Actor animate__animated animate__bounceInRight">
                    <div class="imgitem" style="background-image:url(https://image.tmdb.org/t/p/w185/${cast[i].profile_path}) ;"></div>
                    <div class="Actor_Name">
                        <p style="color: aliceblue;">${cast[i].name}</p>
                    </div>
                </div>`
                }
            }
            sectionB.innerHTML = Sourcecode;
            AddImgItem();

        });
}

function Movie_About(id) {
    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`
    let value = document.querySelector('.Movie_Image')
    let value2 = document.querySelector(".Movie_Overview")
    fetch(url)
        .then(response => response.json())
        .then(data => {
            value.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${data.poster_path})`
            value2.innerHTML = data.overview
        })
        .catch(error => console.error(error));
}

function Movie_Click(event) {

    Movie_About(event)
    ActorInfo(event)
    modal.style.display = "flex"




}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var sectionB = document.querySelector(".Img_List")


function AddImgItem() {
    var isDragging = false;
    var isokay = false
    var IsOk = true;
    var sectionA = document.querySelectorAll(".Actor");
    sectionB.addEventListener('mouseleave', (event) => {
        const newPosition = {
            x: event.clientX,
            y: event.clientY
        };
        isDragging = false;
        lastPosition = newPosition;
    });
    let lastPosition = null;
    sectionA.forEach(element => {
        element.addEventListener('mousedown', (event) => {
            isDragging = true;
            lastPosition = {
                x: event.clientX,
                y: event.clientY
            };
        });

        element.addEventListener('mousemove', (event) => {
            if (isDragging === true) {
                const newPosition = {
                    x: event.clientX,
                    y: event.clientY
                };
                const delta = {
                    x: newPosition.x - lastPosition.x,
                    y: newPosition.y - lastPosition.y
                };
                sectionB.scrollLeft -= delta.x;
                lastPosition = newPosition;
            }
        });

        element.addEventListener('mouseup', (event) => {
            const newPosition = {
                x: event.clientX,
                y: event.clientY
            };
            isDragging = false;
            lastPosition = newPosition;
        });
    });

}

////////////////////////////////////
function IsFavorite(event){
    const value = event.target
    if (value.style.color == 'gold') {
        value.style.color = '';
        value.classList.toggle('fa-beat');
        value.classList.toggle('fa-fade');
    }
    else{
        value.classList.toggle('fa-beat');
        value.classList.toggle('fa-fade');
        value.style.color = 'gold';
    }
}





