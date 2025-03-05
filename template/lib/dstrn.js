/*
 * dframework (https://framework.dstrn.xyz/)
 * Copyright 2021-2025 dstrn
 * Licensed under CC BY-NC-SA 4.0 (https://github.com/dstrn825/dframework/blob/main/LICENSE)
 */

const EventEmitter = Base => class extends Base {
    constructor(...args) {
        super(...args);
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    emit(event, ...args) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(...args));
        }
    }
};

class dButton extends HTMLElement {
    constructor() {
      super();
      this.iconPosition = true;
      this.icon = "";
      this.text = "button";
      this.color = "var(--accent-1)";
      this.textColor = "var(--base)";
      this.hoverColor = "var(--accent-2)";
      this.hoverTextColor = "var(--base)";
      this.disabledColor = "var(--inactive-accent)";
      this.disabledTextColor = "var(--secondary-text)";
    }

    connectedCallback() {
        if(this.getAttribute("iconPosition")) this.iconPosition = (this.getAttribute("iconPosition") || "left") == "left";
        if(this.getAttribute("icon")) this.icon = `<i class="${this.getAttribute("icon")}" tabindex="-1"></i>`;
        else this.style.justifyContent = "center";
        if(this.hasAttribute("haptics")) this.classList.add("click-haptic-tr", "click-haptic-med");
        if(this.hasAttribute("disabled")) this.setDisabled(true);
        if(this.getAttribute("text")) this.text = this.getAttribute("text");
        if(this.getAttribute("color")) this.color = this.getAttribute("color");
        if(this.getAttribute("textColor")) this.textColor = this.getAttribute("textColor");
        if(this.getAttribute("hoverColor")) this.hoverColor = this.getAttribute("hoverColor");
        if(this.getAttribute("hoverTextColor")) this.hoverTextColor = this.getAttribute("hoverTextColor");
        if(this.getAttribute("disabledColor")) this.disabledColor = this.getAttribute("disabledColor");
        if(this.getAttribute("disabledTextColor")) this.disabledTextColor = this.getAttribute("disabledTextColor");

        this.style.setProperty("--d-button-color", this.color);
        this.style.setProperty("--d-button-text", this.textColor);
        this.style.setProperty("--d-button-hover", this.hoverColor);
        this.style.setProperty("--d-button-hover-text", this.hoverTextColor);
        this.style.setProperty("--d-button-disabled", this.disabledColor);
        this.style.setProperty("--d-button-disabled-text", this.disabledTextColor);

        const html = this.iconPosition ? `
        ${this.icon}
        ${this.text}
        ` : `
        ${this.text}
        ${this.icon}
        `;
        this.#render(html);
    }


    setDisabled(toggle){
        if(toggle){
            this.classList.add("disabled");
            this.style.pointerEvents = "none";
        } else {
            this.classList.remove("disabled");
            this.style.pointerEvents = "auto";
        }
    }
    setText(text){
        this.text = text;
        this.textContent = text;
    }
    setIcon(icon){
        if(!hasValue(icon)) return;
        this.icon = `<i class="${icon}" tabindex="-1"></i>`;
        this.setAttribute("icon", icon);
        select("i", this).setAttribute("class", icon);
    }
    setColor(color){
        if(!hasValue(color)) return;
        this.color = color;
        this.style.setProperty("--d-button-color", color);
    }
    setTextColor(color){
        if(!hasValue(color)) return;
        this.textColor = color;
        this.style.setProperty("--d-button-text", color);
    }
    setHoverColor(color){
        if(!hasValue(color)) return;
        this.hoverColor = color;
        this.style.setProperty("--d-button-hover", color);
    }
    setHoverTextColor(color){
        if(!hasValue(color)) return;
        this.hoverTextColor = color;
        this.style.setProperty("--d-button-hover-text", color);
    }

    #render(html) { this.innerHTML = html; }
}
customElements.define("d-button", dButton);

class dCheckbox extends EventEmitter(HTMLElement) {
    constructor() {
      super();
      this.type = 1;
      this.text = "checkbox";
      this.activeColor = "var(--accent-1)";
      this.textColor = "var(--text-primary)";
      this.inactiveColor = "var(--inactive-accent)";
      this.labelId = uniqueId();

      this.listeners = {
        change: [],
      };

      this.html = {
        1: `<label class="flex-row justify-between w-100" for="${this.labelId}">
            <input type="checkbox" name="${this.labelId}" id="${this.labelId}" hidden>
            <span class="check-label">{{ text }}</span>
            <div class="cbx-toggle-wrapper"><div class="cbx-toggle"><div class="cbx-fill"></div></div></div>
        </label>`,
        2: `<label for="${this.labelId}">
            <input type="checkbox" name="${this.labelId}" id="${this.labelId}">
            <span class="cbx">
              <svg width="12px" height="11px" viewBox="0 0 12 11">
                  <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
              </svg>
            </span>
            <span class="check-label">{{ text }}</span>
        </label>`,
      }
    }

    connectedCallback() {
        if(this.getAttribute("type")) this.type = parseInt(this.getAttribute("type"));
        if(this.getAttribute("text")) this.text = this.getAttribute("text");
        if(this.getAttribute("activeColor")) this.activeColor = this.getAttribute("activeColor");
        if(this.getAttribute("textColor")) this.textColor = this.getAttribute("textColor");
        if(this.getAttribute("inactiveColor")) this.inactiveColor = this.getAttribute("inactiveColor");

        this.style.setProperty("--d-checkbox-active", this.activeColor);
        this.style.setProperty("--d-checkbox-text", this.textColor);
        this.style.setProperty("--d-checkbox-inactive", this.inactiveColor);

        let html = this.html[this.type] || this.html[1];
        html = html.replaceAll("{{ text }}", this.text);
        this.#render(html);
    }

    setText(text){
        this.text = text;
        this.querySelector(".check-label").textContent = text;
    }
    setActiveColor(color){
        if(!hasValue(color)) return;
        this.color = color;
        this.style.setProperty("--d-checkbox-color", color);
    }
    setInactiveColor(color){
        if(!hasValue(color)) return;
        this.color = color;
        this.style.setProperty("--d-checkbox-inactive", color);
    }
    setTextColor(color){
        if(!hasValue(color)) return;
        this.textColor = color;
        this.style.setProperty("--d-checkbox-text", color);
    }

    #render(html) { 
        this.innerHTML = html;
        this.querySelector("input").addEventListener("change", (e) => {
            this.emit("change", e);
        });
    }
}
customElements.define("d-checkbox", dCheckbox);

class dColorPicker extends EventEmitter(HTMLElement) {
    constructor() {
      super();
  
      this.options = {};
  
      this.isDragging = false;
      this.activeCanvas = null;
  
      this.hue = 0;
      this.saturation = 0;
      this.lightness = 0;
  
      this.listeners = {
        colorchange: []
      };
    }
  
    connectedCallback() {
      this.options = {
        name: this.getAttribute("name") || "dstrn color picker",
        value: this.getAttribute("value") || "#000000",
        colorId: this.getAttribute("colorId") || "color0",
        default: this.getAttribute("value") || "#000000" 
      };
      const html = `
      <h3>${this.options.name}</h3>
      <div class="element-colors">
          <div class="cp-input">
            <span class="color-input click-haptic-tr click-haptic"></span>
            <input type="text" name="${this.options.colorId}" id="${this.options.colorId}" value="${this.options.value}" placeholder="${this.options.value}" autocomplete="off">
            <i class="fa-solid fa-rotate-right click-haptic-tr click-haptic"></i>
          </div>
      </div>
      <div class="color-picker-container">
          <div class="cp-main-wrapper">
            <canvas class="cp-main-canvas"></canvas>
            <div class="cp-main-indicator"></div>
          </div>
          <div class="cp-hue-wrapper">
            <canvas class="cp-hue-slider"></canvas>
            <div class="cp-hue-indicator"></div>
          </div>
      </div>
      `;
      this.#render(html);
      this.#attachEventListeners();
      this.#setValue(this.options.value);
    }
    #render(html) { this.innerHTML = html };
  
  
    #attachEventListeners() {
      const colorInput = this.querySelector(".color-input");
      const textInput = this.querySelector(`#${this.options.colorId}`);
      const resetButton = this.querySelector(".fa-rotate-right");
      const colorPickerContainer = this.querySelector(".color-picker-container");
      const mainCanvas = colorPickerContainer.querySelector(".cp-main-canvas");
      const hueSlider = colorPickerContainer.querySelector(".cp-hue-slider");
      const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
      const hueCtx = hueSlider.getContext('2d', { willReadFrequently: true });
      const mainIndicator = this.querySelector(".cp-main-indicator");
      const hueIndicator = this.querySelector(".cp-hue-indicator");
  
