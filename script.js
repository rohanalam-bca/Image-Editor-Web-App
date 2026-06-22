let showOriginal = false;
const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const canvasCtx = imageCanvas.getContext("2d");
const downloadBtn = document.querySelector("#download-btn");
const resetBtn = document.querySelector("#reset-btn");
const removeBgBtn = document.querySelector("#remove-bg-btn");
let file = null;
let image = null;
let originalImage = null;
// rotation
let rotation = 0;

let flipX = 1;
let flipY = 1;
// redo and undo  
let history = [];
let historyIndex = -1;

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

// ✅ Presets with all filter values defined for consistency and easier maintenance rohan hero
const presets = {

  Original: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    huRotation: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    opacity: 100
  },

  Aesthetic: {
    brightness: 110,
    contrast: 105,
    saturation: 120,
    huRotation: 10,
    grayscale: 0,
    sepia: 10,
    invert: 0,
    blur: 0,
    opacity: 100
  },

  SoftGlow: {
    brightness: 115,
    contrast: 90,
    saturation: 110,
    huRotation: 0,
    grayscale: 0,
    sepia: 15,
    invert: 0,
    blur: 1,
    opacity: 100
  },

  Dreamy: {
    brightness: 120,
    contrast: 85,
    saturation: 105,
    huRotation: 5,
    grayscale: 0,
    sepia: 20,
    invert: 0,
    blur: 2,
    opacity: 100
  },

  Moody: {
    brightness: 85,
    contrast: 140,
    saturation: 90,
    huRotation: 0,
    grayscale: 10,
    sepia: 5,
    invert: 0,
    blur: 0,
    opacity: 100
  },

  VintageFilm: {
    brightness: 105,
    contrast: 115,
    saturation: 85,
    huRotation: 0,
    grayscale: 5,
    sepia: 35,
    invert: 0,
    blur: 0,
    opacity: 100
  },

  Pastel: {
    brightness: 115,
    contrast: 85,
    saturation: 90,
    huRotation: 15,
    grayscale: 0,
    sepia: 5,
    invert: 0,
    blur: 1,
    opacity: 100
  },

  Sunset: {
    brightness: 110,
    contrast: 120,
    saturation: 140,
    huRotation: 20,
    grayscale: 0,
    sepia: 25,
    invert: 0,
    blur: 0,
    opacity: 100
  },

  Instagram: {
    brightness: 108,
    contrast: 125,
    saturation: 130,
    huRotation: 5,
    grayscale: 0,
    sepia: 10,
    invert: 0,
    blur: 0,
    opacity: 100
  },

  Korean: {
    brightness: 118,
    contrast: 92,
    saturation: 105,
    huRotation: 0,
    grayscale: 0,
    sepia: 8,
    invert: 0,
    blur: 1,
    opacity: 100
  },

  Anime: {
    brightness: 115,
    contrast: 130,
    saturation: 160,
    huRotation: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    opacity: 100
  },

  Cyberpunk: {
  brightness: 110,
  contrast: 150,
  saturation: 170,
  huRotation: 250,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  blur: 0,
  opacity: 100
},

GoldenHour: {
  brightness: 115,
  contrast: 110,
  saturation: 135,
  huRotation: 25,
  grayscale: 0,
  sepia: 30,
  invert: 0,
  blur: 0,
  opacity: 100
},

DarkAcademia: {
  brightness: 80,
  contrast: 145,
  saturation: 75,
  huRotation: 0,
  grayscale: 10,
  sepia: 25,
  invert: 0,
  blur: 0,
  opacity: 100
},

FairyTale: {
  brightness: 125,
  contrast: 85,
  saturation: 115,
  huRotation: 15,
  grayscale: 0,
  sepia: 10,
  invert: 0,
  blur: 3,
  opacity: 100
},

HDR: {
  brightness: 105,
  contrast: 155,
  saturation: 145,
  huRotation: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  blur: 0,
  opacity: 100
}

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
    clearTimeout(window.undoTimer);

 window.undoTimer =
 setTimeout(() => {

  saveState();

}, 400);
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
// ✅ Preset names with emojis for better UX rohan hero 
const presetNames = {

  Original: "🖼 Original",
  Aesthetic: "✨ Aesthetic",
  SoftGlow: "🌟 Soft Glow",
  Dreamy: "💭 Dreamy",
  Moody: "🌙 Moody",
  VintageFilm: "🎞 Vintage",
  Pastel: "🌸 Pastel",
  Sunset: "🌅 Sunset",
  Instagram: "📸 Instagram",
  Korean: "💖 Korean",
  Anime: "🎨 Anime",
  Cyberpunk: "🌆 Cyberpunk",
GoldenHour: "☀️ Golden Hour",
DarkAcademia: "📚 Dark Academia",
FairyTale: "🧚 Fairy Tale",
HDR: "📷 HDR"

};

