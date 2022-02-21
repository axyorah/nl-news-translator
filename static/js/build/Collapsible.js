export class Collapsible {
    constructor(element, numChars = 20) {
        this.onMouseEnter = () => {
            this.reset();
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            this.element.appendChild(pre);
            pre.appendChild(code);
            code.innerText = this.origInnerText;
        };
        this.onMouseLeave = () => {
            this.reset();
            const span = document.createElement('span');
            this.element.appendChild(span);
            span.innerText = this.clippedInnerText;
        };
        this.element = element;
        this.numChars = numChars;
        this.origInnerText = element.innerText;
        this.clippedInnerText = this.origInnerText
            .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines on preview
            .slice(0, this.numChars) // only show first few elements on preview
            + (this.origInnerText.length > this.numChars ? '...' : ''); 
        this.init();
        this.element.addEventListener('mouseenter', this.onMouseEnter);
        this.element.addEventListener('mouseleave', this.onMouseLeave);
    }
    init() {
        this.onMouseLeave();
    }
    reset() {
        while (this.element.children.length) {
            this.element.removeChild(this.element.lastChild);
        }
    }
}