      const setCanvasResolution = (canvas) => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      };
      
      setCanvasResolution(mainCanvas);
      setCanvasResolution(hueSlider);
    
      this.#generateHueSlider(hueCtx, hueSlider.width, hueSlider.height);
      this.#generateColorCanvas(mainCtx, mainCanvas.width, mainCanvas.height, this.hue);
  
      colorInput.addEventListener("click", () => {
        colorPickerContainer.classList.toggle("opened");
      });
      if(this.hasAttribute("opened")) colorPickerContainer.classList.toggle("opened");
  
      this.#setupCanvasDragging(mainCanvas, mainCtx, mainCanvas.width, mainCanvas.height, mainIndicator, "main");
  
      this.#setupCanvasDragging(hueSlider, hueCtx, hueSlider.width, hueSlider.height, hueIndicator, "hue");
  
      window.addEventListener("mouseup", () => {
        this.isDragging = false;
        this.activeCanvas = null;
      });
  
      textInput.addEventListener("input", (event) => {
        const color = event.target.value;
        this.set(color);
      });
  
      resetButton.addEventListener("click", () => {
        this.set(this.options.default);
      });
    }
    #setupCanvasDragging(canvas, ctx, width, height, indicator, type) {
      canvas.addEventListener("mousedown", (event) => {
        this.isDragging = true;
        this.activeCanvas = type;
        this.#handleCanvasInteraction(event, canvas, ctx, width, height, indicator, type);
      });
  
      window.addEventListener("mousemove", (event) => {
        if (this.isDragging && this.activeCanvas === type) {
          this.#handleCanvasInteraction(event, canvas, ctx, width, height, indicator, type);
        }
      });
    }
  
    #getCanvasRelativePosition(event, canvas){
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return { x: x * (canvas.width / rect.width), y: y * (canvas.height / rect.height) };
    }
    #clamp(value, min, max){ return Math.max(min, Math.min(value, max)) };
  
    #handleCanvasInteraction(event, canvas, ctx, width, height, indicator, type) {
      const { x, y } = this.#getCanvasRelativePosition(event, canvas);
  
      const clampedX = this.#clamp(x, 0, width - 1);
      const clampedY = this.#clamp(y, 0, height);
  
      if (type === "main") {
          const imageData = ctx.getImageData(clampedX, clampedY, 1, 1).data;
          this.#setValue(this.rgbToHex(imageData[0], imageData[1], imageData[2]), "main");
  
          indicator.style.left = `${(clampedX / width) * 100}%`;
          indicator.style.top = `${(clampedY / height) * 100}%`;
      } else if (type === "hue") {
          if (clampedY >= 0 && clampedY <= height) {
              this.hue = (clampedY / height) * 360;
              const mainCanvas = this.querySelector(".cp-main-canvas");
              const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
              this.#generateColorCanvas(mainCtx, width, height, this.hue);
  
              indicator.style.top = `${(clampedY / height) * 100}%`;
              this.#setValue(this.hslToHex(this.hue, this.saturation, this.lightness));
          }
      }
    }
  
  
  
  
    #generateHueSlider(ctx, width, height) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "hsl(0, 100%, 50%)");
      gradient.addColorStop(0.167, "hsl(60, 100%, 50%)");
      gradient.addColorStop(0.333, "hsl(120, 100%, 50%)");
      gradient.addColorStop(0.5, "hsl(180, 100%, 50%)");
      gradient.addColorStop(0.667, "hsl(240, 100%, 50%)");
      gradient.addColorStop(0.833, "hsl(300, 100%, 50%)");
      gradient.addColorStop(1, "hsl(360, 100%, 50%)");
    
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    #generateColorCanvas(ctx, width, height, hue) {
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(0, 0, width, height);
  
      const whiteGradient = ctx.createLinearGradient(0, 0, width, 0);
      whiteGradient.addColorStop(0, "rgba(255,255,255,1)");
      whiteGradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = whiteGradient;
      ctx.fillRect(0, 0, width, height);
  
      const blackGradient = ctx.createLinearGradient(0, 0, 0, height);
      blackGradient.addColorStop(0, "rgba(0,0,0,0)");
      blackGradient.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = blackGradient;
      ctx.fillRect(0, 0, width, height);
    }
  
  
    isValidHex(hex) {
      return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
    }
    rgbToHex(r, g, b) {
      return (
        "#" +
        [r, g, b]
          .map((x) => x.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
      );
    }
    hexToRgb(hex) {
      hex = hex.replace(/^#/, "");
      if (hex.length === 3) {
          hex = hex.split("").map(x => x + x).join("");
      }
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return { r, g, b };
    }
    hslToHex(h, s, l) {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, "0")
          .toUpperCase();
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    }
    hexToHsl(hex) {
      hex = hex.replace(/^#/, "");
      if (hex.length === 3) {
        hex = hex.split("").map((x) => x + x).join("");
      }
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
  
      if (max === min) { 
        h = this.hue || 0;
        s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
      }
  
      return {
        h: Math.round(h), 
        s: Math.round(s * 100), 
        l: Math.round(l * 100),
      };
    }
    colorDifference(hex1, hex2) {
      const rgb1 = this.hexToRgb(hex1);
      const rgb2 = this.hexToRgb(hex2);
  
      const rDiff = rgb1.r - rgb2.r;
      const gDiff = rgb1.g - rgb2.g;
      const bDiff = rgb1.b - rgb2.b;
  
      return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    }
  
    #setValue(value, type="") {
      if (this.isValidHex(value)) {
          this.options.value = value;
          const colorInput = this.querySelector(".color-input");
          const textInput = this.querySelector(`#${this.options.colorId}`);
          colorInput.style.backgroundColor = value;
          textInput.value = value;
  
          const { h, s, l } = this.hexToHsl(value);
          if(type != "main") this.hue = h;
          this.saturation = s;
          this.lightness = l;
  
          const mainCanvas = this.querySelector(".cp-main-canvas");
          const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
          this.#generateColorCanvas(mainCtx, mainCanvas.width, mainCanvas.height, this.hue);
  
          this.emit("colorchange", value);
      }
    }
  
    
    set(value) {
      if (this.isValidHex(value)) {
          this.#setValue(value);
  
          const mainCanvas = this.querySelector(".cp-main-canvas");
          const hueSlider = this.querySelector(".cp-hue-slider");
          const mainIndicator = this.querySelector(".cp-main-indicator");
          const hueIndicator = this.querySelector(".cp-hue-indicator");
  
          const mainRect = mainCanvas.getBoundingClientRect();
          const hueRect = hueSlider.getBoundingClientRect();
          const mainCtx = mainCanvas.getContext('2d', { willReadFrequently: true });
          const imageData = mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
          const pixels = imageData.data;
  
          let targetPixel = null;
          let minDiff = Infinity;
          const tolerance = 10;
  
          for (let i = 0; i < pixels.length; i += 4) {
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              const hexColor = this.rgbToHex(r, g, b);
              const diff = this.colorDifference(value, hexColor);
  
              if (diff < tolerance && diff < minDiff) {
                  minDiff = diff;
  
                  const pixelIndex = i / 4;
                  const x = pixelIndex % mainCanvas.width;
                  const y = Math.floor(pixelIndex / mainCanvas.width);
  
                  targetPixel = { x, y };
              }
          }
  
          if (targetPixel) {
              mainIndicator.style.left = `${(targetPixel.x / mainRect.width) * 100}%`;
              mainIndicator.style.top = `${(targetPixel.y / mainRect.height) * 100}%`;
          }
  
          const yHue = (this.hue / 360) * hueRect.height;
          hueIndicator.style.top = `${(yHue / hueRect.height) * 100}%`;
      }
    }
    get(){
      return this.options.value;
    }
}
customElements.define("d-color-picker", dColorPicker);
  
class dCombobox extends EventEmitter(HTMLElement) {
    constructor() {
      super();
      this.canInput = false;
      this.canSearch = false;
      this.options = [];
      this.baseIndex = 0;
      this.listeners = {
        change: [],
      };
    }

    connectedCallback() {
        if(this.getAttribute("options")) this.options = JSON.parse(this.getAttribute("options")) || [{ value: 0, text: "default" }];
        if(this.hasAttribute("allowInput")) this.canInput = true;

        let optionsHtml = "";
        this.options.forEach((option) => {
            optionsHtml += `<li class="cb-option" value="${option.value}"><span class="cb-option-text">${option.text}</span></li>`;
        });
        const html = `
        <div class="cb-select-menu">
            <div class="cb-select-btn">
                ${this.canInput ? '<input type="text" placeholder="" style="display: none;">' : ''}
                <span class="cb-btn-text">${this.options[0]?.text}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <ul class="cb-options">${optionsHtml}</ul>
        </div>`;
        this.#render(html);
        if(this.hasAttribute("haptics")) this.querySelector(".cb-select-btn").classList.add("click-haptic-tr", "click-haptic-med");

        const menu = this.querySelector(".cb-select-menu");
        const options = menu.querySelectorAll(".cb-option");
        const selectBtn = menu.querySelector(".cb-select-btn");
        const btnText = menu.querySelector(".cb-btn-text");

        this.baseIndex = this.style.zIndex || 0;
        
        if(this.canInput){
            const input = menu.querySelector("input");
            btnText.addEventListener("dblclick", () => {
                input.style.display = "block";
                input.focus();
            });
            input.addEventListener("click", (e) => {
                e.stopPropagation();
                input.focus();
            })
            input.addEventListener("blur", () => {
                input.style.display = "none";
            });
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    input.blur();
                    input.style.display = "none";
                    if(input.value != "") btnText.innerText = input.value;
                } else if(e.key === "Escape"){
                    input.blur();
                    input.style.display = "none";
                }
            });
        }

        selectBtn.addEventListener("click", (e) => {
            const input = menu.querySelector("input");
            if(!input || e.target != btnText) {
                if(menu.classList.contains("active")){
                    this.style.zIndex = this.baseIndex;
                    menu.classList.remove("active");
                    menu.querySelector(".cb-options").style.maxHeight = "0";
                    menu.querySelector(".cb-options").style.pointerEvents = "none";
                    setTimeout(() => {
                        menu.querySelector(".cb-options").style.filter = "brightness(10)";
                    }, 300);
                } else {
                    this.style.zIndex = "100";
                    menu.classList.add("active");
                    menu.querySelector(".cb-options").style.maxHeight = "20em";
                    menu.querySelector(".cb-options").style.pointerEvents = "all";
                    menu.querySelector(".cb-options").style.filter = "none";
                }
            }
        });
        
        options.forEach((option) => {
            if(option.classList.contains("cb-create-new")) return;
            option.addEventListener("click", () => {
                const optionText = option.querySelector(".cb-option-text").innerText;
                const optionValue = option.getAttribute("value");

                const value = this.options.find((option) => option.value == optionValue);
                if(!value) return;

                btnText.innerText = optionText;
                if(this.canInput){
                    const input = menu.querySelector("input");
                    input.placeholder = optionText;
                }

                this.style.zIndex = this.baseIndex;
                menu.classList.remove("active");
                menu.querySelector(".cb-options").style.maxHeight = "0";
                menu.querySelector(".cb-options").style.pointerEvents = "none";
                setTimeout(() => {
                    menu.querySelector(".cb-options").style.filter = "brightness(10)";
                }, 300);
                this.emit("change", value);
            });
        });
    }

    setOptions(ops){
        this.options = ops;
        let optionsHtml = "";
        this.options.forEach((option) => {
            optionsHtml += `<li class="cb-option"><span class="cb-option-text">${option.text}</span></li>`;
        });
        const optionsContainer = this.querySelector(".cb-options");
        optionsContainer.innerHTML = optionsHtml;
        const options = this.querySelectorAll(".cb-option");
        const btnText = this.querySelector(".cb-btn-text");

        options.forEach((option) => {
            if(option.classList.contains("cb-create-new")) return;
            option.addEventListener("click", () => {
                const menu = this.querySelector(".cb-select-menu");
                const optionText = option.querySelector(".cb-option-text").innerText;
                const optionValue = option.getAttribute("value");

                const value = this.options.find((option) => option.value == optionValue);
                if(!value) return;

                btnText.innerText = optionText;
                if(this.canInput){
                    const input = menu.querySelector("input");
                    input.placeholder = optionText;
                }

                this.style.zIndex = this.baseIndex;
                menu.classList.remove("active");
                menu.querySelector(".cb-options").style.maxHeight = "0";
                menu.querySelector(".cb-options").style.pointerEvents = "none";
                setTimeout(() => {
                    menu.querySelector(".cb-options").style.filter = "brightness(10)";
                }, 300);
                this.emit("change", value);
            });
        });
    }

    set(value){
        const option = this.options.find((option) => option.value == value);
        if(!option) return;
        const btnText = this.querySelector(".cb-btn-text");
        btnText.innerText = option.text;
        if(this.canInput){
            const input = this.querySelector("input");
            input.placeholder = option.text;
        }
        this.emit("change", option);
    }
    get(){
        const btnText = this.querySelector(".cb-btn-text");
        const option = this.options.find((option) => option.text == btnText.innerText);
        if(!option) return null;
        return option.value;
    }

    #render(html) { this.innerHTML = html; }
}
customElements.define("d-combobox", dCombobox);

