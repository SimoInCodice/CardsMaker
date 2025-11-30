/* ================= On page load ================= */

document.addEventListener("DOMContentLoaded", (e) => {
    updateCardsUI();
    
    updateModelsUI();
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
    const { content: output } = await readInputFile(imageInput, "url");
    // Modify the href of the targetObj
    targetObj.href.baseVal = output;
    // Hide the modal
    bImageModal.hide();
    // Clear the image input
    imageInput.value = null;
});

/* ================= Context menu ================= */

document.oncontextmenu = (e) => {
    // Block the normal activity of the context menu
    e.preventDefault();
    const target = e.target;
    // Save the target
    targetObj = target;
    // Target style
    const targetStyle = getComputedStyle(target);
    const targetTag = e.target.localName;
    // Check the tag
    if (targetTag === "text") {
        bTextModal.show();
        // Change the text inside the input to the content of the selected text
        const text = target.textContent;
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
        bImageModal.show();
        // Insert the element id into the input label
        imageLabel.innerText = target.id;
    }
};

// Download the card on the click
downloadCardSVGBtn.addEventListener("click", async (e) => {
    console.log(cardName.value);
    if (!card) {
        console.error("Download error: There is no card");
        alert("Download error: There is no card");
        return;
    } else if (!cardName?.value) {
        console.error("Download error: There is no card name");
        alert("Download error: There is no card name");
        return;
    }
    
    downloadCardSVG(card, cardName.value);
    //await downloadCard(card, 4);
});

downloadCardPNGBtn.addEventListener("click", async (e) => {
    console.log(cardName.value);
    if (!card) {
        console.error("Download error: There is no card");
        alert("Download error: There is no card");
        return;
    } else if (!cardName?.value) {
        console.error("Download error: There is no card name");
        alert("Download error: There is no card name");
        return;
    }
    
    downloadCardPNG(card, 4, cardName.value);
});


/* ================= Cards & Models ================= */

/* Update the cards UI */

function updateCardsUI() {
    const cardsObjs = getDB(`${cardsModelsDBName}`)?.objs.filter(o => !o.model);
    if (cardsObjs?.length)
        // Update cards
        cards.innerHTML = cardsObjs.map(o => `<div class="d-flex align-items-center gap-2"><div onclick="onCardModelClick(this)" id="${cardsModelsDBName}-${o.id}">${o.name}</div><button onclick="onCardDelete(this)" style="width: fit-content;" class="btn btn-danger deleteCard" type="button" value="${o.id}">X</button></div>`).join("");
    else
        cards.innerHTML = "Nessuna carta";
}

function updateModelsUI() {
    const modelsObjs = getDB(`${cardsModelsDBName}`)?.objs.filter(o => o.model);
    if (modelsObjs?.length)
        // Update cards
        models.innerHTML = modelsObjs.map(o => `<div class="d-flex align-items-center gap-2"><div onclick="onCardModelClick(this)" id="${cardsModelsDBName}-${o.id}">${o.name}</div><button onclick="onModelDelete(this)" style="width: fit-content;" class="btn btn-danger deleteModel" type="button" value="${o.id}">X</button></div>`).join("");
    else
        models.innerHTML = "Nessun modello";
}

/* New card load button */
loadNewCardBtn.addEventListener("click", async (e) => {
    try {
        // Check if the name is acceptable
        if (!cardName?.value)
            return alert("Error saving the card: Card name is empty");
        else if (!svgCard?.innerHTML?.includes("<svg"))
            return alert("Error saving the card: There is no card selected");
        
        // Check if the name is available without (), if exists the "base" card
        const baseCard = getDB(cardsModelsDBName)?.objs?.find(o => !o.model && o.name === cardName.value);
        // Get elements that have the same name as the current card
        const sameNameCards = getDB(cardsModelsDBName)?.objs?.filter(o => !o.model && o.name.split(/ +/)[0] === cardName.value);
        let numberOfCopys = "";
        
        if (baseCard) {
            if (sameNameCards?.length != 0) {
                // Create a string with a number that can distinguish the new saved card from the old one
                const copiedCardNumber = sameNameCards.reduce((max, card) => {
                    const [cardName, numberStr] = card.name.split(/ +/);
                    if (!numberStr)
                        return max;
                    const numberOfCopy = Number(numberStr.slice(1, numberStr.length - 1));
                    
                    if (numberOfCopy > max)
                        return numberOfCopy;
                }, 0) + 1;
                numberOfCopys = `(${copiedCardNumber})`;
            }
        }

        // Remove unnecessary spaces from the card's name
        const formattedCardName = cardName.value.split(/ +/).join("_");
        
        const newCardName = !numberOfCopys ? `${formattedCardName}` : `${formattedCardName} ${numberOfCopys}`;

        // Add the model into localStorage
        insertObjDB(`${cardsModelsDBName}`, {
            name: newCardName,
            model: false,
            file: svgCard.innerHTML
        });

        updateCardsUI();
    } catch (e) {
        alert(e);
        console.error(e);
    }
    // Send a success message
    alert("The card has been saved");
});

/* New model load button */
loadNewModelBtn.addEventListener("click", async (e) => {
    const { name, content: output } = await readInputFile(newModel, "text").catch((e) => {
        alert(e);
        console.error(e);
    });
    console.log(isSVG(output));
    // Clear the input
    newModel.value = null;
    try {
        // Read the file
        const newModelName = name.split(".")[0];
        
        // Check if the model already exists
        const model = getDB(cardsModelsDBName)?.objs.find(o => o.model && o.name === newModelName);

        if (model) {
            console.error("Error saving the new model: There is another model with the same name");
            alert("Error saving the new model: There is another model with the same name");
            return;
        }

        // Add the model into localStorage
        insertObjDB(`${cardsModelsDBName}`, {
            name: newModelName,
            model: true,
            file: output
        });

        updateModelsUI();
    } catch (e) {
        alert(e);
        console.error(e);
    }
    // Send a success message
    alert("The model is successfully loaded");
});

/* When a user click on a saved model */
function onCardModelClick(element) {
    const value = element.getAttribute("id");
    const [dbName, objId] = value.split("-");
    const model = getObjDB(dbName, objId);

    if (!model) return alert("Error loading model");

    // Change the input card name
    cardName.value = model.name;

    svgCard.innerHTML = model.file;

    card = document.querySelector("#svgCard svg");
}

function deleteCardModel(id) {
    // Check the id even if the id is equals to 0
    if (!Number.isInteger(id))
        return null;
    // Delete the element and update the DB
    deleteObjDB(cardsModelsDBName, id);
    // Successful deleted the obj
    return true;
}

/* When a user want to delete a card or a model */

function onCardDelete(btn) {
    // Get the id
    const id = Number(btn?.value);
    if (!deleteCardModel(id)) {
        console.error("Error deleting card");
        alert("Error deleting card");
        return;
    }
    
    // Update the UI
    updateCardsUI();
}

function onModelDelete(btn) {
    // Get the id
    const id = Number(btn?.value);
    if (!deleteCardModel(id)) {
        console.error("Error deleting model");
        alert("Error deleting model");
        return;
    }

    // Update the UI
    updateModelsUI();
}