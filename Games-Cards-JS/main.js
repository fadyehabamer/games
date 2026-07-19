let cards = document.querySelectorAll(".card"),
    container = document.querySelector(".container"),
    bckImg = document.querySelector(".bg-img")
cards.forEach(card => {
    card.addEventListener("click", () => {
        let imgsrc = card.getElementsByTagName('img')[0].src
        bckImg.style.backgroundImage = 'url(' + imgsrc + ')'
        container.style.opacity = "0"
    })
    card.addEventListener("mouseleave", () => {
        bckImg.style.background = ""
        container.style.opacity = "1"
    })
});