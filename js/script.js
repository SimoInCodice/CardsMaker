/* ================= On page load ================= */

document.addEventListener("DOMContentLoaded", (e) => {
    // Update models
    models.innerHTML = getDB("cardsModels").objs.filter(o => o.model).map(m => `<p onclick="onCardModelClick(this)" value="cardsModels-${m.id}">${m.name}</p>`).join("");
    // Update cards
    cards.innerHTML = getDB("cardsModels").objs.filter(o => !o.model).map(m => `<p onclick="onCardModelClick(this)" value="cardsModels-${m.id}">${m.name}</p>`).join("");
});

/* ================= Text modal ================= */

/* Save button */
textModalSaveBtn.addEventListener("click", (e) => {
    // Check the obj tag
    if (targetObj.localName !== "text") return alert("Errore: Non è stato possibile modificare il testo");
    // Alert the user about the blank text field
    if (!newText.value || !textSize.value) return alert("Errore: Hai lasciato un(dei) campo(i) vuoto(i)");
    const max = Number(textSize.getAttribute("max"));
    if (Number(textSize.value) > max) return alert(`Errore: La dimensione massima del testo è di ${max}px`);
    // Change the old value with the new one
    targetObj.textContent = newText.value;
    // Change the font size
    targetObj.style.fontSize = textSize.value + "px";
    // Get the current active btn
    const activeAlignmentBtn = textAlignmentBtns.find(btn => Array.from(btn.classList).includes("active"));
    // Change the text alignment
    if (activeAlignmentBtn)
        targetObj.setAttribute("text-anchor", activeAlignmentBtn.getAttribute("value"));
    // Remove the error messages
    newTextError.textContent = "";
    textSizeError.textContent = "";
    // Hide the modal
    bTextModal.hide();
});

/* Modal close action */
textModal.addEventListener("hide.bs.modal", (e) => {
    // Remove the error messages
    newTextError.textContent = "";
    textSizeError.textContent = "";
});

/* New text */
// When the user is typing in something
newText.addEventListener("input", (e) => {
    // Check if the field is blank
    if (!newText.value) {
        newTextError.style.display = "block";
        newTextError.innerText = "Inserire almeno un carattere";
    } else {
        newTextError.style.display = "none";
        newTextError.innerText = "";
    }
});

/* Text size */
textSize.addEventListener("input", (e) => {
    // Get the max value
    const max = Number(textSize.getAttribute("max"));
    // Check if the field is blank
    if (!textSize.value) {
        textSizeError.style.display = "block";
        textSizeError.innerText = "Inserire almeno un valore";
    } else if (max && Number(textSize.value) > max) {
        textSizeError.style.display = "block";
        textSizeError.innerText = `La dimensione massima del testo è di ${max}px`;
    } else {
        textSizeError.style.display = "none";
        textSizeError.innerText = "";
    }
});

/* Alignment buttons */
/* Left one */
textAlignmentLeftBtn.addEventListener("click", () => {
    highlightElement(textAlignmentBtns, "active", 0);
});
/* Center one */
textAlignmentCenterBtn.addEventListener("click", () => {
    highlightElement(textAlignmentBtns, "active", 1);
});
/* Right one */
textAlignmentRightBtn.addEventListener("click", () => {
    highlightElement(textAlignmentBtns, "active", 2);
});

/* ================= Image modal ================= */

/* Image modal save changes button action */
imageModalSaveBtn.addEventListener("click", async (e) => {
    // Check the obj tag
    if (targetObj.localName !== "image") return alert("Errore: Non è stato possibile modificare l'immagine");
    // Base64 of the file
    const [file] = imageInput.files;
    if (!file) return alert("Errore: Non è stata caricata un'immagine");
    const output = await readInputFile(imageInput, "url");
    // Modify the href of the targetObj
    targetObj.href.baseVal = output;
    console.log(targetObj.href);
    // Hide the modal
    bImageModal.hide();
    // Clear the image input
    imageInput.value = null;
});

/* ================= Context menu ================= */

document.oncontextmenu = (e) => {
    // Block the normal activity of the context menu
    e.preventDefault();
    console.log(e.target.localName);
    const target = e.target;
    // Save the target
    targetObj = target;
    // Target style
    const targetStyle = getComputedStyle(target);
    console.log(targetStyle);
    const targetTag = e.target.localName;
    // Check the tag
    if (targetTag === "text") {
        bTextModal.show();
        // Change the text inside the input to the content of the selected text
        const text = target.textContent;
        console.log(text);
        newText.value = text;
        // Insert the element id into the input label
        newTextLabel.innerText = target.id;
        // Insert the text size
        // Font size only numbers
        const parsedFontSize = extractNumber(targetStyle.fontSize);
        textSize.value = parsedFontSize;
        // Activate a specific alignment button
        // Target alignment
        const targetAlignment = targetObj.getAttribute("text-anchor");
        console.log(targetAlignment);
        // Highlight one button
        switch (targetAlignment) {
            case "end":
                highlightElement(textAlignmentBtns, "active", 0);
                break;
            case "middle":
                highlightElement(textAlignmentBtns, "active", 1);
                break;
            case "start":
                highlightElement(textAlignmentBtns, "active", 2);
                break;
        
            default:
                break;
        }
    } else if (targetTag === "image") {
        console.log(e.target.href);
        bImageModal.show();
        // Insert the element id into the input label
        console.log(newTextLabel.innerText);
        imageLabel.innerText = target.id;
    }
};

// Download the card on the click
document.querySelector("#downloadBtn").addEventListener("click", async (e) => {
    if (!card) {
        console.log("Download error: There is no card");
        alert("Download error: There is no card");
        return;
    }
    await downloadCard(card, 4);
});

/* ================= Cards & Models ================= */

/* New card load button */
loadNewCardBtn.addEventListener("click", async (e) => {
    try {
        // Check if the name is acceptable
        if (!cardName?.value)
            return alert("Error saving the card: Card name is empty");
        else if (!svgCard?.innerHTML?.startsWith("<svg"))
            return alert("Error saving the card: There is no card selected");

        // Add the model into localStorage
        insertObjDB("cardsModels", {
            name: cardName.value,
            model: false,
            file: svgCard.innerHTML
        });

        // Update cards
        cards.innerHTML = getDB("cardsModels").objs.filter(o => !o.model).map(m => `<p onclick="onCardModelClick(this)" value="cardsModels-${m.id}">${m.name}</p>`).join("");
    } catch (e) {
        alert(e);
        console.error(e);
    }
});

/* New model load button */
loadNewModelBtn.addEventListener("click", async (e) => {
    try {
        // Read the file
        const output = await readInputFile(newModel, "text");

        // Add the model into localStorage
        insertObjDB("cardsModels", {
            name: "Test" + Array.from("xxx").map(c => String.fromCharCode(65 + Math.floor(Math.random() * (90 - 65)))),
            model: true,
            file: output
        });

        // Update models
        models.innerHTML = getDB("cardsModels").objs.filter(o => o.model).map(m => `<p onclick="onCardModelClick(this)" value="cardsModels-${m.id}">${m.name}</p>`).join("");
    } catch (e) {
        alert(e);
        console.error(e);
    }
});

/* When a user click on a saved model */
function onCardModelClick(element) {
    const value = element.getAttribute("value");
    const [dbName, objId] = value.split("-");
    const model = getObjDB(dbName, objId);

    if (!model) return alert("Error loading model");

    // Change the input card name
    cardName.value = model.name;

    svgCard.innerHTML = model.file;

    card = document.querySelector("#svgCard svg");
}