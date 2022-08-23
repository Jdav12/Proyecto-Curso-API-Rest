const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2&api_key=a9728067-132e-4228-a8b3-894fe0ca7207';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';
const spanError = document.getElementById('error');

const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    timeout: 1000,
})

api.defaults.headers.common['X-API-KEY'] = 'a9728067-132e-4228-a8b3-894fe0ca7207';

async function loadRandomCat(){

const res = await fetch(API_URL_RANDOM); 
const data = await res.json();

console.log(data);

if(res.status !== 200){

    spanError.innerHTML = "Hubo un error: " + res.status;

}else{
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');

    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = () => saveFavoriteCat(data[0].id);
    btn2.onclick = () => saveFavoriteCat(data[1].id);
}
   

}

async function loadFavoriteCat(){

    const res = await fetch(API_URL_FAVORITES, {
        headers:{
            'X-API-KEY': 'a9728067-132e-4228-a8b3-894fe0ca7207',
        }
    }); 
    const data = await res.json();
    console.log('Favoritos')
    console.log(data);

    if(res.status !== 200){

        spanError.innerHTML = "Hubo un error: " + res.status +data.message;
    
    }else{
        const section = document.getElementById('favoriteCats');
        section.innerHTML="";

        data.forEach(cat => {
            const article = document.createElement('article');
            const imgContainer = document.createElement('div');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const icon = document.createElement('i');
            
            imgContainer.classList.add('card');
            article.classList.add('favArticle');
            img.classList.add('catFavImg');
            icon.classList.add('fa-heart');
            icon.classList.add('fa-solid');
            
            article.appendChild(imgContainer);
            imgContainer.appendChild(img);
            imgContainer.appendChild(btn);
            img.src = cat.image.url;
            img.width = 150;
            btn.appendChild(icon);
            btn.onclick = () => deleteFavoriteCat(cat.id);
            section.appendChild(article);
        })
    }
}

async function saveFavoriteCat(id){

 /*    const res = await fetch(API_URL_FAVORITES, {

        method:'POST',
        headers:{
            'X-API-KEY': 'a9728067-132e-4228-a8b3-894fe0ca7207',
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify({
            image_id:id,
        }),

    });

const data = await res.json(); */

    const {data, status} = await api.post('/favourites',{
        image_id: id,

    });

    console.log('Save');



    if(status !== 200){

        spanError.innerHTML = "Hubo un error: " + status + data.message;
    
    }else{
        console.log('Cat guardado en favoritos')
        loadFavoriteCat();
    }

}

async function deleteFavoriteCat(id){

    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method:'DELETE',
        headers: {
            'X-API-KEY': 'a9728067-132e-4228-a8b3-894fe0ca7207',
        },
    });

    
const data = await res.json();

if(res.status !== 200){

    spanError.innerHTML = "Hubo un error: " + res.status + data.message;

}else{
    console.log('Cat eliminado de favoritos')
    loadFavoriteCat();
}

}

async function uploadCatFoto(){
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method:'POST',
        headers:{
            //'Content-Type': 'multipart/form-data',
            'X-API-KEY': 'a9728067-132e-4228-a8b3-894fe0ca7207',
        },
        body: formData,
    });

    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto cargada");
        console.log({ data });
        console.log(data.url);
        saveFavoriteCat(data.id);
    }
}

let preview_img = (event) =>{
    let leer_img = new FileReader();
    let id_img = document.getElementById('preview');

    leer_img.onload = ()=>{
        if(leer_img.readyState == 2){
            id_img.src = leer_img.result
        }
    }
    leer_img.readAsDataURL(event.target.files[0]);
}

loadRandomCat();
loadFavoriteCat();
