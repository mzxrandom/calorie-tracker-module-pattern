/*******************************************************************************/
/***                             Item Controller                             ***/
/*******************************************************************************/

const ItemController = (function() {
    
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Private Data Structure / State
    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0
    };

    // Public Functions
    return {

        // Get Items Function
        getItems: function() {
            return data.items;
        },

        // Add Item Function
        addItem: function(name, calories) {
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);

            newItem = new Item(ID, name, calories);
            
            data.items.push(newItem);

            return newItem;
        },

        // Get Item By ID Funcition
        getItemById: function(id) {
            let found = null;
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        // Update Item Function
        updateItem: function(name, calories) {
            // calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        // Delete Item Function
        deleteItem: function(id) {
            ids = data.items.map(item => {
                return item.id;
            });

            const index = ids.indexOf(id);

            data.items.splice(index, 1);
        },

        // Delete All Meals Function
        clearAllItems: function() {
            data.items = [];
        },

        // Set Current Meal Function
        setCurrentItem: function(item) {
            data.currentItem = item;
        },

        // Get Current Meal Function
        getCurrentItem: function() {
            return data.currentItem;
        },

        getTotalCalories: function() {
            let total = 0;

            // loop through items and add calories
            data.items.forEach((item) => {
                total += item.calories;
            });

            // set total cals in data structure
            data.totalCalories = total;

            // return total
            return data.totalCalories;
        },

        // Testing Function
        logData: function() {
            return data;
        }
    }
})();


/*******************************************************************************/
/***                              UI Controller                              ***/
/*******************************************************************************/

const UIController = (function() {

    // Private DOM Selectors Object
    const DOMSelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '#add-btn',
        updateBtn: '#update-btn',
        deleteBtn: '#delete-btn',
        backBtn: '#back-btn',
        clearBtn: '#clear-btn',
        itemNameInput: '#meal-name',
        itemCaloriesInput: '#meal-calories',
        totalCalories: '#total-calories'
    };
    
    // Public Functions
    return {

        // Populate Items Lists Function
        populateItemsList: function(items) {
            let html = '';

            items.forEach(function(item) {
                html += `<li id="item-${item.id}" class="list-group-item">
                            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                            <a href="#" class="btn btn-light btn-sm float-right">
                                <i class="edit-item fas fa-pen"></i>
                            </a>
                        </li>`;
            });

            // insert list items
            document.querySelector(DOMSelectors.itemList).innerHTML = html;
        },

        // Add List Item Function
        addListItem: function(item) {

            // show the list
            document.querySelector(DOMSelectors.itemList).style.display = 'block';
            
            // create li element
            const li = document.createElement('li');

            // add class
            li.className = 'list-group-item';

            // add id
            li.id = `item-${item.id}`;

            // add html
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="btn btn-light btn-sm float-right">
                <i class="edit-item fas fa-pen"></i>
            </a>`;

            // insert item
            document.querySelector(DOMSelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        // Update List Item Function
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(DOMSelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="btn btn-light btn-sm float-right">
                        <i class="edit-item fas fa-pen"></i>
                    </a>`;
                }
            });
        },

        // Delete List Item Function
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        // Get Item Input Function
        getItemInput: function() {
            return {
                name: document.querySelector(DOMSelectors.itemNameInput).value,
                calories: document.querySelector(DOMSelectors.itemCaloriesInput).value
            }
        },

        // Clear Input Funciton
        clearInput: function() {
            document.querySelector(DOMSelectors.itemNameInput).value = '';
            document.querySelector(DOMSelectors.itemCaloriesInput).value = '';
        },

        // Add Item To Form Function
        addItemToForm: function() {
            document.querySelector(DOMSelectors.itemNameInput).value = ItemController.getCurrentItem().name;
            document.querySelector(DOMSelectors.itemCaloriesInput).value = ItemController.getCurrentItem().calories;
            UIController.showEditState();
        },

        // Remove Items Function
        removeItems: function() {
            let listItems = document.querySelectorAll(DOMSelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(item => {
                item.remove();
            });

        },

        // Hide List Function
        hideList: function() {
            document.querySelector(DOMSelectors.itemList).style.display = 'none';
        },

        // Show Total Calories Function
        showTotalCalories: function(totalCalories) {
            document.querySelector(DOMSelectors.totalCalories).textContent = totalCalories;
        },

        // Clear Edit Mode Function
        clearEditState: function() {
            UIController.clearInput();
            document.querySelector(DOMSelectors.updateBtn).style.display = 'none';
            document.querySelector(DOMSelectors.deleteBtn).style.display = 'none';
            document.querySelector(DOMSelectors.backBtn).style.display = 'none';
            document.querySelector(DOMSelectors.addBtn).style.display = 'inline';
        },

        // Show Edit Mode Function
        showEditState: function() {
            document.querySelector(DOMSelectors.updateBtn).style.display = 'inline';
            document.querySelector(DOMSelectors.deleteBtn).style.display = 'inline';
            document.querySelector(DOMSelectors.backBtn).style.display = 'inline';
            document.querySelector(DOMSelectors.addBtn).style.display = 'none';
        },

        // Get DOM Selectors Function
        getSelectors: function() {
            return DOMSelectors;
        }
    }
})();