class dContextMenu extends EventEmitter(HTMLElement) {
    constructor() {
      super();
      this.options = [];
      this.listeners = {
        click: [],
      };

      this.closeMenu = this.closeMenu.bind(this);
    }

    connectedCallback(){
        this.#render();

        this.parentElement.style.position = "relative";
        this.parentElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.openCloseMenu(e);
        });
    }

    openCloseMenu(e=null){
        if(this.classList.contains("open")){
            this.closeMenu();
        } else {
            if(e){
                const parentRect = this.parentElement.getBoundingClientRect();
                const x = e.clientX - parentRect.left;
                const y = e.clientY - parentRect.top;
                this.style.left = `${x}px`;
                this.style.top = `${y}px`;
            }
            this.openMenu();
        }
    }
    openMenu(){
        document.querySelectorAll("d-context-menu").forEach(el => { if(el != this) el.closeMenu() });
        this.classList.toggle("open");
        this.style.maxWidth = "16em";
        this.style.maxHeight = "10em";
        this.style.filter = "none";
        document.addEventListener("click", this.closeMenu);
    }
    closeMenu(e=null){
        if(e && e.target == this) return;
        this.classList.remove("open");
        this.style.maxWidth = "0";
        this.style.maxHeight = "0";
        this.style.filter = "none";
        setTimeout(() => {
            this.style.filter = "brightness(10)";
        }, 300);
        document.removeEventListener("click", this.closeMenu);
    }

    #render() {
        setTimeout(() => {
            const children = Array.from(this.children);
            const wrapper = document.createElement("div");
            wrapper.classList.add("context-wrapper");

            children.forEach(child => {
                const newChild = document.createElement("div");
                newChild.classList.add("context-element");
                newChild.appendChild(child.cloneNode(true));
                wrapper.appendChild(newChild);
            });

            this.replaceChildren(wrapper);

            const contextElements = this.querySelectorAll(".context-element");
            contextElements.forEach(contextElement => {
                contextElement.addEventListener("click", () => {
                    this.closeMenu();
                    this.emit("click", contextElement);
                });
            });

            if(this.hasAttribute("opened")) this.openMenu();
        });
    }
}
customElements.define("d-context-menu", dContextMenu);

class dDrawer extends HTMLElement {
    constructor() {
      super();

      this.isOpened = false;
      this.isAnimation = false;
      this.direction = "right";
      this.directions = {
        top: { x: 0, y: -1 },
        right: { x: 1, y: 0 },
        bottom: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
      };
    }

    connectedCallback(){
        if(this.getAttribute("direction")) this.direction = this.getAttribute("direction");
        this.#render();
    }

    #render() {
        setTimeout(() => {
            const animation1 = document.createElement("div");
            const animation2 = document.createElement("div");
            const wrapper = document.createElement("div");
            animation1.classList.add("drawer-animation1");
            animation2.classList.add("drawer-animation2");
            wrapper.classList.add("drawer-wrapper");

            const children = Array.from(this.children);
            children.forEach(child => {
                wrapper.appendChild(child.cloneNode(true));
            });
            this.replaceChildren(animation1, animation2, wrapper);

            if(this.hasAttribute("opened")) this.handleOpenClose();
        });
    }

    handleOpenClose() {
        const animation1 = this.querySelector(".drawer-animation1");
        const animation2 = this.querySelector(".drawer-animation2");
        const main = this.querySelector(".drawer-wrapper");
        const dir = this.directions[this.direction];

        let transitionSize = "width";
        let mainDirection = "left";
        if(dir.x){
            this.style.justifyContent = dir.x > 0 ? "flex-start" : "flex-end";
        } else {
            this.style.alignItems = dir.y > 0 ? "flex-start" : "flex-end";
            transitionSize = "height";
            mainDirection = "top";
        }

        if (this.isAnimation) return;
        this.isAnimation = true;

        if (this.isOpened) {
            this.isOpened = false;
            this.style.backgroundColor = "rgba(0, 0, 0, 0)";
            animation1.style[transitionSize] = "0%";
            animation1.style.transition = "all 0.6s ease-in-out";
            animation2.style[transitionSize] = "0%";
            animation2.style.transition = "all 0.5s ease-in-out";
            main.style.transition = `${mainDirection} 0.4s ease-in-out`;
            main.style[mainDirection] = `${-100 * (dir.x || dir.y)}%`;

            setTimeout(() => {
                this.isAnimation = false;
                this.style.display = "none";
            }, 600);
        } else {
            this.style.display = "flex";
            setTimeout(() => {
                this.isOpened = true;
                this.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
                animation1.style[transitionSize] = "100%";
                animation1.style.transition = "all 0.4s ease-in-out";
                animation2.style[transitionSize] = "100%";
                animation2.style.transition = "all 0.5s ease-in-out";
                main.style.transition = `${mainDirection} 0.6s ease-in-out`;
                main.style[mainDirection] = "0";
                this.isAnimation = false;
            }, 10);
        }
    }
}
customElements.define("d-drawer", dDrawer);

class dDropdown extends HTMLElement {
    constructor() {
      super();

      this.header = "dropdown"
      this.isOpened = false;
    }

    connectedCallback(){
        const html = `
        <div class="d-dropdown-top">
            <div class="d-dropdown-header"></div>
            <i class="fa-solid fa-plus"></i>
        </div>`;
        this.#render(html);
    }

    #render(html) {
        setTimeout(() => {
            if(this.getAttribute("header")) this.header = this.getAttribute("header");
            if(this.hasAttribute("haptics")) this.classList.add("click-haptic-tr", "click-haptic-med");
            const children = Array.from(this.children);
            const wrapper = document.createElement("div");
            wrapper.classList.add("d-dropdown-content");
            children.forEach(child => {
                wrapper.appendChild(child.cloneNode(true));
            });

            this.innerHTML = html;
            this.appendChild(wrapper);
            this.querySelector(".d-dropdown-header").textContent = this.header;

            if(this.hasAttribute("opened")) this.handleOpenClose();
        });

        this.addEventListener("click", this.handleOpenClose)
    }

    handleOpenClose() {
        const content = this.querySelector(".d-dropdown-content");
        if(this.isOpened) {
            this.isOpened = false;
            content.style.maxHeight = 0;
            this.classList.remove("open");
        } else {
            this.isOpened = true;
            content.style.maxHeight = content.scrollHeight+"px";
            this.classList.add("open");
        }
    }
}
customElements.define("d-dropdown", dDropdown);

class dIconButton extends HTMLElement {
    constructor() {
      super();
      this.icon = null;
      this.loader = false;
      this.isLoading = false;
      this.color = "var(--primary-text)";
      this.activeColor = "var(--accent-1)";
    }
    connectedCallback() {
        this.icon = this.getAttribute("icon");
        if(this.hasAttribute("loader")) this.loader = true;
        if(this.hasAttribute("loading")) this.isLoading = true;
        this.style.fontSize = this.getAttribute("size") || "4.2em";

        if(this.getAttribute("color")) this.color = this.getAttribute("color");
        this.style.setProperty("--d-icon-color", this.color);
        if(this.getAttribute("activeColor")) this.activeColor = this.getAttribute("activeColor");
        this.style.setProperty("--d-icon-active-color", this.activeColor);

        let html = "";
        if(this.icon == "forward" || this.icon == "backward"){
            html = `<div class="forward-haptic">
                        <i class="fa-solid fa-play"></i>
                        <i class="fa-solid fa-play"></i>
                    </div>`;
        } else {
            html = `<div>
                        ${ this.loader ? '<svg class="loader d-none" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>' : '' }
                        <i class="${this.icon}"></i>
                    </div>`;
        }
        this.#render(html);
        this.setLoading(this.isLoading);
    }

    #render(html) {
        if(this.icon == "backward"){ this.style.transform = "rotate(180deg)"; }
        this.innerHTML = html;
        this.addEventListener("click", () => {
            switch(this.icon) {
                case "play":
                    this.querySelector("i").style.animation = "none";
                    this.querySelector("i").offsetHeight;
                    this.querySelector("i").style.animation = null;
                    this.querySelector("i")?.classList.toggle(`fa-${this.icon}`);
                    this.querySelector("i")?.classList.toggle(`fa-pause`);
                    break;
                case "forward":
                case "backward":
                    this.querySelectorAll("i").forEach(el => {
                        el.style.animation = "none";
                        el.offsetHeight;
                        el.style.animation = null;
                    });
                    break;
                case "share-nodes":
                    this.querySelector("i")?.classList.add("active");
                    this.querySelector("i")?.classList.remove(`fa-${this.icon}`);
                    this.querySelector("i")?.classList.add("fa-circle-check");
                    setTimeout(() => {
                        this.querySelector("i")?.classList.remove("active");
                        this.querySelector("i").style.animation = "none";
                        this.querySelector("i").offsetHeight;
                        this.querySelector("i").style.animation = null;
                        this.querySelector("i")?.classList.remove("fa-circle-check");
                        this.querySelector("i")?.classList.add(`fa-${this.icon}`);
                    }, 1200);
                    break;
                default:
                    this.querySelector("i")?.classList.toggle("active");
                    break;
            }
        });
    }

    switchState(remove, add){
        this.querySelector("i").style.animation = "none";
        this.querySelector("i").offsetHeight;
        this.querySelector("i").style.animation = null;
        this.querySelector("i").classList.remove(remove);
        this.querySelector("i").classList.add(add);
    }

    change(icon){
        this.querySelector("i").style.animation = "none";
        this.querySelector("i").offsetHeight;
        this.querySelector("i").style.animation = null;
        this.querySelector("i").classList.remove(this.icon);
        this.querySelector("i").classList.add(icon);
        this.icon = icon;
    }

    setLoading(state){
        if(!this.loader) return;
        if(state){
            this.querySelector(".loader").classList.remove("d-none");
            this.querySelector("i").classList.add("d-none");
            this.isLoading = true;
            this.style.pointerEvents = "none";
        } else {
            this.querySelector(".loader").classList.add("d-none");
            this.querySelector("i").classList.remove("d-none");
            this.isLoading = false;
            this.style.pointerEvents = null;
        }
    }
}
customElements.define("d-icon-button", dIconButton);

