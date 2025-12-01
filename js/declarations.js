// SVG DIV element
let svgCard = document.querySelector("#svgCard");
// SVG element
let card = document.querySelector("#svgCard svg");
const cardName = document.querySelector("#cardName");
// Init the custom context menu action
/* Selected target obj */
let targetObj = null;
// Pointing to the modals
const bTextModal = new bootstrap.Modal("#textModal");
const bImageModal = new bootstrap.Modal("#imageModal");
// Pointing the the DOM objects
// Pointing to the modals

/* ================= Text modal ================= */

const textModal = document.querySelector("#textModal");
/* New text */
const newText = document.querySelector("#newText");
const newTextLabel = document.querySelector("#newTextLabel");
const newTextError = document.querySelector("#newTextError");
/* Text size */
const textSize = document.querySelector("#textSize");
const textSizeError = document.querySelector("#textSizeError");

/* Buttons */
const textModalSaveBtn = document.querySelector("#textModalSaveBtn");
const textModalCloseBtn = document.querySelector("#textModalCloseBtn");
const textModalCloseXBtn = document.querySelector("#textModalCloseXBtn");
/* Alignment buttons */
const textAlignmentBtns = [document.querySelector("#textAlignmentLeftBtn"), document.querySelector("#textAlignmentCenterBtn"), document.querySelector("#textAlignmentRightBtn")]
const [textAlignmentLeftBtn, textAlignmentCenterBtn, textAlignmentRightBtn] = textAlignmentBtns;
/* ================= Image modal ================= */

const imageModal = document.querySelector("#imageModal");
const imageInput = document.querySelector("#newImage");
const imageLabel = document.querySelector("#newImageLabel");

/* Buttons */
const imageModalSaveBtn = document.querySelector("#imageModalSaveBtn");
const imageModalCloseBtn = document.querySelector("#imageModalCloseBtn");
const imageModalCloseXBtn = document.querySelector("#imageModalCloseXBtn");

/* ================= Cards & Models  ================= */

/* Groups */
const cards = document.querySelector("#cards");
const models = document.querySelector("#models");

/* Inputs */
const newCard = document.querySelector("#newCard");
const newModel = document.querySelector("#newModel");

/* Buttons */
/* Load */
const loadNewCardBtn = document.querySelector("#loadNewCardBtn");
const loadNewModelBtn = document.querySelector("#loadNewModelBtn");
/* Delete */
const deleteCardsBtns = document.querySelector("deleteCard");
const deleteModelsBtns = document.querySelector("deleteModel");
/* Download */
const downloadCardSVGBtn = document.querySelector("#downloadCardSVGBtn");
const downloadCardPNGBtn = document.querySelector("#downloadCardPNGBtn");

/* DBs */

const cardsModelsDBName = "cardsModels";
let cardsModelsDB = null;