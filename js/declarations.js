// SVG element
let card = document.querySelector("#svgCard svg");
// Init the custom context menu action
/* Selected target obj */
let targetObj = null;
// Pointing to the modals
const bTextModal = new bootstrap.Modal("#textModal");
const bImageModal = new bootstrap.Modal("#imageModal");
console.log(bTextModal);
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

/* Inputs */
const newCard = document.querySelector("#newCard");
const newModel = document.querySelector("#newModel");

/* Buttons */