class dImageInput extends EventEmitter(HTMLElement) {
    constructor() {
      super();

      this.accept = "image/png, image/jpeg, image/gif";
      this.icon = "fa-solid fa-pen-to-square";

      this.listeners = {
        change: [],
      };
    }

    connectedCallback(){
        if(this.getAttribute("accept")) this.accept = this.getAttribute("accept");
        if(this.getAttribute("icon")) this.icon = this.getAttribute("icon");
        const html = `
        <div><i class="${this.icon}"></i></div>
        <input type="file" accept="${this.accept}">
        <img draggable="false">`;
        this.#render(html);
    }

    #render(html) {
        this.innerHTML = html;
        const input = this.querySelector("input");
        input.addEventListener("change", () => {
            const file = input.files[0];
            this.#updateImage(file);
        });
        this.addEventListener("click", () => input.click());
        this.addEventListener("drop", (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            this.#updateImage(file);
        });
    }
    #updateImage(file) {
        const img = this.querySelector("img");
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        this.emit("change", file);
    }

    reset() {
        const img = this.querySelector("img");
        img.src = "";
        const input = this.querySelector("input");
        input.value = "";
    }
}
customElements.define("d-image-input", dImageInput);

class dModal extends HTMLElement {
    constructor() {
      super();

      this.isOpened = false;
    }

    connectedCallback(){
        this.#render();
    }

    #render() {
        setTimeout(() => {
            const children = Array.from(this.children);
            const wrapper = document.createElement("div");
            wrapper.classList.add("d-modal-wrapper");
            const content = document.createElement("div");
            content.classList.add("d-modal-content");

            children.forEach(child => {
                content.appendChild(child.cloneNode(true));
            });
            wrapper.appendChild(content);
            this.replaceChildren(wrapper);

            this.addEventListener("click", (e) => {
                if(e.target == this) this.close();
                e.stopPropagation();
            });
            if(this.hasAttribute("opened")) this.open();
        });
    }

    open(){
        if(this.isOpened) return;
        this.isOpened = true;
        const wrapper = this.querySelector(".d-modal-wrapper");
        this.style.display = "flex";
        this.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        const sizeY = this.querySelector(".d-modal-content").scrollHeight;
        const sizeX = this.querySelector(".d-modal-content").scrollWidth;
        setTimeout(() => {
            wrapper.style.filter = "brightness(1)";
            wrapper.style.width = sizeX+"px";
            wrapper.style.height = sizeY+"px";
        }, 20);
    }
    close(){
        if(!this.isOpened) return;
        this.isOpened = false;
        const wrapper = this.querySelector(".d-modal-wrapper");
        wrapper.style.filter = "brightness(0)";
        wrapper.style.width = "0";
        wrapper.style.height = "0";
        this.style.backgroundColor = "rgba(0, 0, 0, 0)";
        setTimeout(() => {
            this.style.display = "none";
            wrapper.style.filter = "brightness(10)";
        }, 300);
    }
}
customElements.define("d-modal", dModal);

class dNotification extends HTMLElement {
    constructor() {
      super();
  
      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
      this.destroy = this.destroy.bind(this);
    }
    
    connectedCallback() {
      this.#render();
    }
  
    #render() {
      setTimeout(() => {
          const children = Array.from(this.children);
          const wrapper = document.createElement("div");
          wrapper.classList.add("d-notification-wrapper");
  
          children.forEach(child => {
              wrapper.appendChild(child.cloneNode(true));
          });
          this.replaceChildren(wrapper);
  
          if(this.hasAttribute("opened")) this.show();
      });
    }
  
    show() {
      this.style.display = "block";
      const sizeX = this.querySelector(".d-notification-wrapper").scrollWidth;
      const sizeY = this.querySelector(".d-notification-wrapper").scrollHeight;
      setTimeout(() => {
        this.style.right = "1em";
        this.style.filter = "brightness(1)";
        this.style.width = sizeX+"px";
        this.style.height = sizeY+"px";
        this.style.maxHeight = sizeY+"px";
      }, 20);
    }
    hide() {
      this.style.right = "0";
      this.style.width = "0";
      this.style.maxHeight = "0";
      setTimeout(() => {
        this.style.display = "none";
        this.style.filter = "brightness(10)";
      }, 200);
    }
    destroy() {
      this.hide();
      setTimeout(() => { this.remove() }, 300);
    }
}
customElements.define("d-notification", dNotification);

class dScroll extends HTMLElement {
    constructor() {
        super();
        this.options = {
            direction: this.getAttribute('direction') || 'vertical',
            scrollbarColor: this.getAttribute('scrollbar-color') || 'rgba(211, 172, 95, 0.5)',
            scrollbarHoverColor: this.getAttribute('scrollbar-hover-color') || 'rgba(211, 172, 95, 1)',
            thumbWidth: this.getAttribute('thumb-width') || '40%',
            thumbHoverWidth: this.getAttribute('thumb-hover-width') || '60%',
            scrollbarWidth: this.getAttribute('scrollbar-width') || '10px',
            marginTop: this.getAttribute('margin-top') || '100px',
            marginBottom: this.getAttribute('margin-bottom') || '100px',
            marginSide: this.getAttribute('margin-side') || '5px',
        };

        this.scrollContainer = null;
        this.scrollContent = null;
        this.customScrollbar = null;
        this.scrollThumb = null;

        this.updateScrollbar = this.updateScrollbar.bind(this);
        this.applyStyles = this.#applyStyles.bind(this);
        this.addEventListeners = this.#addEventListeners.bind(this);
    }

    connectedCallback() {
        setTimeout(() => this.#render());
    }

    #render() {
        const scrollContainer = document.createElement('div');
        const scrollContent = document.createElement('div');
        const customScrollbar = document.createElement('div');
        const scrollThumb = document.createElement('div');

        const isVertical = this.options.direction == 'vertical';

        scrollContainer.style.position = "relative";
        scrollContainer.style.overflow = "hidden";
        if(isVertical) {
            scrollContainer.style.height = "100%";
            scrollContainer.style.width = "auto";
        } else {
            scrollContainer.style.height = "auto";
            scrollContainer.style.width = "100%";
        }
        scrollContent.classList.add('scroll-content');
        customScrollbar.classList.add('custom-scrollbar');
        scrollThumb.classList.add('scroll-thumb');

        const children = Array.from(this.children);
        children.forEach(child => {
            const clonedChild = child.cloneNode(true);
            scrollContent.appendChild(clonedChild);
            child.remove();
        });
        

        scrollContainer.appendChild(scrollContent);
        customScrollbar.appendChild(scrollThumb);
        scrollContainer.appendChild(customScrollbar);
        this.appendChild(scrollContainer);

        this.scrollContent = scrollContent;
        this.scrollThumb = scrollThumb;
        this.scrollContainer = scrollContainer;
        this.customScrollbar = customScrollbar;

        this.#applyStyles();
        this.#addEventListeners();
    }

    #applyStyles() {
        const { scrollbarColor, scrollbarHoverColor, thumbWidth, thumbHoverWidth, scrollbarWidth, marginTop, marginBottom, marginSide } = this.options;
        const isVertical = this.options.direction == 'vertical';

        this.scrollContent.style.overflowY = 'scroll';
        this.scrollContent.style.msOverflowStyle = 'none';
        this.scrollContent.style.scrollbarWidth = 'none';

        const visibleChildren = Array.from(this.scrollContent.children).filter(
            (child) => window.getComputedStyle(child).display !== 'none'
        );

        if(isVertical) {
            this.scrollContent.style.height = '100%';
            this.scrollContent.style.width = 'auto';
            this.scrollContent.style.scrollSnapType = 'y mandatory';

            visibleChildren.forEach((child) => {
                child.style.marginTop = 0;
                child.style.marginBottom = "0.5em";
            });

            this.customScrollbar.style.width = scrollbarWidth;
            this.customScrollbar.style.marginRight = marginSide;
            this.customScrollbar.style.height = '100%';
        } else {
            this.scrollContent.style.height = 'auto';
            this.scrollContent.style.width = '100%';
            this.scrollContent.style.scrollSnapType = 'x mandatory';

            visibleChildren.forEach((child) => {
                child.style.marginLeft = 0;
                child.style.marginRight = "0.5em";
            });

            this.customScrollbar.style.height = scrollbarWidth;
            this.customScrollbar.style.marginBottom = marginSide;
            this.customScrollbar.style.width = '100%';
        }
        
        if (visibleChildren.length > 0) {
            if(isVertical) visibleChildren[0].style.marginTop = marginTop;
            else visibleChildren[0].style.marginLeft = marginTop;
            visibleChildren[0].style.scrollSnapAlign = "start";
        }
        if (visibleChildren.length > 1) {
            if(isVertical) visibleChildren[visibleChildren.length - 1].style.marginBottom = marginBottom;
            else visibleChildren[visibleChildren.length - 1].style.marginRight = marginBottom;
            visibleChildren[visibleChildren.length - 1].style.scrollSnapAlign = "end";
        }

