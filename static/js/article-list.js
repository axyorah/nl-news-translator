const expandables = document.querySelectorAll('.expandable');

expandables.forEach(expandable => {
    expandable.addEventListener('mouseover', function(evt) {
        const hidden = this.querySelector('.hidden');
        hidden.style.display = 'block';
    });
    expandable.addEventListener('mouseout', function(evt) {
        const hidden = this.querySelector('.hidden');
        hidden.style.display = 'none';
    })
});