/*******************************************************************************/
/***                              App Controller                             ***/
/*******************************************************************************/

const App = (function(ItemController, UIController) {

    // Private Load Event Listeners Function
    const loadEventListeners = function() {
        // get UI selectors
        const DOMSelectors = UIController.getSelectors();

        // add item event
        document.querySelector(DOMSelectors.addBtn).addEventListener('click', addItemSubmit);

        // disable submit on enter
        document.addEventListener('keypress', e => {
            if (e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        });

        // edit icon click event
        document.querySelector(DOMSelectors.itemList).addEventListener('click', editItemClick);

        // update item event
        document.querySelector(DOMSelectors.updateBtn).addEventListener('click', updateItemSubmit);

        // delete item event
        document.querySelector(DOMSelectors.deleteBtn).addEventListener('click', deleteItemSubmit);

        // back button event
        document.querySelector(DOMSelectors.backBtn).addEventListener('click', UIController.clearEditState);

        // clear items event
        document.querySelector(DOMSelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    };

    // Private Add Item Submit Function
    const addItemSubmit = function(e) {

        // get form input from UIController
        const input = UIController.getItemInput();

        // check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            
            // Add item
            const newItem = ItemController.addItem(input.name, input.calories);
            
            // add item to the UI list
            UIController.addListItem(newItem);
            
            // get total calories
            const totalCalories = ItemController.getTotalCalories();

            // add total calories to the UI
            UIController.showTotalCalories(totalCalories);

            // clear fields
            UIController.clearInput();
        }

        e.preventDefault();
    };

    // Private Edit Item Click Function
    const editItemClick = function(e) {

        if (e.target.classList.contains('edit-item')) {

            // get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;

            // break into an array
            const listIdArr = listId.split('-');

            // get the actual id
            const id = parseInt(listIdArr[1]);

            // get item
            const itemToEdit = ItemController.getItemById(id);

            // set current item
            ItemController.setCurrentItem(itemToEdit);

            // add item to form
            UIController.addItemToForm();
        }

        e.preventDefault();
    };

    // Private Update Item Submit Function
    const updateItemSubmit = function(e) {

        // get item input
        const input = UIController.getItemInput();

        // update item
        const updatedItem = ItemController.updateItem(input.name, input.calories);

        // update UI
        UIController.updateListItem(updatedItem);

        // get total calories
        const totalCalories = ItemController.getTotalCalories();

        // add total calories to the UI
        UIController.showTotalCalories(totalCalories);

        UIController.clearEditState();

        e.preventDefault();
    };

    // Private Delete Item Submit Function
    const deleteItemSubmit = function(e) {

        // get current item
        const currentItem = ItemController.getCurrentItem();

        // delete from data structure
        ItemController.deleteItem(currentItem.id);

        // delete from UI
        UIController.deleteListItem(currentItem.id);

        // get total calories
        const totalCalories = ItemController.getTotalCalories();

        // add total calories to the UI
        UIController.showTotalCalories(totalCalories);

        UIController.clearEditState();

        e.preventDefault();
    };

    // Private Clear all items
    const clearAllItemsClick = function() {
        // delete all items from data structure
        ItemController.clearAllItems();

        // get total calories
        const totalCalories = ItemController.getTotalCalories();

        // add total calories to the UI
        UIController.showTotalCalories(totalCalories);

        // remove from UI
        UIController.removeItems();

        // hide ul
        UIController.hideList();
    };

    // Public Functions
    return {

        // Init Function
        init: function() {
            console.log('Strating app...');

            // clear edit mode / set initial state
            UIController.clearEditState();

            // fetch items from data structure
            const items = ItemController.getItems();

            // check if any items, populate if not empty
            if (items.length === 0) {
                UIController.hideList();
            } else {
                UIController.populateItemsList(items);
            }

            // get total calories
            const totalCalories = ItemController.getTotalCalories();

            // add total calories to the UI
            UIController.showTotalCalories(totalCalories);

            // load event listeners
            loadEventListeners();
        }
    }
})(ItemController, UIController);


// Initialize App
App.init();