const presetsContainer =
document.querySelector(".presets");

Object.keys(presets).forEach((presetName) => {

  const btn =
  document.createElement("button");

  btn.classList.add("preset-btn");

  btn.innerText =
  presetNames[presetName];

  btn.addEventListener("click", () => {

    const preset =
    presets[presetName];

    Object.keys(preset).forEach((key) => {

      filters[key].value =
      preset[key];

      const slider =
      document.getElementById(key);

      if (slider) {

        slider.value =
        preset[key];

        slider.previousElementSibling.innerText =
          `${key}: ${preset[key]}${filters[key].unit}`;

      }

    });

    applyFilters();
    saveState();

  });

  presetsContainer.appendChild(btn);

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
  originalImage = img;

  const maxWidth = 1000;
  const maxHeight = 700;

  let width = img.width;
  let height = img.height;

  // Scale down if too wide
  if (width > maxWidth) {
    height = height * (maxWidth / width);
    width = maxWidth;
  }

  // Scale down if too tall
  if (height > maxHeight) {
    width = width * (maxHeight / height);
    height = maxHeight;
  }

  imageCanvas.width = width;
  imageCanvas.height = height;

  applyFilters();
  updateCompressionInfo();
  saveState();
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
// canvasCtx.drawImage(
//   image,
//   0,
//   0,
//   imageCanvas.width,
//   imageCanvas.height
// );
// draw image with rotation 
// canvasCtx.save();

// canvasCtx.translate(
//   imageCanvas.width / 2,
//   imageCanvas.height / 2
// );

// canvasCtx.rotate(
//   rotation * Math.PI / 180
// );

// canvasCtx.scale(
//   flipX,
//   flipY
// );

// canvasCtx.drawImage(
//   image,
//   -imageCanvas.width / 2,
//   -imageCanvas.height / 2,
//   imageCanvas.width,
//   imageCanvas.height
// );

// canvasCtx.restore();

// draw image with rotation and flipping
const imageToDraw =
showOriginal
? originalImage
: image;

canvasCtx.save();

canvasCtx.translate(
  imageCanvas.width / 2,
  imageCanvas.height / 2
);

if(!showOriginal){

  canvasCtx.rotate(
    rotation * Math.PI / 180
  );

  canvasCtx.scale(
    flipX,
    flipY
  );

}

canvasCtx.drawImage(
  imageToDraw,
  -imageCanvas.width / 2,
  -imageCanvas.height / 2,
  imageCanvas.width,
  imageCanvas.height
);

canvasCtx.restore();

/// 

  // Reset filter
  canvasCtx.filter = "none";
  //
  updateCompressionInfo();
}
// reset button   

// resetBtn.addEventListener("click", () => {
//   Object.keys(filters).forEach((key) => {
//     filters[key].value = defaultFilters[key].value;

//     const input = document.getElementById(key);
//     const label = input.previousElementSibling;

//     input.value = filters[key].value;
//     label.innerText = `${key}: ${filters[key].value}${filters[key].unit}`;
//   });

//   rotation = 0;

// flipX = 1;
// flipY = 1;
//   saveState();
//   applyFilters();
// });

// // Download image
downloadBtn.addEventListener("click", () => {
  if (!image) return;

  const link = document.createElement("a");
  link.download = "Rohan-edited-image.png";
  const quality = Number(qualitySlider.value);
link.href = imageCanvas.toDataURL("image/jpeg", quality);
  link.click();
});

resetBtn.addEventListener("click", () => {

  Object.keys(filters).forEach((key) => {

    filters[key].value =
      defaultFilters[key].value;

    const input =
      document.getElementById(key);

    const label =
      input.previousElementSibling;

    input.value =
      filters[key].value;

    label.innerText =
      `${key}: ${filters[key].value}${filters[key].unit}`;

  });

  rotation = 0;

  flipX = 1;
  flipY = 1;

  scale = 1;

  translateX = 0;
  translateY = 0;

  image = originalImage;

  showOriginal = false;

  applyFilters();

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
      saveState();

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




// rotation buttons

const rotateRightBtn =
document.querySelector(
"#rotate-right-btn"
);

rotateRightBtn.addEventListener(
"click",
() => {

    rotation += 90;

    applyFilters();

    saveState();

});
// flip buttons
const rotateLeftBtn =
document.querySelector(
"#rotate-left-btn"
);

rotateLeftBtn.addEventListener(
"click",
() => {

    rotation -= 90;
   applyFilters();
   saveState();

});

// flip horizontal 
const flipHorizontalBtn =
document.querySelector(
"#flip-horizontal-btn"
);

flipHorizontalBtn.addEventListener(
"click",
() => {

    flipX *= -1;

    applyFilters();
    saveState();

});

// flip vertical
const flipVerticalBtn =
document.querySelector(
"#flip-vertical-btn"
);

flipVerticalBtn.addEventListener(
"click",
() => {

    flipY *= -1;

    applyFilters();
    saveState();

});

// save function state to history for undo/redo

function saveState() {

  if (!image) return;

  const state = {

    imageSrc: image.src,

    filters: JSON.parse(
      JSON.stringify(filters)
    ),

    rotation: rotation,

    flipX: flipX,

    flipY: flipY

  };

  history = history.slice(
    0,
    historyIndex + 1
  );

  history.push(state);

  historyIndex++;

}
// Create Restore State Function

function restoreState(state) {

  const img = new Image();

  img.src = state.imageSrc;

  img.onload = () => {

    image = img;

    const maxWidth = 1000;
    const maxHeight = 700;

    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {

      height *= maxWidth / width;

      width = maxWidth;

    }

    if (height > maxHeight) {

      width *= maxHeight / height;

      height = maxHeight;

    }

    imageCanvas.width = width;

    imageCanvas.height = height;

    rotation = state.rotation;

    flipX = state.flipX;

    flipY = state.flipY;

    Object.keys(filters).forEach((key) => {

      filters[key].value =
      state.filters[key].value;

      const slider =
      document.getElementById(key);

      if (slider) {

        slider.value =
        filters[key].value;

        slider.previousElementSibling.innerText =
          `${key}: ${filters[key].value}${filters[key].unit}`;

      }

    });

    applyFilters();

  };

}
// Undo and Buttons
const undoBtn =
document.querySelector("#undo-btn");

undoBtn.addEventListener("click", () => {

  if (historyIndex <= 0)
    return;

  historyIndex--;

  restoreState(
    history[historyIndex]
  );

});
// Redo Button
const redoBtn =
document.querySelector("#redo-btn");

redoBtn.addEventListener("click", () => {

  if (
    historyIndex >=
    history.length - 1
  ) return;

  historyIndex++;

  restoreState(
    history[historyIndex]
  );

});



/////////////////////////////////////
// Ai feature . js 

// ================================
// GEMINI VISION CAPTION GENER ATOR
// ================================

// Use your Gemini API Key
const GEMINI_API_KEY = "AQ.Ab8RN6IlX_eID-Sr4kae28mNXhF51xeXPLGRTzzdUdXApNXUyQ";

// Convert image file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result.split(",")[1]);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

// Generate Caption
async function generateCaption() {

  // Check image uploaded
  if (!file) {
    alert("Upload an image first");
    return;
  }

  const style =
    document.getElementById("caption-style").value;

  const output =
    document.getElementById("caption-output");

  output.innerText =
    "🔄 Analyzing image and generating caption...";

  try {

    // Convert image to base64
    const imageBase64 =
      await fileToBase64(file);

    const response =
      await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY
          },

          body: JSON.stringify({

            contents: [

              {

                parts: [

                  {
                    text:

`Analyze this image carefully and generate ONE short social media caption in ${style} style.

Rules:
- Maximum 20 words
- Add emojis if suitable
- Caption should match image content
- Do not explain the image
- Return only the caption`
                  },

                  {

                    inline_data: {

                      mime_type: file.type,

                      data: imageBase64

                    }

                  }

                ]

              }

            ]

          })

        }
      );

    const data =
      await response.json();

    console.log(data);

    if (
      data.candidates &&
      data.candidates.length > 0
    ) {

      output.innerText =
        data.candidates[0]
        .content.parts[0]
        .text;

    } else {

      output.innerText =
        "❌ Failed to generate caption.";

      console.log(data);
    }

  }

  catch (error) {

    console.error(error);

    output.innerText =
      "❌ Error generating caption.";

  }

}

// Generate Button
document
  .getElementById("generate-caption-btn")
  .addEventListener(
    "click",
    generateCaption
  );

// Copy Button
document
  .getElementById("copy-caption-btn")
  .addEventListener(
    "click",
    () => {

      const caption =
        document.getElementById(
          "caption-output"
        ).innerText;

      navigator.clipboard.writeText(
        caption
      );

      alert(
        "Caption copied!"
      );

    }
  );

