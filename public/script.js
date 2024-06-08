const search = (form, event) => {
    event.preventDefault()
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
}