// const imageCanvas = document.querySelector("#image-canvas");
// const imgInput = document.querySelector("#image-input");
// const canvasCtx = imageCanvas.getContext("2d");
// const downloadBtn = document.querySelector("#download-btn");
// const resetBtn = document.querySelector("#reset-btn");

// let file = null;
// let image = null;

// const filters = {
//   brightness: {
//     value: 100,
//     min: 0,
//     max: 200,
//     unit: "%",
//   },
//   contrast: {
//     value: 100,
//     min: 0,
//     max: 200,
//     unit: "%",
//   },
//   saturation: {
//     value: 100,
//     min: 0,
//     max: 200,
//     unit: "%",
//   },
//   huRotation: {
//     value: 0,
//     min: 0,
//     max: 360,
//     unit: "deg",
//   },
//   grayscale: {
//     value: 0,
//     min: 0,
//     max: 100,
//     unit: "%",
//   },
//   sepia: {
//     value: 0,
//     min: 0,
//     max: 100,
//     unit: "%",
//   },
//   invert: {
//     value: 0,
//     min: 0,
//     max: 100,
//     unit: "%",
//   },
//   blur: {
//     value: 0,
//     min: 0,
//     max: 20,
//     unit: "px",
//   },
//   opacity: {
//     value: 100,
//     min: 0,
//     max: 100,
//     unit: "%",
//   },
// };

// const filtersContainer = document.querySelector(".filters");

// function createFilterElement(name, unit = "%", value, min, max) {
//   const div = document.createElement("div");
//   div.classList.add("filter");

//   const input = document.createElement("input");
//   input.type = "range";
//   input.id = "brightness";
//   input.value = value;
//   input.min = min;
//   input.max = max;

//   const p = document.createElement("p");
//   p.innerText = name;

//   div.appendChild(p);
//   div.appendChild(input);

//   input.addEventListener("input", (event) => {
//     filters[name].value = input.value;
//     applyFilters();
//   });

//   return div;
// }

// Object.keys(filters).forEach((filter) => {
//   const filterElement = createFilterElement(
//     filter,
//     filters[filter].unit,
//     filters[filter].value,
//     filters[filter].min,
//     filters[filter].max,
//   );

//   filtersContainer.appendChild(filterElement);
// });

// console.log(filtersContainer);

// imgInput.addEventListener("change", (event) => {
//   const imagePlaceholder = document.querySelector(".placeholder-image");
//   imagePlaceholder.style.display = "none";
//   imageCanvas.style.display = "initial";

//   file = event.target.files[0];

//   const img = new Image();

//   img.src = URL.createObjectURL(file);

//   img.onload = () => {
//     image = img;
//     imageCanvas.width = img.width;
//     imageCanvas.height = img.height;
//     canvasCtx.drawImage(image, 0, 0);
//   };
// });

// function applyFilters(){
//   canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

//     canvasCtx.filter =`
//     brightness(${filters.brightness.value}${filters.brightness.unit})
//     contrast(${filters.contrast.value}${filters.contrast.unit})
//     saturate(${filters.saturation.value}${filters.saturation.unit})
//     hue-rotate(${filters.huRotation.value}${filters.huRotation.unit})
//     grayscale(${filters.grayscale.value}${filters.grayscale.unit})
//     sepia(${filters.sepia.value}${filters.sepia.unit})
//     invert(${filters.invert.value}${filters.invert.unit})
//     blur(${filters.blur.value}${filters.blur.unit})
//     opacity(${filters.opacity.value}${filters.opacity.unit})
//     `;

//   canvasCtx.drawImage(image, 0, 0);
// }
// resetBtn.addEventListener("click", () => {

//   Object.keys(filters).forEach((key) => {
//     filters[key].value = defaultFilters[key].value;

//     const input = document.getElementById(key);
//     const label = input.previousElementSibling;

//     input.value = filters[key].value;
//     label.innerText = `${key}: ${filters[key].value}${filters[key].unit}`;
//   });

//   applyFilters();
// });
// downloadBtn.addEventListener("click", () => {


// })

let showOriginal = false;
const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const canvasCtx = imageCanvas.getContext("2d");
const downloadBtn = document.querySelector("#download-btn");
const resetBtn = document.querySelector("#reset-btn");
const removeBgBtn = document.querySelector("#remove-bg-btn");
let file = null;
let image = null;

