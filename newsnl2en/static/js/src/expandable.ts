export interface Hidden extends HTMLElement {
    class: 'hidden'
}

export interface Preview extends HTMLElement {
    class?: 'preview'
}

export interface ExpandableCollection  extends HTMLCollection {
    item(index: 1): Preview,
    item(index: 2): Hidden,
}

export interface Expandable extends HTMLElement {
    class: 'expandable';
    children: ExpandableCollection;
}

export interface GlobalExpandable extends HTMLElement {
    class: 'expandable-global';
}

export function toggleExpandable(expandable: Expandable): void {
    expandable.addEventListener('mouseenter', function(evt) {
        const hiddensElements: NodeListOf<HTMLElement> = this.querySelectorAll('.hidden');
        hiddensElements.forEach((hidden: HTMLElement) => {
            hidden.style.display = 'block';
        });

        const previewElements: NodeListOf<HTMLElement> = this.querySelectorAll('.preview');
        previewElements.forEach((preview: HTMLElement) => {
            preview.style.display = 'none';
        });
    });
    expandable.addEventListener('mouseleave', function(evt) {
        const hiddensElements: NodeListOf<HTMLElement> = this.querySelectorAll('.hidden');
        hiddensElements.forEach((hidden: HTMLElement) => {
            hidden.style.display = 'none';
        });

        const previewElements: NodeListOf<HTMLElement> = this.querySelectorAll('.preview');
        previewElements.forEach((preview: HTMLElement) => {
            preview.style.display = 'block';
        });
    });
}

export function toggleGlobalExpandable(expandable: GlobalExpandable): void {
    expandable.addEventListener('click', function(evt) {
        const hiddensElements: NodeListOf<HTMLElement> = document.querySelectorAll('.hidden-global');
        hiddensElements.forEach((hidden: HTMLElement) => {
            if (hidden.style.visibility === '' || hidden.style.visibility === 'visible') {
                hidden.style.visibility = 'hidden';
            }
            else {
                hidden.style.visibility = 'visible';
            }
        });
    });    
}