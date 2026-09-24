let cards = document.querySelectorAll(".card"),
    container = document.querySelector(".container"),
    bckImg = document.querySelector(".bg-img")
function showCard(card) {
    let imgsrc = card.getElementsByTagName('img')[0].src
    bckImg.style.backgroundImage = 'url(' + imgsrc + ')'
    container.style.opacity = "0"
}
function hideCard() {
    bckImg.style.background = ""
    container.style.opacity = "1"
}
cards.forEach(card => {
    card.addEventListener("click", () => showCard(card))
    card.addEventListener("mouseleave", hideCard)
    // keyboard: Enter / Space previews the card, Escape or moving focus away restores the grid
    card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            showCard(card)
        } else if (e.key === "Escape") {
            hideCard()
        }
    })
    card.addEventListener("blur", hideCard)
});