const filters = {
  brightness: { value: 100, min: 0, max: 200, unit: "%" },
  contrast: { value: 100, min: 0, max: 200, unit: "%" },
  saturation: { value: 100, min: 0, max: 200, unit: "%" },
  huRotation: { value: 0, min: 0, max: 360, unit: "deg" },
  grayscale: { value: 0, min: 0, max: 100, unit: "%" },
  sepia: { value: 0, min: 0, max: 100, unit: "%" },
  invert: { value: 0, min: 0, max: 100, unit: "%" },
  blur: { value: 0, min: 0, max: 20, unit: "px" },
  opacity: { value: 100, min: 0, max: 100, unit: "%" },
};

// ✅ Store default values ONCE
const defaultFilters = JSON.parse(JSON.stringify(filters));

const filtersContainer = document.querySelector(".filters");
// Create filter slider element
function createFilterElement(name, unit, value, min, max) {
  const div = document.createElement("div");
  div.classList.add("filter");

  const input = document.createElement("input");
  input.type = "range";
  input.id = name;            // for JS (unique)
  input.classList.add("slider");  // for CSS styling // ✅ FIXED
  input.value = value;
  input.min = min;
  input.max = max;

  const label = document.createElement("p");
  label.innerText = `${name}: ${value}${unit}`;

  div.appendChild(label);
  div.appendChild(input);

 // Update filter value on input change
  input.addEventListener("input", () => {
    // update filter value
    filters[name].value = input.value;

    // update label
    label.innerText = `${name}: ${input.value}${unit}`;

    applyFilters();
  });

  return div;
}

// Create sliders
Object.keys(filters).forEach((filter) => {
  const el = createFilterElement(
    filter,
    filters[filter].unit,
    filters[filter].value,
    filters[filter].min,
    filters[filter].max
  );
  filtersContainer.appendChild(el);
});

// Load image
imgInput.addEventListener("change", (event) => {
  const imagePlaceholder = document.querySelector(".placeholder-image");
  imagePlaceholder.style.display = "none";
  imageCanvas.style.display = "block";

  file = event.target.files[0];

// Create a new image object and load the selected file
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    image = img;
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;

    applyFilters();
  };
});


// function applyFilters() {
//   if (!image) return;

//   canvasCtx.save();

//   canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
//   canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

//   canvasCtx.restore();

//   canvasCtx.setTransform(scale, 0, 0, scale, 0, 0);

//   if (showOriginal) {
//     canvasCtx.filter = "none";
//   } else {
//     canvasCtx.filter = `
//       brightness(${filters.brightness.value}${filters.brightness.unit})
//       contrast(${filters.contrast.value}${filters.contrast.unit})
//       saturate(${filters.saturation.value}${filters.saturation.unit})
//       hue-rotate(${filters.huRotation.value}${filters.huRotation.unit})
//       grayscale(${filters.grayscale.value}${filters.grayscale.unit})
//       sepia(${filters.sepia.value}${filters.sepia.unit})
//       invert(${filters.invert.value}${filters.invert.unit})
//       blur(${filters.blur.value}${filters.blur.unit})
//       opacity(${filters.opacity.value}${filters.opacity.unit})
//     `;
//   }

//   canvasCtx.drawImage(image, 0, 0);
// }

// function applyFilters() {
//   if (!image) return;

//   // Reset canvas before redraw
//   canvasCtx.setTransform(1, 0, 0, 1, 0, 0);

//   canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

//   // Apply zoom + pan
//   canvasCtx.setTransform(
//     scale,
//     0,
//     0,
//     scale,
//     translateX,
//     translateY
//   );

//   // Apply filters
//   if (showOriginal) {
//     canvasCtx.filter = "none";
//   } else {
//     canvasCtx.filter = `
//       brightness(${filters.brightness.value}${filters.brightness.unit})
//       contrast(${filters.contrast.value}${filters.contrast.unit})
//       saturate(${filters.saturation.value}${filters.saturation.unit})
//       hue-rotate(${filters.huRotation.value}${filters.huRotation.unit})
//       grayscale(${filters.grayscale.value}${filters.grayscale.unit})
//       sepia(${filters.sepia.value}${filters.sepia.unit})
//       invert(${filters.invert.value}${filters.invert.unit})
//       blur(${filters.blur.value}${filters.blur.unit})
//       opacity(${filters.opacity.value}${filters.opacity.unit})
//     `;
//   }

//   // Draw image
//   canvasCtx.drawImage(image, 0, 0);

