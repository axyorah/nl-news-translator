export class Collapsible {
    element: HTMLElement;
    origInnerText: string;
    clippedInnerText: string;
    numChars: number;

    constructor(element: HTMLElement, numChars: number = 20) {
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

    init(): void {
        this.onMouseLeave();
    }

    reset(): void {
        while (this.element.children.length) {
            this.element.removeChild(this.element.lastChild);
        }
    }

    onMouseEnter = (): void => {
        this.reset();
        const pre = document.createElement('pre');
        const code = document.createElement('code');

        this.element.appendChild(pre);
        pre.appendChild(code);
        code.innerText = this.origInnerText;
    }

    onMouseLeave = (): void => {
        this.reset();
        const span = document.createElement('span');
        this.element.appendChild(span);
        span.innerText = this.clippedInnerText;
    }
}