        this.customScrollbar.style.position = 'absolute';
        this.customScrollbar.style.display = 'none';
        this.customScrollbar.style.justifyContent = 'center';
        this.customScrollbar.style.top = '0';
        this.customScrollbar.style.right = '0';
        this.customScrollbar.style.borderRadius = '5px';
        this.customScrollbar.style.zIndex = '10';

        this.scrollThumb.style.background = scrollbarColor;
        this.scrollThumb.style.borderRadius = '5px';
        this.scrollThumb.style.width = thumbWidth;
        this.scrollThumb.style.transition = 'background 0.3s ease-in-out, width 0.3s ease-in-out';
        this.scrollThumb.style.position = 'relative';

        this.scrollThumb.addEventListener('mouseenter', () => {
            this.scrollThumb.style.width = thumbHoverWidth;
            this.scrollThumb.style.cursor = 'default';
            this.scrollThumb.style.background = scrollbarHoverColor;
        });
        this.scrollThumb.addEventListener('mouseleave', () => {
            this.scrollThumb.style.width = thumbWidth;
            this.scrollThumb.style.cursor = 'default';
            this.scrollThumb.style.background = scrollbarColor;
        });
        this.scrollThumb.addEventListener('mousedown', () => {
            this.scrollThumb.style.cursor = 'grabbing';
        });
    }

    updateScrollbar() {
        const contentHeight = this.scrollContent.scrollHeight - 200;
        const containerHeight = this.scrollContainer.clientHeight;
        const thumbHeight = Math.max((containerHeight / contentHeight) * containerHeight, 30);
        const scrollTop = this.scrollContent.scrollTop - 100;
        const maxThumbTop = containerHeight - thumbHeight;
        
        this.scrollThumb.style.background = this.options.scrollbarColor;

        const visibleChildren = Array.from(this.scrollContent.children).filter(
            (child) => window.getComputedStyle(child).display !== 'none'
        );

        visibleChildren.forEach((child) => {
            child.style.marginTop = 0;
            child.style.marginBottom = "0.5em";
            child.style.scrollSnapAlign = "none";
        });

        if (contentHeight > containerHeight) {
            this.customScrollbar.style.display = 'flex';
            this.scrollThumb.style.height = `${thumbHeight}px`;
            this.scrollThumb.style.transform = `translateY(${(scrollTop / (contentHeight - containerHeight)) * maxThumbTop}px)`;
            if (visibleChildren.length > 0) {
                visibleChildren[0].style.marginTop = this.options.marginTop;
                visibleChildren[0].style.scrollSnapAlign = "start";
            }
            if (visibleChildren.length > 1) {
                visibleChildren[visibleChildren.length - 1].style.marginBottom = this.options.marginBottom;
                visibleChildren[visibleChildren.length - 1].style.scrollSnapAlign = "end";
            }
        } else {
            this.customScrollbar.style.display = 'none';
            if (this.scrollContent.firstElementChild) {
                this.scrollContent.firstElementChild.style.marginTop = '0';
            }
            if (this.scrollContent.lastElementChild) {
                this.scrollContent.lastElementChild.style.marginBottom = '0';
            }
        }
    };

    #addEventListeners() {
        const handleScroll = () => {
            this.updateScrollbar();
            const scrollPosition = this.scrollContent.scrollTop;
            const maxScroll = this.scrollContent.scrollHeight - this.scrollContent.clientHeight;

            if (scrollPosition < 100 || scrollPosition > maxScroll - 100) {
                this.scrollContent.style.scrollSnapType = 'y mandatory';
            } else {
                this.scrollContent.style.scrollSnapType = 'none';
            }
        };

        this.scrollContent.addEventListener('scroll', handleScroll);
        this.updateScrollbar();

        let isDragging = false;
        let dragStartY = 0;
        let initialScrollTop = 0;

        this.scrollThumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            document.body.style.cursor = 'grabbing';
            this.scrollContent.removeEventListener('scroll', handleScroll);
            this.scrollContent.style.pointerEvents = "none";
            this.scrollContent.style.scrollSnapType = 'none';

            dragStartY = e.clientY;
            initialScrollTop = this.scrollContent.scrollTop;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.cursor = 'default';
            this.scrollContent.addEventListener('scroll', handleScroll);
            this.scrollContent.style.pointerEvents = "all";
            this.updateScrollbar();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const scrollRatio = this.scrollContent.scrollHeight / this.scrollContainer.clientHeight;
                const newScrollTop = Math.min(
                    Math.max(100, initialScrollTop + ((e.clientY - dragStartY) * scrollRatio)),
                    this.scrollContent.scrollHeight - this.scrollContainer.clientHeight - 100
                );

                this.scrollContent.scrollTop = newScrollTop;
                this.updateScrollbar();
            }
        });
    }

    scrollTo(position){
        this.querySelector(".scroll-content").scrollTo({
            top: position,
            behavior: "smooth"
        });
    }
    append(element){
        this.querySelector(".scroll-content").appendChild(element);
    }
}
customElements.define('d-scroll', dScroll);

class dSlider extends EventEmitter(HTMLElement) {
    constructor() {
        super();
        this.options = {
            min: this.getAttribute('min') || 0,
            max: this.getAttribute('max') || 1,
            step: this.getAttribute('step') || 0.01,
            value: this.getAttribute('value') || 0.5,
        };
        this.slider = null;
        this.fill = null;
        this.textIndicator = null;
        this.getValue = this.getValue.bind(this);

        this.thumbColor = "var(--accent-1)";
        this.fillColor = "#7d6638";
        this.trackColor = "var(--base)";

        this.useSfx = false;
        this.lastPlayed = 0;

        this.listeners = {
            change: []
        };

        const sfx = `data:audio/mp3;base64,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`;
        this.sound = new Audio();
        this.sound.src = sfx;
        this.sound.preload = "auto";
    }

    connectedCallback() {
        if(this.getAttribute("thumbColor")) this.thumbColor = this.getAttribute("thumbColor");
        if(this.getAttribute("fillColor")) this.fillColor = this.getAttribute("fillColor");
        if(this.getAttribute("trackColor")) this.trackColor = this.getAttribute("trackColor");
        if(this.hasAttribute("sfx")) this.useSfx = true;

        this.style.setProperty("--d-slider-thumb", this.thumbColor);
        this.style.setProperty("--d-slider-fill", this.fillColor);
        this.style.setProperty("--d-slider-track", this.trackColor);

        const html = `
            <input type="range" min="${this.options.min}" max="${this.options.max}" value="${this.options.value}" step="${this.options.step}" class="slider"/>
            <div class="sl-bg"><div class="sl-fill"></div></div>
        `;
        this.innerHTML = html;
        this.fill = this.querySelector(".sl-fill");
        this.slider = this.querySelector("input");
        this.textIndicator = document.querySelector(`[data-slider-${this.getAttribute("id")}]`);
        
        this.slider.addEventListener("input", () => {
            if(this.textIndicator) this.textIndicator.innerHTML = `${Math.round(this.slider.value*100)}%`;
            this.fill.style.width = `${((this.slider.value - this.options.min) / (this.options.max - this.options.min)) * 100}%`;
            this.emit("change", this.getValue());
            this.#sfx();
        });
    }

    getValue(){
        return this.slider.value;
    }
    setValue(value){
        this.slider.value = value;
        if(this.textIndicator) this.textIndicator.innerHTML = `${Math.round(this.slider.value*100)}%`;
        this.fill.style.width = `${((this.slider.value - this.options.min) / (this.options.max - this.options.min)) * 100}%`;
        this.emit("change", this.getValue());
    }

    #sfx() {
        if(!this.useSfx) return;
        const now = Date.now();
        if (now - this.lastPlayed > 100) {
            this.sound.currentTime = 0;
            this.sound.play();
            this.lastPlayed = now;
        }
    }
}
customElements.define('d-slider', dSlider);

class dTextInput extends EventEmitter(HTMLElement) {
    constructor() {
      super();

      this.placeholder = "text input";
      this.icon = "fa-solid fa-magnifying-glass";
      this.autocomplete = false;
      this.isPassword = false;

      this.listeners = {
        change: [],
        keydown: [],
        keyup: [],
        focus: [],
        blur: []
      };
    }

    connectedCallback(){
        if(this.hasAttribute("password")) this.isPassword = true;
        const html = `
        <input id="stSearch" type="${ this.isPassword ? "password" : "text" }">
        <i></i>`;
        this.#render(html);
    }
    #render(html) {
        setTimeout(() => {
            if(this.hasAttribute("haptics")) this.classList.add("click-haptic-tr", "click-haptic-med");
            if(this.hasAttribute("placeholder")) this.placeholder = this.getAttribute("placeholder");
            if(this.hasAttribute("icon")) this.icon = this.getAttribute("icon");
            if(this.hasAttribute("autocomplete")) this.autocomplete = this.getAttribute("autocomplete");

            this.innerHTML = html;

            const input = this.querySelector("input");
            const icon = this.querySelector("i");
            input.placeholder = this.placeholder;
            input.autocomplete = this.autocomplete ? "" : "off";
            icon.className = this.icon;

            input.addEventListener("input", (e) => {
                this.emit("change", e.target.value);
            });
            input.addEventListener("keydown", (e) => {
                this.emit("keydown", e);
            });
            input.addEventListener("keyup", (e) => {
                this.emit("keyup", e);
            });
            input.addEventListener("focus", (e) => {
                this.emit("focus", e);
            });
            input.addEventListener("blur", (e) => {
                this.emit("blur", e);
            });
        });
    }

    getValue(){
        return this.querySelector("input").value;
    }
    setValue(value){
        this.querySelector("input").value = value;
    }
}
customElements.define("d-text-input", dTextInput);

class dToggle extends EventEmitter(HTMLElement) {
    constructor() {
        super();

        this.color = "var(--accent-3)";
        this.activeColor = "var(--accent-1)";
        this.textColor = "var(--secondary-text)";
        this.textActiveColor = "var(--base)";
        this.bgColor = "var(--accent-3)";
        this.haptics = false;

        this.listeners = {
            change: [],
        };
    }

