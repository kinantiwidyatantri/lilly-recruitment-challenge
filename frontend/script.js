//build and display the table
function displayMedicines(medicineData) {
    const main = document.getElementById("medicine-table");

    //clear out old content if any
    main.innerHTML = "";
  
    //create the table
    const table = document.createElement("table");
  
    //create the table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const thName = document.createElement("th");
    thName.textContent = "Medicine Name";
    const thPrice = document.createElement("th");
    thPrice.textContent = "Price";
  
    headerRow.appendChild(thName);
    headerRow.appendChild(thPrice);
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    //create table body
    const tbody = document.createElement("tbody");
  
    //loop through each medicine
    medicineData.forEach((med) => {
      const row = document.createElement("tr");
  
      //handle missing name
      const nameCell = document.createElement("td");
      nameCell.textContent = med.name || "No Medicine Name";
  
      //handle invalid price
      const priceCell = document.createElement("td");
      priceCell.textContent =
        typeof med.price === "number" ? `£${med.price}` : "No Price Data";
  
      row.appendChild(nameCell);
      row.appendChild(priceCell);
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
    main.appendChild(table);
}

//fetch medicine data and render them
function fetchMedicines(){
    fetch("http://127.0.0.1:8000/medicines")
    .then((response) => response.json())
    .then((data) => {
        displayMedicines(data.medicines);
    })
    .catch((error) => console.error("Error fetching medicine data:", error));
}
  
//handle form submission and add a new medicine
function setupFormListener(){
    const form = document.getElementById("medicine-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const newName = document.getElementById("name").value.trim();
        const newPrice = document.getElementById("price").value.trim();

        //simple validation for empty name and price
        if(!newName && !newPrice) {
            alert("Please fill in the form!")
            return;
        }

        if (!newName) {
            alert("Please enter a medicine name.");
            return;
        }

        if (!newPrice) {
            alert("Please enter a price.");
            return;
        }
          
        //prepare form data for FastAPI
        const formData = new FormData();
        formData.append("name", newName);
        formData.append("price", newPrice);

        //send POST request to add new medicine
        fetch("http://127.0.0.1:8000/create", {
            method: "POST",
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("Create response:", data);
            alert(`Successfully added: ${newName}`);

            //reset and refresh
            form.reset();
            fetchMedicines();
        })
        .catch((error) => console.error("Error fetching medicine data:", error));
    })
}

window.addEventListener("DOMContentLoaded", () => {
    fetchMedicines();
    setupFormListener();
});
