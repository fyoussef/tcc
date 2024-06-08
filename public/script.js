const displayErrorMessage = (show = false) => {
    const errorMsg = document.querySelector(".g-error-msg");
    errorMsg.style.display = show ? "block" : "none"
}

const search = async (form, event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    // if (!data.input) {
    //    return displayErrorMessage(true);
    // }
    const response = await fetch(`https://3000-fyoussef-tcc-465yk3tfwa3.ws-us114.gitpod.io//api/location?search=${data.input}`);
    console.log('start', new Date());
    const jsonData = await response.json();
    console.log('end', new Date());
    console.log('jsonData', jsonData);
    const tableBody = document.querySelector(".g-table-body")
    for (let i = 0; i < jsonData.length; i++) {
        const data = jsonData[i];
        tableBody.innerHTML += 
        `<tr class="g-table-row-tada">
            <td class="g-table-tada">${data.date}</td>
            <td class="g-table-tada">${data.adjClose}</td>
            <td class="g-table-tada">${data.close}</td>
            <td class="g-table-tada">${data.exchange}</td>
            <td class="g-table-tada">${data.high}</td>
            <td class="g-table-tada">${data.low}</td>
            <td class="g-table-tada">${data.open}</td>
            <td class="g-table-tada">${data.ticker}</td>
            <td class="g-table-tada">${data.volume}</td>
        </tr>`
    }
}