    connectedCallback(){
        if(this.hasAttribute("haptics")) this.haptics = true;
        if(this.getAttribute("color")) this.color = this.getAttribute("color");
        if(this.getAttribute("activeColor")) this.activeColor = this.getAttribute("activeColor");
        if(this.getAttribute("textColor")) this.textColor = this.getAttribute("textColor");
        if(this.getAttribute("textActiveColor")) this.textActiveColor = this.getAttribute("textActiveColor");
        if(this.getAttribute("bgColor")) this.bgColor = this.getAttribute("bgColor");

        this.style.setProperty("--d-toggle-color", this.color);
        this.style.setProperty("--d-toggle-active", this.activeColor);
        this.style.setProperty("--d-toggle-text", this.textColor);
        this.style.setProperty("--d-toggle-text-active", this.textActiveColor);
        this.style.setProperty("--d-toggle-bg", this.bgColor);

        this.#render();
    }

    #render() {
        setTimeout(() => {
            let defaultValue = 0;
            const children = Array.from(this.children);
            children.forEach((child, index) => {
                const newChild = document.createElement("button");
                const attributes = child.getAttributeNames();
                attributes.forEach(attribute => {
                    if(attribute.startsWith("toggle-")){
                        newChild.setAttribute(attribute.replace("toggle-", ""), child.getAttribute(attribute));
                    } else if(attribute === "default"){
                        defaultValue = index;
                    }
                });
                if(this.haptics) child.classList.add("click-haptic-tr", "click-haptic");
                child.classList.add("w-100", "h-100");
                newChild.setAttribute("toggle-id", index);
                newChild.appendChild(child.cloneNode(true));
                this.appendChild(newChild);
                this.removeChild(child);
            });

            const buttons = this.querySelectorAll("button");
            buttons.forEach(button => {
                button.addEventListener("click", () => this.set(button));
            });

            this.set(defaultValue);
        });
    }

    set(toggle){
        if(typeof toggle === "string" || typeof toggle === "number"){
            toggle = this.querySelector(`button[toggle-id="${toggle}"]`);
        }
        const buttons = this.querySelectorAll("button");
        buttons.forEach(button => {
            if(button === toggle){
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });
        this.emit("change", toggle);
    }
    get(){
        return this.querySelector(".active");
    }
}
customElements.define("d-toggle", dToggle);

class dLoader extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
        const html = `<svg class="loader" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>`;
        this.#render(html);
    }

    #render(html) { this.innerHTML = html }
}
customElements.define("d-loader", dLoader);

