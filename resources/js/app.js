$(document).ready(function () {
    $("select").formSelect()
})
const form = document.getElementById("transactionForm")

window.addEventListener("DOMContentLoaded", function () {
    let caregories = [
        {
            name: "Alquiler",
            imgSrc: "https://x6i2p6h3.rocketcdn.me/wp-content/uploads/2017/06/negocios-de-alquiler-1.jpg",
        },
        {
            name: "Comida",
            imgSrc: "https://www.pequerecetas.com/wp-content/uploads/2021/03/comidas-rapidas.jpg",
        },
        {
            name: "Diversion",
            imgSrc: "https://files.mormonsud.org/wp-content/uploads/2019/06/personas-2.jpg",
        },
        {
            name: "Trabajo",
            imgSrc: "https://www.abc.com.py/resizer/zI8YapDOpV7tgYfZZgxLDt3rfJ8=/fit-in/770x495/smart/arc-anglerfish-arc2-prod-abccolor.s3.amazonaws.com/public/SGMHXX55ONHBVKDC3RELVMZZCE.jpg",
        },
    ]
    addCategoriesAtSelect(caregories)
    let transactionsHistoryObject =
        JSON.parse(localStorage.getItem("transactionsHistory")) || []
    listTransactionsInTale(transactionsHistoryObject)
})

/**
 * @param {Event} e
 */
form.addEventListener("submit", function (e) {
    e.preventDefault()
    let transactionFormData = new FormData(form)
    let transactionDataObject =
        convertFormDataToTransactionObject(transactionFormData)
    insertNewTransactionAtTable(transactionDataObject)
    saveTransactionDataObject(transactionDataObject)
    form.reset()
})

/**
 * @param {Array} categories
 */
function addCategoriesAtSelect(categories) {
    let selectCategory = document.getElementById("categoryTransaction")
    categories.map((category) => {
        const { name, imgSrc } = category
        const categoryHTMLAtInsert = `<option data-icon="${imgSrc}" class="left" value="${name}">${name}</option>`
        selectCategory.insertAdjacentHTML("beforeend", categoryHTMLAtInsert)
    })
}

/**
 * @param {Array} transactionsHistoryObject
 */
function listTransactionsInTale(transactionsHistoryObject) {
    return transactionsHistoryObject.forEach((transaction) =>
        insertNewTransactionAtTable(transaction)
    )
}

function getTransactionId(reverse = false) {
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1"
    let newTransactionId = reverse
        ? parseInt(lastTransactionId) - 1
        : parseInt(lastTransactionId) + 1
    localStorage.setItem("lastTransactionId", newTransactionId)
    return newTransactionId
}

/**
 * @param {FormData} transactionFormData
 */
function convertFormDataToTransactionObject(transactionFormData) {
    return {
        tipo: transactionFormData.get("typeSelector"),
        descripcion: transactionFormData.get("descripcionTransaction"),
        monto: transactionFormData.get("montoTransaction"),
        categoria: transactionFormData.get("categoryTransaction"),
        id: getTransactionId(),
    }
}

/**
 * @param {Object} transactionDataObject
 */
function insertNewTransactionAtTable(transactionDataObject) {
    let transactionTableRef = document.getElementById("transactionTable")
    let newTransactionRowRef = transactionTableRef.insertRow(-1)
    newTransactionRowRef.setAttribute("transactionId", transactionDataObject.id)

    let typeCellRef = newTransactionRowRef.insertCell(0)
    typeCellRef.textContent = transactionDataObject.tipo
    let descripcionCellRef = newTransactionRowRef.insertCell(1)
    descripcionCellRef.textContent = transactionDataObject.descripcion
    let montoCellRef = newTransactionRowRef.insertCell(2)
    montoCellRef.textContent = `${transactionDataObject.monto} COP`
    let categoryCellRef = newTransactionRowRef.insertCell(3)
    categoryCellRef.textContent = transactionDataObject.categoria
    let actionsCellRef = newTransactionRowRef.insertCell(4)

    let deleteButton = document.createElement("button")
    deleteButton.classList.add("btn-floating")
    deleteButton.classList.add("btn-large")
    deleteButton.classList.add("waves-effect")
    deleteButton.classList.add("waves-light")
    deleteButton.classList.add("red")
    deleteButton.title = "Eliminar transaccion"

    let iconDelete = document.createElement("i")
    deleteButton.classList.add("material-icons")
    iconDelete.textContent = "close"

    deleteButton.appendChild(iconDelete)
    actionsCellRef.appendChild(deleteButton)

    deleteButton.addEventListener("click", function (e) {
        try {
            let transactionAtDelete = e.target.parentNode.parentNode.parentNode
            deleteTransaction(transactionAtDelete.getAttribute("transactionId"))
            transactionAtDelete.remove()
        } catch (error) {
            console.error(error)
        }
    })
}

/**
 * @param {Object} transactionDataObject
 */
function saveTransactionDataObject(transactionDataObject) {
    let transactionsHistory =
        JSON.parse(localStorage.getItem("transactionsHistory")) || []
    transactionsHistory.push(transactionDataObject)
    let transactionDataNew = JSON.stringify(transactionsHistory)
    return localStorage.setItem("transactionsHistory", transactionDataNew)
}

/**
 * @param {Number} transactionId
 */
function deleteTransaction(transactionId) {
    let transactionsHistory = Array.from(
        JSON.parse(localStorage.getItem("transactionsHistory"))
    )

    let transactionIndexInArray = Number(
        transactionsHistory.findIndex(
            (element) => (element.transactionId !== transactionId) - 1
        )
    )
    transactionsHistory.splice(transactionIndexInArray)
    getTransactionId(true)

    let transactionsHistoryJSON = JSON.stringify(transactionsHistory)
    localStorage.setItem("transactionsHistory", transactionsHistoryJSON)
}
