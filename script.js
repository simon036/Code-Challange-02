let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

const itemInput = document.getElementById('item-input');
const priceInput = document.getElementById('price-input');
const quantityInput = document.getElementById('quantity-input');
const addButton = document.getElementById('add-button');
const clearButton = document.getElementById('clear-button');
const shoppingListContainer = document.getElementById('shopping-list');
const totalAmountDisplay = document.getElementById('total-amount');

//Function to render the shopping list
function displayList() {
    shoppingListContainer.innerHTML = '';
    let totalAmount = 0;

    shoppingList.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.purchased;
        checkbox.className = 'checkbox';
        checkbox.addEventListener('change', () => {
            item.purchased = checkbox.checked;
            saveList();
            displayList();
        });

        listItem.appendChild(checkbox);
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        listItem.appendChild(document.createTextNode(`${item.text} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}`));
        
        if (item.purchased) {
            listItem.classList.add('purchased');
        }
                // Create a button to mark as purchased
                const markButton = document.createElement('button');
                markButton.textContent = item.purchased ? 'Unmark' : 'Mark Purchased';
                markButton.onclick = () => {
                    item.purchased = !item.purchased;
                    saveList();
                    displayList();
                };

        //Edit item
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent marking as purchased
            const newItemText = prompt('Edit item:', item.text);
            const newItemPrice = prompt('Edit price:', item.price);
            const newItemQuantity = prompt('Edit quantity:', item.quantity);
            if (newItemText && newItemPrice && newItemQuantity) {
                item.text = newItemText;
                item.price = parseFloat(newItemPrice);
                item.quantity = parseInt(newItemQuantity);
                saveList();
                displayList();
            }
        });

        listItem.appendChild(editButton);
        shoppingListContainer.appendChild(listItem);
    });

    //Updates the total amount of money and displays it
    totalAmountDisplay.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
}

//Function to save the list to a local storage
function saveList() {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

//Adds item to the list
addButton.addEventListener('click', () => {
    const itemText = itemInput.value.trim();
    const itemPrice = parseFloat(priceInput.value);
    const itemQuantity = parseInt(quantityInput.value);

    if (itemText && !isNaN(itemPrice) && itemQuantity > 0) {
        shoppingList.push({ text: itemText, price: itemPrice, quantity: itemQuantity, purchased: false });
        itemInput.value = '';
        priceInput.value = '';
        quantityInput.value = 1; // Reset quantity to 1
        saveList();
        displayList();
    } else {
        alert('Please enter a valid item, price, and quantity.');
    }
});

//Clears the list
clearButton.addEventListener('click', () => {
    shoppingList = [];
    saveList();
    displayList();
});

//Initial render
displayList();