!(function (t, n) {
    "object" == typeof exports && "object" == typeof module
      ? (module.exports = n())
      : "function" == typeof define && define.amd
      ? define("dRouter", [], n)
      : "object" == typeof exports
      ? (exports.dRouter = n())
      : (t.dRouter = n());
})("undefined" != typeof self ? self : this, function () {
    "use strict";
  
    const PATH_REGEX = /([:*])(\w+)/g;
    const WILDCARD_REGEX = /\*/g;
    const REPLACE_VARIABLE_REGEX = /\/\?/g;
    const DATA_ROUTER_ATTRIBUTE = "[data-drouter]";
  
    function getWindowPath(fallbackPath = "/") {
      return isWindowDefined() ? location.pathname + location.search + location.hash : fallbackPath;
    }
    function clean(path) {
      return path.replace(/\/+$/, "").replace(/^\/+/, "");
    }
    function isString(s) {
      return typeof s === "string";
    }
    function extractHashFromURL(url) {
      return (url && url.indexOf("#") >= 0 && url.split("#").pop()) || "";
    }
    function extractGETParams(url) {
      const parts = clean(url).split(/\?(.*)?$/);
      return [clean(parts[0]), parts.slice(1).join("")];
    }
    function parseQuery(queryString) {
      const result = {};
      const pairs = queryString.split("&");
      
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("=");
        if (pair[0] !== "") {
          const key = decodeURIComponent(pair[0]);
          if (result[key]) {
            if (!Array.isArray(result[key])) {
              result[key] = [result[key]];
            }
            result[key].push(decodeURIComponent(pair[1] || ""));
          } else {
            result[key] = decodeURIComponent(pair[1] || "");
          }
        }
      }
      
      return result;
    }
    function matchWithParams(context, route) {
      let regex;
      const params = [];
      const [pathname, queryString] = extractGETParams(clean(context.currentLocationPath));
      const decodedQueryParams = queryString === "" ? null : parseQuery(queryString);
      
      if (isString(route.path)) {
        if (
          clean(route.path) === "" && 
          clean(pathname) === ""
        ) {
          return {
            url: pathname,
            queryString: queryString,
            hashString: extractHashFromURL(context.to),
            route: route,
            data: null,
            params: decodedQueryParams
          };
        }
        
        regex = "(?:/^|^)" + clean(route.path)
          .replace(PATH_REGEX, (match, name, pathVariable) => {
            params.push(pathVariable);
            return "([^/]+)";
          })
          .replace(WILDCARD_REGEX, "?(?:.*)")
          .replace(REPLACE_VARIABLE_REGEX, "/?([^/]+|)") + "$";
      } else {
        regex = route.path;
      }
      
      const matchedPath = new RegExp(regex, "").exec(pathname);
      
      if (matchedPath) {
        let routeParams = null;
        
        if (isString(route.path)) {
          if (params.length > 0 && matchedPath) {
            routeParams = matchedPath
              .slice(1, matchedPath.length)
              .reduce((acc, paramValue, index) => {
                if (acc === null) acc = {};
                acc[params[index]] = decodeURIComponent(paramValue);
                return acc;
              }, null);
          }
        } else {
          routeParams = matchedPath.groups 
            ? matchedPath.groups 
            : matchedPath.slice(1);
        }
        
        return {
          url: clean(pathname.replace(new RegExp("^" + context.instance.root), "")),
          queryString: queryString,
          hashString: extractHashFromURL(context.to),
          route: route,
          data: routeParams,
          params: decodedQueryParams
        };
      }
      
      return false;
    }
    function isPushStateAvailable() {
      return !("undefined" === typeof window || !window.history || !window.history.pushState);
    }
    function shouldProcessOption(options, key) {
      return options[key] === undefined || options[key] === true;
    }
    function isWindowDefined() {
      return typeof window !== "undefined";
    }
    function createHooksCollection(hooks = [], collection = {}) {
      hooks.filter(hook => hook)
        .forEach(hook => {
          ["before", "after", "already", "leave"].forEach(hookName => {
            if (hook[hookName]) {
              if (!collection[hookName]) {
                collection[hookName] = [];
              }
              collection[hookName].push(hook[hookName]);
            }
          });
        });
      
      return collection;
    }
    function processQueue(queue, options, done) {
      const context = options || {};
      let i = 0;
      
      function next() {
        if (queue[i]) {
          if (Array.isArray(queue[i])) {
            const condition = queue[i][0];
            const pass = queue[i][1];
            const fail = queue[i][2];
            
            queue.splice(
              i,
              1,
              ...(condition(context) ? pass : fail)
            );
            
            next();
          } else {
            queue[i](context, (result) => {
              if (result === undefined || result === true) {
                i++;
                next();
              } else if (done) {
                done(context);
              }
            });
          }
        } else if (done) {
          done(context);
        }
      }
      
      next();
    }
    processQueue.if = function(condition, passQueue, failQueue) {
      if (!Array.isArray(passQueue)) passQueue = [passQueue];
      if (!Array.isArray(failQueue)) failQueue = [failQueue];
      return [condition, passQueue, failQueue];
    };
    function setLocationPath(context, done) {
      if (context.currentLocationPath === undefined) {
        context.currentLocationPath = context.to = getWindowPath(context.instance.root);
      }
      
      context.currentLocationPath = context.instance._checkForAHash(context.currentLocationPath);
      done();
    }
    function findRouteMatches(context, done) {
      for (let i = 0; i < context.instance.routes.length; i++) {
        const match = matchWithParams(context, context.instance.routes[i]);
        
        if (match) {
          if (!context.matches) context.matches = [];
          context.matches.push(match);
          
          if (context.resolveOptions.strategy === "ONE") {
            done();
            return;
          }
        }
      }
      
      done();
    }
    function checkNavigateOptions(context, done) {
      if (context.navigateOptions) {
        if (context.navigateOptions.shouldResolve !== undefined) {
          console.warn('"shouldResolve" is deprecated. Please check the documentation.');
        }
        if (context.navigateOptions.silent !== undefined) {
          console.warn('"silent" is deprecated. Please check the documentation.');
        }
      }
      
      done();
    }
    function checkForForceOption(context, done) {
      if (context.navigateOptions.force === true) {
        context.instance._setCurrent([
          context.instance._pathToMatchObject(context.to)
        ]);
        done(false);
      } else {
        done();
      }
    }
  
    const isWindowAvailable = isWindowDefined();
    const isPushStateSupported = isPushStateAvailable();
  
    function updateBrowserURL(context, done) {
      if (shouldProcessOption(context.navigateOptions, "updateBrowserURL")) {
        const normalizedPath = ("/" + context.to).replace(/\/\//g, "/");
        const isHashMode = isWindowAvailable && context.resolveOptions && context.resolveOptions.hash === true;
        
        if (isPushStateSupported) {
          history[context.navigateOptions.historyAPIMethod || "pushState"](
            context.navigateOptions.stateObj || {},
            context.navigateOptions.title || "",
            isHashMode ? "#" + normalizedPath : normalizedPath
          );
          
          if (location && location.hash) {
            context.instance.__freezeListening = true;
            setTimeout(() => {
              if (!isHashMode) {
                const { hash } = location;
                location.hash = "";
                location.hash = hash;
              }
              context.instance.__freezeListening = false;
            }, 1);
          }
        } else if (isWindowAvailable) {
          window.location.href = context.to;
        }
      }
      
      done();
    }
    function processLeaveHooks(context, done) {
      const instance = context.instance;
      
      if (!instance.lastResolved()) {
        done();
        return;
      }
      
      processQueue(
        instance.lastResolved().map(previouslyResolved => {
          return (_, nextDone) => {
            if (previouslyResolved.route.hooks && previouslyResolved.route.hooks.leave) {
              const routeMatched = instance.matchLocation(
                previouslyResolved.route.path,
                context.currentLocationPath,
                false
              );
              
              let shouldRunLeaveHooks = false;
              
              if (previouslyResolved.route.path === "*") {
                shouldRunLeaveHooks = !context.matches || 
                  !context.matches.find(match => {
                    return previouslyResolved.route.path === match.route.path;
                  });
              } else {
                shouldRunLeaveHooks = !routeMatched;
              }
              
              if (shouldProcessOption(context.navigateOptions, "callHooks") && shouldRunLeaveHooks) {
                processQueue(
                  previouslyResolved.route.hooks.leave.map(hook => {
                    return (_, nextDone) => {
                      return hook(
                        (shouldContinue) => {
                          if (shouldContinue === false) {
                            context.instance.__markAsClean(context);
                          } else {
                            nextDone();
                          }
                        },
                        context.matches && context.matches.length > 0
                          ? (context.matches.length === 1
                            ? context.matches[0]
                            : context.matches)
                          : undefined
                      );
                    };
                  }).concat([() => nextDone()]),
                );
              } else {
                nextDone();
              }
            } else {
              nextDone();
            }
          };
        }),
        {},
        () => done()
      );
    }
    function updateState(context, done) {
      if (shouldProcessOption(context.navigateOptions, "updateState")) {
        context.instance._setCurrent(context.matches);
      }
      done();
    }
  
    const matchedRouteHandlers = [
      function checkForAlreadyHook(context, done) {
        const currentMatches = context.instance.lastResolved();
        
        if (
          currentMatches && 
          currentMatches[0] &&
          currentMatches[0].route === context.match.route &&
          currentMatches[0].url === context.match.url &&
          currentMatches[0].queryString === context.match.queryString
        ) {
          currentMatches.forEach(match => {
            if (
              match.route.hooks && 
              match.route.hooks.already && 
              shouldProcessOption(context.navigateOptions, "callHooks")
            ) {
              match.route.hooks.already.forEach(hook => hook(context.match));
            }
          });
          done(false);
          return;
        }
        
        done();
      },
      function checkForBeforeHook(context, done) {
        if (
          context.match.route.hooks &&
          context.match.route.hooks.before &&
          shouldProcessOption(context.navigateOptions, "callHooks")
        ) {
          processQueue(
            context.match.route.hooks.before.map(hook => {
              return (_, nextDone) => {
                return hook((shouldContinue) => {
                  if (shouldContinue === false) {
                    context.instance.__markAsClean(context);
                  } else {
                    nextDone();
                  }
                }, context.match);
              };
            }).concat([() => done()]),
          );
        } else {
          done();
        }
      },
      function callRouteHandler(context, done) {
        if (shouldProcessOption(context.navigateOptions, "callHandler")) {
          context.match.route.handler(context.match);
        }
        
        context.instance.updatePageLinks();
        done();
      },
      function checkForAfterHook(context, done) {
        if (
          context.match.route.hooks &&
          context.match.route.hooks.after &&
          shouldProcessOption(context.navigateOptions, "callHooks")
        ) {
          context.match.route.hooks.after.forEach(hook => hook(context.match));
        }
        
        done();
      }
    ];
    const notFoundHandlers = [
      processLeaveHooks,
      function checkForNotFoundHandler(context, done) {
        const notFoundRoute = context.instance._notFoundRoute;
        
        if (notFoundRoute) {
          context.notFoundHandled = true;
          const [pathname, queryString] = extractGETParams(context.currentLocationPath);
          const hashString = extractHashFromURL(context.to);
          
          notFoundRoute.path = clean(pathname);
          
          const notFoundMatch = {
            url: notFoundRoute.path,
            queryString: queryString,
            hashString: hashString,
            data: null,
            route: notFoundRoute,
            params: queryString !== "" ? parseQuery(queryString) : null
          };
          
          context.matches = [notFoundMatch];
          context.match = notFoundMatch;
        }
        
        done();
      },
      processQueue.if(
        context => context.notFoundHandled,
        matchedRouteHandlers.concat([updateState]),
        [
          function notFoundWarning(context, done) {
            if (
              !context.resolveOptions ||
              context.resolveOptions.noMatchWarning !== false ||
              context.resolveOptions.noMatchWarning === undefined
            ) {
              console.warn(
                `dRouter: "${context.currentLocationPath}" didn't match any of the registered routes.`
              );
            }
            
            done();
          },
          function setCurrent(context, done) {
            context.instance._setCurrent(null);
            done();
          }
        ]
      )
    ];
  
    function objectAssign() {
      return Object.assign.apply(Object, arguments);
    }
    function processMatchedRoutes(context, done) {
      let i = 0;
      
      processLeaveHooks(context, function nextMatch() {
        if (i === context.matches.length) {
          updateState(context, done);
          return;
        }
        
        processQueue(
          matchedRouteHandlers,
          objectAssign({}, context, { match: context.matches[i] }),
          () => {
            i += 1;
            nextMatch();
          }
        );
      });
    }
    function markAsClean(context) {
      context.instance.__markAsClean(context);
    }
  
    class dRouter {
      constructor(root, options = {}) {
        this._defaultOptions = {
          strategy: "ONE",
          hash: false,
          noMatchWarning: false,
          linksSelector: DATA_ROUTER_ATTRIBUTE
        };
        
        this._options = options || this._defaultOptions;
        this._root = "/";
        this._current = null;
        this._routes = [];
        this._destroyed = false;
        this._isPushStateAvailable = isPushStateAvailable();
        this._isWindowAvailable = isWindowDefined();
        this._genericHooks = null;
        
        this.__freezeListening = false;
        this.__waiting = [];
        this.__dirty = false;
        
        if (root) {
          this._root = clean(root);
        } else {
          console.warn('dRouter requires a root path in its constructor. If not provided will use "/" as default.');
        }
        
        this._initializePopStateListener();
        this.updatePageLinks();
      }
  
      _checkForAHash(path) {
        if (path.indexOf("#") >= 0) {
          if (this._options.hash === true) {
            path = path.split("#")[1] || "/";
          } else {
            path = path.split("#")[0];
          }
        }
        return path;
      }
      _clean(path) {
        return clean(path);
      }
      _createRoute(path, handler, hooks, name) {
        path = isString(path) ? this._getFullPath(path) : path;
        
        return {
          name: name || clean(String(path)),
          path: path,
          handler: handler,
          hooks: createHooksCollection(hooks)
        };
      }
      _getFullPath(path) {
        return clean(this._root + "/" + clean(path));
      }
      _initializePopStateListener() {
        if (this._isPushStateAvailable) {
          this.__popstateListener = () => {
            if (!this.__freezeListening) {
              this.resolve();
            }
          };
          
          window.addEventListener("popstate", this.__popstateListener);
        }
      }
      _setCurrent(match) {
        this._current = match;
        return this._current;
      }
      _pathToMatchObject(path) {
        const [url, queryString] = extractGETParams(clean(path));
        const params = queryString === "" ? null : parseQuery(queryString);
        
        return {
          url: url,
          queryString: queryString,
          hashString: extractHashFromURL(path),
          route: this._createRoute(url, () => {}, [this._genericHooks], url),
          data: null,
          params: params
        };
      }
      _parseOptionsFromLink(optionsString) {
        if (!optionsString) return {};
        
        const pairs = optionsString.split(",");
        const options = {};
        let resolveOptions;
        
        pairs.forEach(pair => {
          const parts = pair.split(":").map(part => part.replace(/(^ +| +$)/g, ""));
          
          switch (parts[0]) {
            case "historyAPIMethod":
              options.historyAPIMethod = parts[1];
              break;
            case "resolveOptionsStrategy":
              if (!resolveOptions) resolveOptions = {};
              resolveOptions.strategy = parts[1];
              break;
            case "resolveOptionsHash":
              if (!resolveOptions) resolveOptions = {};
              resolveOptions.hash = parts[1] === "true";
              break;
            case "updateBrowserURL":
            case "callHandler":
            case "updateState":
            case "force":
              options[parts[0]] = parts[1] === "true";
              break;
          }
        });
        
        if (resolveOptions) {
          options.resolveOptions = resolveOptions;
        }
        
        return options;
      }
      _addHook(type, route, hook) {
        if (typeof route === "string") {
          route = this.getRoute(route);
        }
        
        if (!route) {
          console.warn("Route doesn't exist: " + route);
          return () => {};
        }
        
        if (!route.hooks[type]) route.hooks[type] = [];
        route.hooks[type].push(hook);
        
        return () => {
          route.hooks[type] = route.hooks[type].filter(h => h !== hook);
        };
      }
      
      __markAsClean(context) {
        this.__dirty = false;
        if (this.__waiting.length > 0) {
          this.__waiting.shift()();
        }
      }
  
      on(path, handler, hooks) {
        if (typeof path === "object" && !(path instanceof RegExp)) {
          Object.keys(path).forEach(p => {
            if (typeof path[p] === "function") {
              this.on(p, path[p]);
            } else {
              const { uses: handler, as: name, hooks } = path[p];
              this._routes.push(
                this._createRoute(p, handler, [this._genericHooks, hooks], name)
              );
            }
          });
          return this;
        }
        
        if (typeof path === "function") {
          hooks = handler;
          handler = path;
          path = this._root;
        }
        
        this._routes.push(
          this._createRoute(path, handler, [this._genericHooks, hooks])
        );
        
        return this;
      }
      off(path) {
        this._routes = this._routes.filter(route => {
          if (isString(path)) {
            return clean(route.path) !== clean(path);
          } else if (typeof path === "function") {
            return path !== route.handler;
          }
          return String(route.path) !== String(path);
        });
        
        return this;
      }
  
      resolve(toPath, options) {
        if (this.__dirty) {
          this.__waiting.push(() => this.resolve(toPath, options));
          return;
        }
        
        this.__dirty = true;
        toPath = toPath ? clean(this._root) + "/" + clean(toPath) : undefined;
        
        const context = {
          instance: this,
          to: toPath,
          currentLocationPath: toPath,
          navigateOptions: {},
          resolveOptions: objectAssign({}, this._options, options)
        };
        
        processQueue(
          [
            setLocationPath,
            findRouteMatches,
            processQueue.if(
              context => {
                const { matches } = context;
                return matches && matches.length > 0;
              },
              processMatchedRoutes,
              notFoundHandlers
            )
          ],
          context,
          markAsClean
        );
        
        return context.matches ? context.matches : false;
      }
      navigate(toPath, navigateOptions) {
        if (this.__dirty) {
          this.__waiting.push(() => this.navigate(toPath, navigateOptions));
          return;
        }
        
        this.__dirty = true;
        toPath = clean(this._root) + "/" + clean(toPath);
        
        const context = {
          instance: this,
          to: toPath,
          navigateOptions: navigateOptions || {},
          resolveOptions: navigateOptions && navigateOptions.resolveOptions ? navigateOptions.resolveOptions : this._options,
          currentLocationPath: this._checkForAHash(toPath)
        };
        
        processQueue(
          [
            checkNavigateOptions,
            checkForForceOption,
            findRouteMatches,
            processQueue.if(
              context => {
                const { matches } = context;
                return matches && matches.length > 0;
              },
              processMatchedRoutes,
              notFoundHandlers
            ),
            updateBrowserURL,
            markAsClean
          ],
          context,
          markAsClean
        );
      }
      navigateByName(routeName, data, options) {
        const path = this.generate(routeName, data);
        if (path !== null) {
          this.navigate(path.replace(new RegExp("^/?" + this._root), ""), options);
          return true;
        }
        return false;
      }
      generate(name, data, options) {
        const route = this._routes.find(route => route.name === name);
        let result = null;
        
        if (route) {
          result = route.path;
          if (data) {
            for (const key in data) {
              result = result.replace(":" + key, data[key]);
            }
          }
          result = result.match(/^\//) ? result : "/" + result;
        }
        
        if (result && options && !options.includeRoot) {
          result = result.replace(new RegExp("^/" + this._root), "");
        }
        
        return result;
      }
      link(path) {
        return "/" + this._root + "/" + clean(path);
      }
      hooks(hooks) {
        this._genericHooks = hooks;
        return this;
      }
      destroy() {
        this._routes = [];
        if (this._isPushStateAvailable) {
          window.removeEventListener("popstate", this.__popstateListener);
        }
        this._destroyed = true;
      }
      notFound(handler, hooks) {
        this._notFoundRoute = this._createRoute("*", handler, [this._genericHooks, hooks], "__NOT_FOUND__");
        return this;
      }
      updatePageLinks() {
        if (!this._isWindowAvailable) {
          return this;
        }
        
        const selector = this._options.linksSelector || DATA_ROUTER_ATTRIBUTE;
        const linkElements = this._isWindowAvailable 
          ? [].slice.call(document.querySelectorAll(selector)) 
          : [];
        
        linkElements.forEach(link => {
          const shouldAttach = link.getAttribute("data-drouter") !== "false" && 
                             link.getAttribute("target") !== "_blank";
          
          if (shouldAttach) {
            if (!link.hasListenerAttached) {
              link.hasListenerAttached = true;
              
              link.drouterHandler = (e) => {
                if ((e.ctrlKey || e.metaKey) && e.target.tagName.toLowerCase() === "a") {
                  return false;
                }
                
                const href = link.getAttribute("href");
                if (href === null) return false;
                
                let finalHref = href;
                if (href.match(/^(http|https)/) && typeof URL !== "undefined") {
                  try {
                    const url = new URL(href);
                    finalHref = url.pathname + url.search;
                  } catch (err) { }
                }
                
                const options = this._parseOptionsFromLink(link.getAttribute("data-drouter-options"));
                
                if (!this._destroyed) {
                  e.preventDefault();
                  e.stopPropagation();
                  this.navigate(clean(finalHref), options);
                }
              };
              
              link.addEventListener("click", link.drouterHandler);
            }
          } else if (link.hasListenerAttached) {
            link.removeEventListener("click", link.drouterHandler);
          }
        });
        
        return this;
      }
      getLinkPath(link) {
        return link.getAttribute("href");
      }
      match(path) {
        const context = {
          instance: this,
          currentLocationPath: path,
          to: path,
          navigateOptions: {},
          resolveOptions: this._options
        };
        
        findRouteMatches(context, () => {});
        return context.matches ? context.matches : false;
      }
      matchLocation(path, currentLocation, isUsingRoot) {
        if (currentLocation === undefined || (isUsingRoot !== undefined && isUsingRoot)) {
          currentLocation = this._getFullPath(currentLocation || "");
        }
        
        const context = {
          instance: this,
          to: currentLocation,
          currentLocationPath: currentLocation
        };
        
        setLocationPath(context, () => {});
        
        if (typeof path === "string") {
          path = isUsingRoot === undefined || isUsingRoot ? this._getFullPath(path) : path;
        }
        
        return matchWithParams(context, {
          name: String(path),
          path: path,
          handler: () => {},
          hooks: {}
        }) || false;
      }
      getCurrentLocation() {
        return this._pathToMatchObject(
          clean(getWindowPath(this._root)).replace(new RegExp("^" + this._root), "")
        );
      }
      addBeforeHook(route, hook) {
        return this._addHook("before", route, hook);
      }
      addAfterHook(route, hook) {
        return this._addHook("after", route, hook);
      }
      addAlreadyHook(route, hook) {
        return this._addHook("already", route, hook);
      }
      addLeaveHook(route, hook) {
        return this._addHook("leave", route, hook);
      }
      getRoute(identifier) {
        if (typeof identifier === "string") {
          return this._routes.find(route => {
            return route.name === this._getFullPath(identifier);
          });
        }
        
        return this._routes.find(route => {
          return route.handler === identifier;
        });
      }
      extractGETParameters(url) {
        return extractGETParams(this._checkForAHash(url));
      }
      lastResolved() {
        return this._current;
      }
  
      get root() {
        return this._root;
      }
      get routes() {
        return this._routes;
      }
      get destroyed() {
        return this._destroyed;
      }
      get current() {
        return this._current;
      }
    }
  
    return dRouter;
});

// event listeners
const listen = (target, event, callback, ...options) => {
  return target.addEventListener(event, callback, ...options);
};
const listenAll = (targets, event, callback, ...options) => {
  targets.forEach((target) => listen(target, event, callback, ...options));
};
// query selector
const select = (selector, scope=document) => {
  return scope.querySelector(selector);
};
const selectAll = (selector, scope=document) => {
  return Array.from(scope.querySelectorAll(selector));
};
// handle classes
const addClass = (element, className) => {
  element.classList.add(className);
};
const removeClass = (element, className) => {
  element.classList.remove(className);
};
const toggleClass = (element, className) => {
  element.classList.toggle(className);
};
// loops
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
// array/string management
const move = (input, from, to) => {
    if (typeof input === 'string') {
        const arr = input.split('');
        arr.splice(to, 0, arr.splice(from, 1)[0]);
        return arr.join('');
    }
    input.splice(to, 0, input.splice(from, 1)[0]);
    return input;
};
const remove = (input, index) => {
    if (typeof input === 'string') {
        return input.slice(0, index) + input.slice(index + 1);
    }
    input.splice(index, 1);
    return input;
};
const replace = (input, index, newItem) => {
    if (typeof input === 'string') {
        return input.slice(0, index) + newItem + input.slice(index + 1);
    }
    input.splice(index, 1, newItem);
    return input;
};
const limit = (input, limit) => {
    if (typeof input === 'string') {
        return input.slice(0, limit);
    }
    return input.slice(0, limit);
};
const uniquify = (input) => {
    if (typeof input === 'string') {
        return [...new Set(input.split(''))].join('');
    }
    return [...new Set(input)];
};
// type checks
const isUndefined = (value) => {
    return typeof value === 'undefined';
};
const isNull = (value) => {
    return value === null;
};
const isBoolean = (value) => {
    return typeof value === 'boolean' && value !== null;
};
const isNumber = (value) => {
    return typeof value === 'number' && value !== null;
};
const isInteger = (value) => {
    return typeof value === 'number' && value === Number(value);
};
const isString = (value) => {
    return typeof value === 'string' && value !== null;
};
const isEmpty = (value) => {
    if (typeof value === 'string') return value === '';
    if (Array.isArray(value)) return value.length === 0;
    return false;
};
const isFunction = (value) => {
    return typeof value === 'function' && value !== null;
};
const isArray = (value) => {
    return Array.isArray(value) && value !== null;
};
const isObject = (value) => {
    return (
        typeof value === 'object' &&
        value !== null &&
        value.constructor &&
        value.constructor === Object
    );
};
const hasValue = (value) => {
    return !isEmpty(value) && !isNull(value) && !isUndefined(value);
};
// extra
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const storage = {
  get: (key, defaultValue=null) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
const clipboard = (text) => {
  navigator.clipboard.writeText(text);
};
const uniqueId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + '-' + Date.now().toString(36);
};
const distance = (a, b) => {
    const dl = (s1, s2) => {
        const dp = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(0));

        for (let i = 0; i <= s1.length; i++) dp[0][i] = i;
        for (let j = 0; j <= s2.length; j++) dp[j][0] = j;

        for (let j = 1; j <= s2.length; j++) {
            for (let i = 1; i <= s1.length; i++) {
                if (s1[i - 1] === s2[j - 1]) {
                    dp[j][i] = dp[j - 1][i - 1];
                } else {
                    dp[j][i] = Math.min(dp[j - 1][i - 1], dp[j][i - 1], dp[j - 1][i]) + 1;
                }
            }
        }
        return dp[s2.length][s1.length];
    }
    
    const dj = (arr1, arr2) => {
        const set1 = new Set(arr1.map(JSON.stringify));
        const set2 = new Set(arr2.map(JSON.stringify));

        const intersection = new Set([...set1].filter(x => set2.has(x))).size;
        const union = set1.size + set2.size - intersection;

        return union === 0 ? 0 : 1 - intersection / union;
    }

    const dobj = (obj1, obj2) => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (let key of keys1) {
            if (!keys2.includes(key)) return false;

            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                if (!doObjectsMatch(obj1[key], obj2[key])) return false;
            } else if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }

    if (typeof a === "string" && typeof b === "string") {
        return dl(a, b) / Math.max(a.length, b.length);
    } else if (Array.isArray(a) && Array.isArray(b)) {
        return dj(a, b);
    } else if (typeof a === 'object' && typeof b === 'object') {
        return dobj(a, b) ? 0 : 1;
    } else {
        throw new Error("inputs must be either two strings, two arrays, or two objects");
    }
}
const formatDate = (input) => {
    let date = new Date(input);
    if (isNaN(date.getTime())) {
        throw new Error("invalid date input");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const localizeDate = (input) => {
    let date = new Date(input);
    if (isNaN(date.getTime())) {
        throw new Error("invalid date input");
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = {
        timeZone: userTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// haptics animation
listen(document, "DOMContentLoaded", () => {
    selectAll(".preload").forEach(el => {
        removeClass(el, "preload");
    });
});