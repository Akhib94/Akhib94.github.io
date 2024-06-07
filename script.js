document.addEventListener('DOMContentLoaded', function() {
    const phoneBrands = [
        'iPhone',
        'Infinix',
        'Oppo',
        'Poco',
        'Realme',
        'Samsung',
        'Vivo',
        'Xiaomi'
    ];

    const phoneBrandSelect = document.getElementById('phoneBrand');

    phoneBrands.sort().forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.text = brand;
        phoneBrandSelect.appendChild(option);
    });

    const lcdForm = document.getElementById('lcdForm');
    const dataTable = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const dataTableDoubled = document.getElementById('dataTableDoubled').getElementsByTagName('tbody')[0];
    const searchInput = document.getElementById('search');

    let data = JSON.parse(localStorage.getItem('lcdData')) || [];

    function sortData(dataArray) {
        return dataArray.sort((a, b) => {
            const brandA = a.phoneBrand.toLowerCase();
            const brandB = b.phoneBrand.toLowerCase();
            if (brandA < brandB) return -1;
            if (brandA > brandB) return 1;
            const typeA = a.phoneType.toLowerCase();
            const typeB = b.phoneType.toLowerCase();
            if (typeA < typeB) return -1;
            if (typeA > typeB) return 1;
            return 0;
        });
    }

    lcdForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const phoneBrand = document.getElementById('phoneBrand').value;
        const phoneType = document.getElementById('phoneType').value;
        const lcdBrand = document.getElementById('lcdBrand').value;
        const lcdPrice = document.getElementById('lcdPrice').value;

        const entry = {
            phoneBrand,
            phoneType,
            lcdBrand,
            lcdPrice
        };

        data.push(entry);
        localStorage.setItem('lcdData', JSON.stringify(data));
        renderTable(data);

        lcdForm.reset();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = data.filter(entry => 
            entry.phoneBrand.toLowerCase().includes(searchTerm) ||
            entry.phoneType.toLowerCase().includes(searchTerm) ||
            entry.lcdBrand.toLowerCase().includes(searchTerm) ||
            entry.lcdPrice.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredData);
    });

    function renderTable(dataArray) {
        dataTable.innerHTML = '';
        dataTableDoubled.innerHTML = '';

        sortData(dataArray).forEach((entry, index) => {
            const row = dataTable.insertRow();
            
            row.insertCell(0).innerText = entry.phoneBrand;
            row.insertCell(1).innerText = entry.phoneType;
            row.insertCell(2).innerText = entry.lcdBrand;
            row.insertCell(3).innerText = entry.lcdPrice;

            const actionsCell = row.insertCell(4);
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');

            editButton.innerText = 'Ubah';
            deleteButton.innerText = 'Hapus';

            editButton.onclick = function() {
                editEntry(index);
            };

            deleteButton.onclick = function() {
                deleteEntry(index);
            };

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            // Adding the same data to the second table but with price doubled
            const rowDoubled = dataTableDoubled.insertRow();
            
            rowDoubled.insertCell(0).innerText = entry.phoneBrand;
            rowDoubled.insertCell(1).innerText = entry.phoneType;
            rowDoubled.insertCell(2).innerText = entry.lcdBrand;
            rowDoubled.insertCell(3).innerText = entry.lcdPrice * 2;
        });
    }

    function editEntry(index) {
        const entry = data[index];
        document.getElementById('phoneBrand').value = entry.phoneBrand;
        document.getElementById('phoneType').value = entry.phoneType;
        document.getElementById('lcdBrand').value = entry.lcdBrand;
        document.getElementById('lcdPrice').value = entry.lcdPrice;

        data.splice(index, 1);
        localStorage.setItem('lcdData', JSON.stringify(data));
        renderTable(data);
    }

    function deleteEntry(index) {
        data.splice(index, 1);
        localStorage.setItem('lcdData', JSON.stringify(data));
        renderTable(data);
    }

    window.printTableDoubled = function() {
        const printContents = document.getElementById('dataTableDoubled').outerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        location.reload();
    }

    renderTable(data);
});
