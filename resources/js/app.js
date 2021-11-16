 const form = document.getElementById("transactionForm")

            window.addEventListener("DOMContentLoaded", function () {
                let transactionsHistoryObject =
                    JSON.parse(localStorage.getItem("transactionsHistory")) ||
                    []
                console.log(transactionsHistoryObject)
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
             * @param {Number} transactionId
             */
            function deleteTransaction(transactionId) {
                let transactionsHistory = Array(
                    JSON.parse(localStorage.getItem("transactionsHistory"))
                )

                let transactionIndexInArray = Number(
                    transactionsHistory.findIndex(
                        (element) => element.transactionId !== transactionId
                    )
                )

                transactionsHistory.splice(transactionIndexInArray)

                let transactionsHistoryJSON =
                    JSON.stringify(transactionsHistory)
                localStorage.setItem(
                    "transactionsHistory",
                    transactionsHistoryJSON
                )
            }

            /**
             * @param {Array} transactionsHistoryObject
             */
            function listTransactionsInTale(transactionsHistoryObject) {
                return transactionsHistoryObject.forEach((transaction) =>
                    insertNewTransactionAtTable(transaction)
                )
            }

            function getTransactionId() {
                let lastTransactionId =
                    localStorage.getItem("lastTransactionId") || "-1"
                let newTransactionId = parseInt(lastTransactionId) + 1
                localStorage.setItem("lastTransactionId", newTransactionId)
                return newTransactionId
            }

            /**
             * @param {FormData} transactionFormData
             */
            function convertFormDataToTransactionObject(transactionFormData) {
                return {
                    tipo: transactionFormData.get("typeSelector"),
                    descripcion: transactionFormData.get(
                        "descripcionTransaction"
                    ),
                    monto: transactionFormData.get("montoTransaction"),
                    categoria: transactionFormData.get("categoryTransaction"),
                    id: getTransactionId(),
                }
            }

            /**
             * @param {Object} transactionDataObject
             */
            function insertNewTransactionAtTable(transactionDataObject) {
                let transactionTableRef =
                    document.getElementById("transactionTable")
                let newTransactionRowRef = transactionTableRef.insertRow(-1)
                newTransactionRowRef.setAttribute(
                    "transactionId",
                    transactionDataObject.id
                )

                let typeCellRef = newTransactionRowRef.insertCell(0)
                typeCellRef.textContent = transactionDataObject.tipo
                let descripcionCellRef = newTransactionRowRef.insertCell(1)
                descripcionCellRef.textContent =
                    transactionDataObject.descripcion
                let montoCellRef = newTransactionRowRef.insertCell(2)
                montoCellRef.textContent = transactionDataObject.monto
                let categoryCellRef = newTransactionRowRef.insertCell(3)
                categoryCellRef.textContent = transactionDataObject.categoria
                let actionsCellRef = newTransactionRowRef.insertCell(4)

                let deleteButton = document.createElement("button")
                deleteButton.textContent = "Eliminar"
                actionsCellRef.appendChild(deleteButton)

                deleteButton.addEventListener("click", function (e) {
                    let transactionAtDelete = e.target.parentNode.parentNode
                    transactionAtDelete.remove()
                    deleteTransaction(
                        transactionAtDelete.getAttribute("transactionId")
                    )
                })
            }

            /**
             * @param {Object} transactionDataObject
             */
            function saveTransactionDataObject(transactionDataObject) {
                let transactionsHistory =
                    JSON.parse(localStorage.getItem("transactionsHistory")) ||
                    []
                transactionsHistory.push(transactionDataObject)
                let transactionDataNew = JSON.stringify(transactionsHistory)
                return localStorage.setItem(
                    "transactionsHistory",
                    transactionDataNew
                )
            }