//   // Reset filter
//   canvasCtx.filter = "none";
// }
// // Reset filters
// resetBtn.addEventListener("click", () => {
//   Object.keys(filters).forEach((key) => {
//     filters[key].value = defaultFilters[key].value;

//     const input = document.getElementById(key);
//     const label = input.previousElementSibling;

//     input.value = filters[key].value;
//     label.innerText = `${key}: ${filters[key].value}${filters[key].unit}`;
//   });

//   applyFilters();
// });

// // Download image
// downloadBtn.addEventListener("click", () => {
//   if (!image) return;

//   const link = document.createElement("a");
//   link.download = "Rohan-edited-image.png";
//   link.href = imageCanvas.toDataURL("image/png",1.0);
//   link.click();
// });


// // Toggle original/edited image
// const toggleBtn = document.querySelector("#toggle-btn");

// toggleBtn.addEventListener("click", () => {
//   showOriginal = !showOriginal;

//   toggleBtn.innerText = showOriginal ? "After" : "Before";

//   applyFilters();
// });

// // Zoom with mouse wheel
// let scale = 1;
// let translateX = 0;
// let translateY = 0;

// let isDragging = false;
// let startX = 0;
// let startY = 0;

// // imageCanvas.addEventListener("wheel", (e) => {
// //   e.preventDefault();
// //   scale += e.deltaY * -0.001;
// //   scale = Math.min(Math.max(0.5, scale), 3);

// //   canvasCtx.setTransform(scale, 0, 0, scale, 0, 0);
// //   applyFilters();
// // });

// imageCanvas.addEventListener("wheel", (e) => {
//   e.preventDefault();

//   const zoomAmount = -e.deltaY * 0.001;

//   scale += zoomAmount;

//   scale = Math.min(Math.max(0.5, scale), 5);

//   applyFilters();
// });

// // Mouse down
// imageCanvas.addEventListener("mousedown", (e) => {
//   isDragging = true;

//   startX = e.clientX - translateX;
//   startY = e.clientY - translateY;

//   imageCanvas.style.cursor = "grabbing";
// });

// // Mouse move
// window.addEventListener("mousemove", (e) => {
//   if (!isDragging) return;

//   translateX = e.clientX - startX;
//   translateY = e.clientY - startY;

//   applyFilters();
// });

// // Mouse up
// window.addEventListener("mouseup", () => {
//   isDragging = false;

//   imageCanvas.style.cursor = "grab";
// });


// // Remove background using remove.bg API
// async function removeBackground() {
//   if (!file) {
//     alert("Please upload an image first");
//     return;
//   }

//   removeBgBtn.innerText = "Removing...";
//   removeBgBtn.disabled = true;

//   try {
//     const formData = new FormData();

//     formData.append("image_file", file);
//     formData.append("size", "auto");

//     const response = await fetch(
//       "https://api.remove.bg/v1.0/removebg",
//       {
//         method: "POST",
//         headers: {
//           "X-Api-Key": "eRHmKDFkmmWhUc3fQyMrHb8D"
//         },
//         body: formData
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Background removal failed");
//     }

//     const blob = await response.blob();

//     const url = URL.createObjectURL(blob);

//     const img = new Image();

//     img.src = url;

//     img.onload = () => {
//       image = img;

//       imageCanvas.width = img.width;
//       imageCanvas.height = img.height;

//       applyFilters();

//       removeBgBtn.innerText = "Background Removed";
//     };

//   } catch (error) {
//     console.error(error);

//     alert("Something went wrong");
//   }

//   removeBgBtn.disabled = false;
// }

// removeBgBtn.addEventListener("click", removeBackground);



let showOriginal = false;
const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const canvasCtx = imageCanvas.getContext("2d");
const downloadBtn = document.querySelector("#download-btn");
const resetBtn = document.querySelector("#reset-btn");
const removeBgBtn = document.querySelector("#remove-bg-btn");
let file = null;
let image = null;

const filters = {
  brightness: { value: 100, min: 0, max: 200, unit: "%" },
  contrast: { value: 100, min: 0, max: 200, unit: "%" },
  saturation: { value: 100, min: 0, max: 200, unit: "%" },
  huRotation: { value: 0, min: 0, max: 360, unit: "deg" },
  grayscale: { value: 0, min: 0, max: 100, unit: "%" },
  sepia: { value: 0, min: 0, max: 100, unit: "%" },
  invert: { value: 0, min: 0, max: 100, unit: "%" },
  blur: { value: 0, min: 0, max: 20, unit: "px" },
  opacity: { value: 100, min: 0, max: 100, unit: "%" },
};

