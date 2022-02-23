export function toggleExpandable(expandable) {
    expandable.addEventListener('mouseenter', function (evt) {
        const hiddensElements = this.querySelectorAll('.hidden');
        hiddensElements.forEach((hidden) => {
            hidden.style.display = 'block';
        });
        const previewElements = this.querySelectorAll('.preview');
        previewElements.forEach((preview) => {
            preview.style.display = 'none';
        });
    });
    expandable.addEventListener('mouseleave', function (evt) {
        const hiddensElements = this.querySelectorAll('.hidden');
        hiddensElements.forEach((hidden) => {
            hidden.style.display = 'none';
        });
        const previewElements = this.querySelectorAll('.preview');
        previewElements.forEach((preview) => {
            preview.style.display = 'block';
        });
    });
}
export function toggleGlobalExpandable(expandable) {
    expandable.addEventListener('click', function (evt) {
        const hiddensElements = document.querySelectorAll('.hidden-global');
        hiddensElements.forEach((hidden) => {
            if (hidden.style.visibility === '' || hidden.style.visibility === 'visible') {
                hidden.style.visibility = 'hidden';
            }
            else {
                hidden.style.visibility = '';
            }
        });
    });
}
