export function toggleExpandable(expandable) {
    expandable.addEventListener('mouseenter', function (evt) {
        console.log('MOUSEENTER')
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
        console.log('MOUSELEAVE')
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