// ✅ Store default values ONCE
const defaultFilters = JSON.parse(JSON.stringify(filters));

const filtersContainer = document.querySelector(".filters");
// Create filter slider element
function createFilterElement(name, unit, value, min, max) {
  const div = document.createElement("div");
  div.classList.add("filter");

  const input = document.createElement("input");
  input.type = "range";
  input.id = name;            // for JS (unique)
  input.classList.add("slider");  // for CSS styling // ✅ FIXED
  input.value = value;
  input.min = min;
  input.max = max;

  const label = document.createElement("p");
  label.innerText = `${name}: ${value}${unit}`;

  div.appendChild(label);
  div.appendChild(input);

 // Update filter value on input change
  input.addEventListener("input", () => {
    // update filter value
    filters[name].value = input.value;

    // update label
    label.innerText = `${name}: ${input.value}${unit}`;

    applyFilters();
  });

  return div;
}

// Create sliders for each filter dynamically based on the filters object
Object.keys(filters).forEach((filter) => {
  const el = createFilterElement(
    filter,
    filters[filter].unit,
    filters[filter].value,
    filters[filter].min,
    filters[filter].max
  );
  filtersContainer.appendChild(el);
});

// Compression Quality Section

const compressionDiv = document.createElement("div");
compressionDiv.classList.add("filter");

const compressionLabel = document.createElement("p");
compressionLabel.innerText = "Compression Quality: 80%";

const qualitySlider = document.createElement("input");
qualitySlider.type = "range";
qualitySlider.min = "0.1";
qualitySlider.max = "1";
qualitySlider.step = "0.1";
qualitySlider.value = "0.8";

const originalSizeText = document.createElement("p");
originalSizeText.innerText = "Original Size: -";

const compressedSizeText = document.createElement("p");
compressedSizeText.innerText = "Compressed Size: -";

const savedText = document.createElement("p");
savedText.innerText = "Saved: -";

compressionDiv.appendChild(compressionLabel);
compressionDiv.appendChild(qualitySlider);
compressionDiv.appendChild(originalSizeText);
compressionDiv.appendChild(compressedSizeText);
compressionDiv.appendChild(savedText);

filtersContainer.appendChild(compressionDiv);
 

// Load image
imgInput.addEventListener("change", (event) => {
  const imagePlaceholder = document.querySelector(".placeholder-image");
  imagePlaceholder.style.display = "none";
  imageCanvas.style.display = "block";

  file = event.target.files[0];

  

// Create a new image object and load the selected file
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    image = img;
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;

  applyFilters();
  updateCompressionInfo();
  };
});
function updateCompressionInfo() {

  if (!file || !image) return;

  const quality = Number(qualitySlider.value);

  imageCanvas.toBlob((blob) => {

    if (!blob) return;

    const originalKB = file.size / 1024;
    const compressedKB = blob.size / 1024;

    originalSizeText.innerText =
      `Original Size: ${originalKB.toFixed(2)} KB`;

    compressedSizeText.innerText =
      `Compressed Size: ${compressedKB.toFixed(2)} KB`;

    const saved =
      ((file.size - blob.size) / file.size) * 100;

    savedText.innerText =
      `Saved: ${saved.toFixed(1)}%`;

  }, "image/jpeg", quality);
}
// Update compression info when quality slider changes
qualitySlider.addEventListener("input", () => {

  compressionLabel.innerText =
    `Compression Quality: ${Math.round(
      qualitySlider.value * 100
    )}%`;

  updateCompressionInfo();
});

function applyFilters() {
  if (!image) return;

  // Reset canvas before redraw
  canvasCtx.setTransform(1, 0, 0, 1, 0, 0);

  canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  // Apply zoom + pan
  canvasCtx.setTransform(
    scale,
    0,
    0,
    scale,
    translateX,
    translateY
  );

  // Apply filters
  if (showOriginal) {
    canvasCtx.filter = "none";
  } else {
    canvasCtx.filter = `
      brightness(${filters.brightness.value}${filters.brightness.unit})
      contrast(${filters.contrast.value}${filters.contrast.unit})
      saturate(${filters.saturation.value}${filters.saturation.unit})
      hue-rotate(${filters.huRotation.value}${filters.huRotation.unit})
      grayscale(${filters.grayscale.value}${filters.grayscale.unit})
      sepia(${filters.sepia.value}${filters.sepia.unit})
      invert(${filters.invert.value}${filters.invert.unit})
      blur(${filters.blur.value}${filters.blur.unit})
      opacity(${filters.opacity.value}${filters.opacity.unit})
    `;
  }

  // Draw image
  canvasCtx.drawImage(image, 0, 0);

  // Reset filter
  canvasCtx.filter = "none";
  //
  updateCompressionInfo();
}
// Reset filters
resetBtn.addEventListener("click", () => {
  Object.keys(filters).forEach((key) => {
    filters[key].value = defaultFilters[key].value;

    const input = document.getElementById(key);
    const label = input.previousElementSibling;

    input.value = filters[key].value;
    label.innerText = `${key}: ${filters[key].value}${filters[key].unit}`;
  });

  applyFilters();
});

// Download image
downloadBtn.addEventListener("click", () => {
  if (!image) return;

  const link = document.createElement("a");
  link.download = "Rohan-edited-image.png";
  const quality = Number(qualitySlider.value);
link.href = imageCanvas.toDataURL("image/jpeg", quality);
  link.click();
});


// Toggle original/edited image
const toggleBtn = document.querySelector("#toggle-btn");

toggleBtn.addEventListener("click", () => {
  showOriginal = !showOriginal;

  toggleBtn.innerText = showOriginal ? "After" : "Before";

  applyFilters();
});

// Zoom with mouse wheel
let scale = 1;
let translateX = 0;
let translateY = 0;

let isDragging = false;
let startX = 0;
let startY = 0;


imageCanvas.addEventListener("wheel", (e) => {
  e.preventDefault();

  const zoomAmount = -e.deltaY * 0.001;

  scale += zoomAmount;

  scale = Math.min(Math.max(0.5, scale), 5);

  applyFilters();
});

// Mouse down
imageCanvas.addEventListener("mousedown", (e) => {
  isDragging = true;

  startX = e.clientX - translateX;
  startY = e.clientY - translateY;

  imageCanvas.style.cursor = "grabbing";
});

// Mouse move
window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  translateX = e.clientX - startX;
  translateY = e.clientY - startY;

  applyFilters();
});

// Mouse up
window.addEventListener("mouseup", () => {
  isDragging = false;

  imageCanvas.style.cursor = "grab";
});


// Remove background using remove.bg API
async function removeBackground() {
  if (!file) {
    alert("Please upload an image first");
    return;
  }

  removeBgBtn.innerText = "Removing...";
  removeBgBtn.disabled = true;

  try {
    const formData = new FormData();

    formData.append("image_file", file);
    formData.append("size", "auto");

    const response = await fetch(
      "https://api.remove.bg/v1.0/removebg",
      {
        method: "POST",
        headers: {
          "X-Api-Key": "eRHmKDFkmmWhUc3fQyMrHb8D"
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error("Background removal failed");
    }

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const img = new Image();

    img.src = url;

    img.onload = () => {
      image = img;

      imageCanvas.width = img.width;
      imageCanvas.height = img.height;

      applyFilters();

      removeBgBtn.innerText = "Background Removed";
    };

  } catch (error) {
    console.error(error);

    alert("Something went wrong");
  }

  removeBgBtn.disabled = false;
}

removeBgBtn.addEventListener("click", removeBackground);

/// for mobile view rohan 

const mobileFilterBtn =
document.querySelector(".mobile-filter-btn");

const filterPanel =
document.querySelector(".right");

const closeFilters =
document.querySelector("#close-filters");

mobileFilterBtn.addEventListener(
  "click",
  () => {

    filterPanel.classList.add("active");

  }
);

closeFilters.addEventListener(
  "click",
  () => {

    filterPanel.classList.remove("active");

  }
);


// overlry 

const overlay =
document.querySelector(".overlay");

mobileFilterBtn.addEventListener(
  "click",
  () => {

    filterPanel.classList.add("active");

    overlay.classList.add("active");
  }
);

closeFilters.addEventListener(
  "click",
  () => {

    filterPanel.classList.remove("active");

    overlay.classList.remove("active");
  }
);

overlay.addEventListener(
  "click",
  () => {

    filterPanel.classList.remove("active");

    overlay.classList.remove("active");
  }
);
